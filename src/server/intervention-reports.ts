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

            // 2. Mettre à jour l'équipement si equipmentId est fourni et si c'est une intervention corrective
            if (data.equipmentId && data.interventionType === 'corrective') {
                // Récupérer les données actuelles de l'équipement
                const currentEquipment = await tx.select({
                    failureOccurrence: equipments.failureOccurrence,
                    createdAt: equipments.createdAt
                }).from(equipments).where(eq(equipments.id, data.equipmentId)).limit(1);

                if (currentEquipment.length > 0) {
                    const equipment = currentEquipment[0];
                    const currentFailureOccurrence = equipment.failureOccurrence || 0;
                    const newFailureOccurrence = currentFailureOccurrence + 1;

                    // Récupérer la dernière demande d'intervention pour cet équipement
                    const lastWorkRequest = await tx.select({
                        createdAt: workRequests.createdAt
                    }).from(workRequests)
                    .where(eq(workRequests.equipmentId, data.equipmentId))
                    .orderBy(desc(workRequests.createdAt))
                    .limit(1);

                    // Calculer le temps de bon fonctionnement avant la panne
                    let operatingTimeBeforeFailure = 0;
                    if (lastWorkRequest.length > 0) {
                        // Temps entre la dernière demande d'intervention et maintenant (en minutes)
                        const timeDiff = new Date().getTime() - lastWorkRequest[0].createdAt.getTime();
                        operatingTimeBeforeFailure = Math.max(0, timeDiff / (1000 * 60)); // Convertir en minutes
                    } else {
                        // Si pas de demande précédente, utiliser le temps depuis la création de l'équipement
                        const timeDiff = new Date().getTime() - equipment.createdAt.getTime();
                        operatingTimeBeforeFailure = Math.max(0, timeDiff / (1000 * 60)); // Convertir en minutes
                    }

                    // Calculer le nouveau MTBF et MTTR selon les formules de l'image
                    let newMTBF = 0;
                    let newMTTR = 0;

                    if (newFailureOccurrence > 0) {
                        // MTTR = Temps total mis pour la réparation / Nombre d'occurrences
                        // Pour simplifier, on utilise le repairTime actuel comme base
                        newMTTR = data.repairTime;

                        if (newFailureOccurrence > 1) {
                            // MTBF = Temps de bon fonctionnement avant la panne / (Nombre d'occurrences - 1)
                            newMTBF = operatingTimeBeforeFailure / (newFailureOccurrence - 1);
                        } else {
                            // Pour la première occurrence, MTBF = temps de fonctionnement total
                            newMTBF = operatingTimeBeforeFailure;
                        }
                    }

                    // Mettre à jour l'équipement avec les nouvelles valeurs
                    await tx.update(equipments)
                        .set({
                            failureOccurrence: newFailureOccurrence,
                            mtbf: Math.max(0, newMTBF),
                            mttr: Math.max(0, newMTTR),
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