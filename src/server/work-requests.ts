"use server";
import { db } from "@/server/db";
import { workRequests, equipments } from "@/db/schema";
import { eq, sql, gte, lte, and } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";
import { getCurrentUser } from "@/lib/auth-helpers";

type WorkRequestCreateInput = {
  requestNumber: string;
  requesterLastName: string;
  requesterFirstName: string;
  equipmentName: string;
  failureType: string;
  failureDescription: string;
  equipmentId?: string;
  createdById?: string; // Sera automatiquement rempli
};

type WorkRequestUpdateInput = Partial<WorkRequestCreateInput>;

export const addWorkRequest = async (data: WorkRequestCreateInput) => {
    try {
        // Récupérer l'utilisateur connecté
        const currentUser = await getCurrentUser();
        if (!currentUser) {
            return {
                success: false,
                message: "Utilisateur non connecté"
            }
        }

        // Utiliser une transaction pour s'assurer que les deux opérations réussissent
        const result = await db.transaction(async (tx) => {
            // 1. Créer la demande de travaux
            const workRequest = await tx.insert(workRequests).values({
                id: createId(),
                ...data,
                createdById: currentUser.id, // Remplir automatiquement avec l'utilisateur connecté
            }).returning();

            // 2. Incrémenter le failureOccurrence de l'équipement si equipmentId est fourni
            if (data.equipmentId) {
                await tx.update(equipments)
                    .set({
                        failureOccurrence: sql`COALESCE(${equipments.failureOccurrence}, 0) + 1`,
                        updatedAt: new Date()
                    })
                    .where(eq(equipments.id, data.equipmentId));
            }

            return workRequest[0];
        });
        
        return {
            success: true,
            message: "Demande de travaux ajoutée avec succès et compteur de pannes mis à jour",
            data: result
        }
    } catch (error) {
        console.error(error)
        const e = error as Error
        return {
            success: false,
            message: e.message || "Erreur lors de l'ajout de la demande de travaux"
        }
    }
}

export const getWorkRequests = async () => {
    try {
        const workRequestsList = await db.select().from(workRequests);
        return {
            success: true,
            message: "Demandes de travaux récupérées avec succès",
            data: workRequestsList
        }
    } catch (error) {
        console.error(error)
        const e = error as Error
        return {
            success: false,
            message: e.message || "Erreur lors de la récupération des demandes de travaux"
        }
    }
}

export const getWorkRequestById = async (id: string) => {
    try {
        const workRequest = await db.select().from(workRequests).where(eq(workRequests.id, id)).limit(1);
        return {
            success: true,
            message: "Demande de travaux récupérée avec succès",
            data: workRequest[0] || null
        }
    } catch (error) {
        console.error(error)
        const e = error as Error
        return {
            success: false,
            message: e.message || "Erreur lors de la récupération de la demande de travaux"
        }
    }
}

export const deleteWorkRequest = async (id: string) => {
    try {
        await db.delete(workRequests).where(eq(workRequests.id, id));
        return {
            success: true,
            message: "Demande de travaux supprimée avec succès"
        }
    } catch (error) {
        console.error(error)
        const e = error as Error
        return {
            success: false,
            message: e.message || "Erreur lors de la suppression de la demande de travaux"
        }
    }
}

export const updateWorkRequest = async (id: string, data: WorkRequestUpdateInput) => {
    try {
        const workRequest = await db.update(workRequests)
            .set({
                ...data,
                updatedAt: new Date(),
            })
            .where(eq(workRequests.id, id))
            .returning();
            
        return {
            success: true,
            message: "Demande de travaux modifiée avec succès",
            data: workRequest[0]
        }
    } catch (error) {
        console.error(error)
        const e = error as Error
        return {
            success: false,
            message: e.message || "Erreur lors de la modification de la demande de travaux"
        }
    }
}

export const getWorkRequestStatistics = async (year: number = new Date().getFullYear()) => {
    try {
        // Créer les dates de début et fin de l'année
        const startDate = new Date(year, 0, 1); // 1er janvier
        const endDate = new Date(year, 11, 31, 23, 59, 59); // 31 décembre

        // Récupérer toutes les demandes de travaux de l'année
        const workRequestsData = await db.select({
            failureType: workRequests.failureType,
            createdAt: workRequests.createdAt
        })
        .from(workRequests)
        .where(
            and(
                gte(workRequests.createdAt, startDate),
                lte(workRequests.createdAt, endDate)
            )
        );

        // Initialiser les données par mois et type de panne
        const monthlyStats: { [key: string]: { [month: number]: number } } = {
            'mécanique': {},
            'électrique': {},
            'hydraulique': {}
        };

        // Initialiser tous les mois à 0
        for (let month = 0; month < 12; month++) {
            monthlyStats['mécanique'][month] = 0;
            monthlyStats['électrique'][month] = 0;
            monthlyStats['hydraulique'][month] = 0;
        }

        // Compter les pannes par mois et type
        workRequestsData.forEach(request => {
            const month = request.createdAt.getMonth();
            const failureType = request.failureType.toLowerCase();
            
            if (monthlyStats[failureType]) {
                monthlyStats[failureType][month]++;
            }
        });

        // Convertir en format pour le graphique
        const chartData = {
            categories: [
                'Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun',
                'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'
            ],
            series: [
                {
                    name: 'Pannes Mécaniques',
                    data: Object.values(monthlyStats['mécanique'])
                },
                {
                    name: 'Pannes Électriques',
                    data: Object.values(monthlyStats['électrique'])
                },
                {
                    name: 'Pannes Hydrauliques',
                    data: Object.values(monthlyStats['hydraulique'])
                }
            ]
        };

        return {
            success: true,
            message: "Statistiques récupérées avec succès",
            data: chartData
        };
    } catch (error) {
        console.error(error);
        const e = error as Error;
        return {
            success: false,
            message: e.message || "Erreur lors de la récupération des statistiques"
        };
    }
};