"use server";
import { db } from "@/server/db";
import { interventionReports } from "@/db/schema";
import { eq } from "drizzle-orm";
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

        const interventionReport = await db.insert(interventionReports).values({
            id: createId(),
            ...data,
            createdById: currentUser.id, // Utiliser l'ID de l'utilisateur connecté
        }).returning();
        
        return {
            success: true,
            message: "Compte rendu d'intervention ajouté avec succès",
            data: interventionReport[0]
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