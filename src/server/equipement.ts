"use server";
import { db } from "@/server/db";
import { equipments } from "@/db/schema";
import { eq } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";

type EquipmentCreateInput = {
  name: string;
  machineName?: string;
  subAssemblies?: string;
  criticalityIndex?: number;
  plan?: string;
  characteristics?: string;
  technicalFolder?: string;
  failureOccurrence?: number;
  mtbf?: number;
  mttr?: number;
  image?: string;
};

type EquipmentUpdateInput = Partial<EquipmentCreateInput>;

export const addEquipement = async (data: EquipmentCreateInput) => {
    try {
        const equipement = await db.insert(equipments).values({
            id: createId(),
            ...data,
            createdAt: new Date(),
            updatedAt: new Date(),
        }).returning();
        
        return {
            success: true,
            message: "Equipement ajouté avec succès",
            data: equipement[0]
        }
    } catch (error) {
        console.error(error)
        const e = error as Error
        return {
            success: false,
            message: e.message || "Erreur lors de l'ajout de l'équipement"
        }
    }
}

export const getEquipements = async () => {
    try {
        const equipementsList = await db.select().from(equipments);
        return {
            success: true,
            message: "Equipements récupérés avec succès",
            data: equipementsList
        }
    } catch (error) {
        console.error(error)
        const e = error as Error
        return {
            success: false,
            message: e.message || "Erreur lors de la récupération des équipements"
        }
    }
}

export const getEquipementById = async (id: string) => {
    try {
        const equipement = await db.select().from(equipments).where(eq(equipments.id, id)).limit(1);
        return {
            success: true,
            message: "Equipement récupéré avec succès",
            data: equipement[0] || null
        }
    } catch (error) {
        console.error(error)
        const e = error as Error
        return {
            success: false,
            message: e.message || "Erreur lors de la récupération de l'équipement"
        }
    }
}

export const deleteEquipement = async (id: string) => {
    try {
        await db.delete(equipments).where(eq(equipments.id, id));
        return {
            success: true,
            message: "Equipement supprimé avec succès"
        }
    } catch (error) {
        console.error(error)
        const e = error as Error
        return {
            success: false,
            message: e.message || "Erreur lors de la suppression de l'équipement"
        }
    }
}

export const updateEquipement = async (id: string, data: EquipmentUpdateInput) => {
    try {
        const equipement = await db.update(equipments)
            .set({
                ...data,
                updatedAt: new Date(),
            })
            .where(eq(equipments.id, id))
            .returning();
            
        return {
            success: true,
            message: "Equipement modifié avec succès",
            data: equipement[0]
        }
    } catch (error) {
        console.error(error)
        const e = error as Error
        return {
            success: false,
            message: e.message || "Erreur lors de la modification de l'équipement"
        }
    }
}