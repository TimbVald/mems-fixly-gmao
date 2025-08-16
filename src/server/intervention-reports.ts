"use server";
import { db } from "@/server/db";
import { interventionReports, equipments, workRequests, workOrders } from "@/db/schema";
import { eq, sql, desc } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";
import { getCurrentUser } from "@/lib/auth-helpers";

type InterventionReportCreateInput = {
  reportNumber: string;
  workOrderNumber?: string;
  failureType: string;
  failureDescription: string;
  interventionType: string;
  materialUsed?: string;
  numberOfIntervenants: number;
  causes: string;
  symptoms: string;
  effectsOnEquipment: string;
  repairTime: number;
  stepsFollowed: string;
  equipmentId?: string;
  createdById?: string; // Optionnel car géré automatiquement côté serveur
};

type InterventionReportUpdateInput = Partial<InterventionReportCreateInput>;

export const addInterventionReport = async (data: InterventionReportCreateInput) => {
    try {
        // Récupérer l'utilisateur connecté
        const currentUser = await getCurrentUser();
        if (!currentUser) {
            return {
                success: false,
                message: "Utilisateur non connecté"
            }
        }

        // Utiliser une transaction pour s'assurer que les opérations réussissent
        const result = await db.transaction(async (tx) => {
            // 1. Créer le rapport d'intervention
            const interventionReport = await tx.insert(interventionReports).values({
                id: createId(),
                ...data,
                createdById: currentUser.id, // Utiliser l'ID de l'utilisateur connecté
            }).returning();

            // 2. Mettre à jour l'équipement si equipmentId est fourni
            if (data.equipmentId) {
                // Récupérer les données actuelles de l'équipement
                const currentEquipment = await tx.select({
                    failureOccurrence: equipments.failureOccurrence,
                    mtbf: equipments.mtbf,
                    mttr: equipments.mttr,
                    createdAt: equipments.createdAt
                }).from(equipments).where(eq(equipments.id, data.equipmentId)).limit(1);

                if (currentEquipment.length > 0) {
                    const equipment = currentEquipment[0];
                    const currentFailureOccurrence = equipment.failureOccurrence || 0;
                    const newFailureOccurrence = currentFailureOccurrence + 1;

                    // Récupérer toutes les demandes d'intervention précédentes pour cet équipement
                    const allWorkRequests = await tx.select({
                        createdAt: workRequests.createdAt
                    }).from(workRequests)
                    .where(eq(workRequests.equipmentId, data.equipmentId))
                    .orderBy(desc(workRequests.createdAt));

                    // Récupérer tous les rapports d'intervention précédents pour calculer le temps total de réparation
                    const allInterventionReports = await tx.select({
                        repairTime: interventionReports.repairTime
                    }).from(interventionReports)
                    .where(eq(interventionReports.equipmentId, data.equipmentId));

                    // Calculer le temps total de bon fonctionnement
                    let totalOperatingTime = 0;
                    const now = new Date();
                    
                    if (allWorkRequests.length > 0) {
                        // Temps depuis la création de l'équipement jusqu'à la première panne
                        const firstFailureTime = allWorkRequests[allWorkRequests.length - 1].createdAt.getTime();
                        const equipmentCreationTime = equipment.createdAt.getTime();
                        totalOperatingTime += (firstFailureTime - equipmentCreationTime) / (1000 * 60); // en minutes
                        
                        // Temps entre chaque panne (temps de bon fonctionnement entre les pannes)
                        for (let i = allWorkRequests.length - 1; i > 0; i--) {
                            const currentFailureTime = allWorkRequests[i].createdAt.getTime();
                            const previousFailureTime = allWorkRequests[i - 1].createdAt.getTime();
                            totalOperatingTime += (previousFailureTime - currentFailureTime) / (1000 * 60);
                        }
                        
                        // Temps depuis la dernière panne jusqu'à maintenant
                        const lastFailureTime = allWorkRequests[0].createdAt.getTime();
                        totalOperatingTime += (now.getTime() - lastFailureTime) / (1000 * 60);
                    } else {
                        // Si pas de panne précédente, utiliser le temps depuis la création de l'équipement
                        totalOperatingTime = (now.getTime() - equipment.createdAt.getTime()) / (1000 * 60);
                    }

                    // Calculer le temps total de réparation (incluant le rapport actuel)
                    let totalRepairTime = data.repairTime; // Temps de réparation du rapport actuel
                    allInterventionReports.forEach(report => {
                        totalRepairTime += report.repairTime || 0;
                    });

                    // Calculer MTBF et MTTR selon les formules
                    let newMTBF = 0;
                    let newMTTR = 0;

                    if (newFailureOccurrence > 0) {
                        // MTTR = Temps total de réparation / Nombre d'occurrences
                        newMTTR = totalRepairTime / newFailureOccurrence;
                        
                        if (newFailureOccurrence > 1) {
                            // MTBF = Temps de bon fonctionnement avant la panne / (Nombre d'occurrences - 1)
                            newMTBF = totalOperatingTime / (newFailureOccurrence - 1);
                        } else {
                            // Pour la première occurrence, MTBF = temps de fonctionnement total
                            newMTBF = totalOperatingTime;
                        }
                    }

                    // Mettre à jour l'équipement avec les nouvelles valeurs
                    await tx.update(equipments)
                        .set({
                            failureOccurrence: newFailureOccurrence,
                            mtbf: Math.max(0, Math.round(newMTBF * 100) / 100), // Arrondir à 2 décimales
                            mttr: Math.max(0, Math.round(newMTTR * 100) / 100), // Arrondir à 2 décimales
                            updatedAt: new Date()
                        })
                        .where(eq(equipments.id, data.equipmentId));
                }
            }

            // 3. Mettre à jour le statut reportCompleted de l'ordre de travail et de la demande d'intervention
            if (data.workOrderNumber) {
                // Mettre à jour l'ordre de travail
                await tx.update(workOrders)
                    .set({
                        reportCompleted: true,
                        updatedAt: new Date()
                    })
                    .where(eq(workOrders.workOrderNumber, data.workOrderNumber));

                // Récupérer l'ordre de travail pour obtenir le workRequestNumber
                const workOrder = await tx.select({
                    workRequestNumber: workOrders.workRequestNumber
                }).from(workOrders)
                .where(eq(workOrders.workOrderNumber, data.workOrderNumber))
                .limit(1);

                if (workOrder.length > 0) {
                    // Mettre à jour la demande d'intervention
                    await tx.update(workRequests)
                        .set({
                            reportCompleted: true,
                            updatedAt: new Date()
                        })
                        .where(eq(workRequests.requestNumber, workOrder[0].workRequestNumber));
                }
            }

            return interventionReport[0];
        });
        
        return {
            success: true,
            message: "Compte rendu d'intervention ajouté avec succès",
            data: result
        }
    } catch (error) {
        console.error(error)
        const e = error as Error
        return {
            success: false,
            message: e.message || "Erreur lors de l'ajout du compte rendu d'intervention"
        }
    }
}

