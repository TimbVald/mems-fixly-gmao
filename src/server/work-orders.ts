"use server";
import { db } from "@/server/db";
import { workOrders } from "@/db/schema";
import { eq } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";

type WorkOrderCreateInput = {
  workOrderNumber: string;
  workRequestNumber: string;
  interventionType: string;
  numberOfIntervenants: number;
  interventionDateTime: Date;
  approximateDuration?: number;
  stepsToFollow: string;
  createdById: string;
};

type WorkOrderUpdateInput = Partial<WorkOrderCreateInput>;

export const addWorkOrder = async (data: WorkOrderCreateInput) => {
    try {
        const workOrder = await db.insert(workOrders).values({
            id: createId(),
            ...data,
        }).returning();
        
        return {
            success: true,
            message: "Ordre de travail ajouté avec succès",
            data: workOrder[0]
        }
    } catch (error) {
        console.error(error)
        const e = error as Error
        return {
            success: false,
            message: e.message || "Erreur lors de l'ajout de l'ordre de travail"
        }
    }
}

export const getWorkOrders = async () => {
    try {
        const workOrdersList = await db.select().from(workOrders);
        return {
            success: true,
            message: "Ordres de travail récupérés avec succès",
            data: workOrdersList
        }
    } catch (error) {
        console.error(error)
        const e = error as Error
        return {
            success: false,
            message: e.message || "Erreur lors de la récupération des ordres de travail"
        }
    }
}

export const getWorkOrderById = async (id: string) => {
    try {
        const workOrder = await db.select().from(workOrders).where(eq(workOrders.id, id)).limit(1);
        return {
            success: true,
            message: "Ordre de travail récupéré avec succès",
            data: workOrder[0] || null
        }
    } catch (error) {
        console.error(error)
        const e = error as Error
        return {
            success: false,
            message: e.message || "Erreur lors de la récupération de l'ordre de travail"
        }
    }
}

export const deleteWorkOrder = async (id: string) => {
    try {
        await db.delete(workOrders).where(eq(workOrders.id, id));
        return {
            success: true,
            message: "Ordre de travail supprimé avec succès"
        }
    } catch (error) {
        console.error(error)
        const e = error as Error
        return {
            success: false,
            message: e.message || "Erreur lors de la suppression de l'ordre de travail"
        }
    }
}

export const updateWorkOrder = async (id: string, data: WorkOrderUpdateInput) => {
    try {
        const workOrder = await db.update(workOrders)
            .set({
                ...data,
                updatedAt: new Date(),
            })
            .where(eq(workOrders.id, id))
            .returning();
            
        return {
            success: true,
            message: "Ordre de travail modifié avec succès",
            data: workOrder[0]
        }
    } catch (error) {
        console.error(error)
        const e = error as Error
        return {
            success: false,
            message: e.message || "Erreur lors de la modification de l'ordre de travail"
        }
    }
}