export const getInterventionReports = async () => {
    try {
        const interventionReportsList = await db.select().from(interventionReports);
        return {
            success: true,
            message: "Comptes rendus d'intervention récupérés avec succès",
            data: interventionReportsList
        }
    } catch (error) {
        console.error(error)
        const e = error as Error
        return {
            success: false,
            message: e.message || "Erreur lors de la récupération des comptes rendus d'intervention"
        }
    }
}

export const getInterventionReportById = async (id: string) => {
    try {
        const interventionReport = await db.select().from(interventionReports).where(eq(interventionReports.id, id)).limit(1);
        return {
            success: true,
            message: "Compte rendu d'intervention récupéré avec succès",
            data: interventionReport[0] || null
        }
    } catch (error) {
        console.error(error)
        const e = error as Error
        return {
            success: false,
            message: e.message || "Erreur lors de la récupération du compte rendu d'intervention"
        }
    }
}

export const deleteInterventionReport = async (id: string) => {
    try {
        await db.delete(interventionReports).where(eq(interventionReports.id, id));
        return {
            success: true,
            message: "Compte rendu d'intervention supprimé avec succès"
        }
    } catch (error) {
        console.error(error)
        const e = error as Error
        return {
            success: false,
            message: e.message || "Erreur lors de la suppression du compte rendu d'intervention"
        }
    }
}

export const updateInterventionReport = async (id: string, data: InterventionReportUpdateInput) => {
    try {
        const interventionReport = await db.update(interventionReports)
            .set({
                ...data,
                updatedAt: new Date(),
            })
            .where(eq(interventionReports.id, id))
            .returning();
            
        return {
            success: true,
            message: "Compte rendu d'intervention modifié avec succès",
            data: interventionReport[0]
        }
    } catch (error) {
        console.error(error)
        const e = error as Error
        return {
            success: false,
            message: e.message || "Erreur lors de la modification du compte rendu d'intervention"
        }
    }
}