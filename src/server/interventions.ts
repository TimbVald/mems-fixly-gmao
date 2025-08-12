"use server";
import { db } from "@/server/db";
import { workRequests, workOrders, interventionReports, equipments, users } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";

// Types pour les demandes de travaux
export interface WorkRequest {
  id: string;
  requestNumber: string;
  requesterLastName: string;
  requesterFirstName: string;
  failureType: string;
  failureDescription: string;
  workOrderAssigned: boolean | null;
  reportCompleted: boolean | null;
  createdAt: Date;
  updatedAt: Date;
  equipmentId: string | null;
  createdById: string;
  equipment?: {
    id: string;
    name: string;
  };
  createdBy?: {
    id: string;
    name: string;
  };
}

// Types pour les ordres de travail
export interface WorkOrder {
  id: string;
  workOrderNumber: string;
  workRequestNumber: string;
  interventionType: string;
  numberOfIntervenants: number;
  interventionDateTime: Date;
  approximateDuration: number | null;
  stepsToFollow: string;
  createdAt: Date;
  updatedAt: Date;
  createdById: string;
  createdBy?: {
    id: string;
    name: string;
  };
}

// Types pour les rapports d'intervention
export interface InterventionReport {
  id: string;
  reportNumber: string;
  workOrderNumber: string | null;
  failureType: string;
  failureDescription: string;
  interventionType: string;
  materialUsed: string | null;
  numberOfIntervenants: number;
  causes: string;
  symptoms: string;
  effectsOnEquipment: string;
  repairTime: number;
  stepsFollowed: string;
  createdAt: Date;
  updatedAt: Date;
  equipmentId: string | null;
  createdById: string;
  equipment?: {
    id: string;
    name: string;
  };
  createdBy?: {
    id: string;
    name: string;
  };
}

// Récupérer toutes les demandes de travaux
export const getWorkRequests = async () => {
  try {
    const result = await db
      .select({
        id: workRequests.id,
        requestNumber: workRequests.requestNumber,
        requesterLastName: workRequests.requesterLastName,
        requesterFirstName: workRequests.requesterFirstName,
        failureType: workRequests.failureType,
        failureDescription: workRequests.failureDescription,
        workOrderAssigned: workRequests.workOrderAssigned,
        reportCompleted: workRequests.reportCompleted,
        createdAt: workRequests.createdAt,
        updatedAt: workRequests.updatedAt,
        equipmentId: workRequests.equipmentId,
        createdById: workRequests.createdById,
        equipment: {
          id: equipments.id,
          name: equipments.name,
        },
        createdBy: {
          id: users.id,
          name: users.name,
        },
      })
      .from(workRequests)
      .leftJoin(equipments, eq(workRequests.equipmentId, equipments.id))
      .leftJoin(users, eq(workRequests.createdById, users.id))
      .orderBy(desc(workRequests.createdAt));

    const data = result.map(item => ({
      ...item,
      equipment: item.equipment?.id ? item.equipment : undefined,
      createdBy: item.createdBy?.id ? item.createdBy : undefined,
    }));

    return {
      success: true,
      message: "Demandes de travail récupérées avec succès",
      data
    }
  } catch (error) {
    console.error(error)
    const e = error as Error
    return {
      success: false,
      message: e.message || "Erreur lors de la récupération des demandes de travail"
    }
  }
}

// Récupérer tous les ordres de travail
export const getWorkOrders = async () => {
  try {
    const result = await db
      .select({
        id: workOrders.id,
        workOrderNumber: workOrders.workOrderNumber,
        workRequestNumber: workOrders.workRequestNumber,
        interventionType: workOrders.interventionType,
        numberOfIntervenants: workOrders.numberOfIntervenants,
        interventionDateTime: workOrders.interventionDateTime,
        approximateDuration: workOrders.approximateDuration,
        stepsToFollow: workOrders.stepsToFollow,
        createdAt: workOrders.createdAt,
        updatedAt: workOrders.updatedAt,
        createdById: workOrders.createdById,
        createdBy: {
          id: users.id,
          name: users.name,
        },
      })
      .from(workOrders)
      .leftJoin(users, eq(workOrders.createdById, users.id))
      .orderBy(desc(workOrders.createdAt));

    const data = result.map(item => ({
      ...item,
      createdBy: item.createdBy?.id ? item.createdBy : undefined,
    }));

    return {
      success: true,
      message: "Ordres de travail récupérés avec succès",
      data
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

// Récupérer tous les rapports d'intervention
export const getInterventionReports = async () => {
  try {
    const result = await db
      .select({
        id: interventionReports.id,
        reportNumber: interventionReports.reportNumber,
        workOrderNumber: interventionReports.workOrderNumber,
        failureType: interventionReports.failureType,
        failureDescription: interventionReports.failureDescription,
        interventionType: interventionReports.interventionType,
        materialUsed: interventionReports.materialUsed,
        numberOfIntervenants: interventionReports.numberOfIntervenants,
        causes: interventionReports.causes,
        symptoms: interventionReports.symptoms,
        effectsOnEquipment: interventionReports.effectsOnEquipment,
        repairTime: interventionReports.repairTime,
        stepsFollowed: interventionReports.stepsFollowed,
        createdAt: interventionReports.createdAt,
        updatedAt: interventionReports.updatedAt,
        equipmentId: interventionReports.equipmentId,
        createdById: interventionReports.createdById,
        equipment: {
          id: equipments.id,
          name: equipments.name,
        },
        createdBy: {
          id: users.id,
          name: users.name,
        },
      })
      .from(interventionReports)
      .leftJoin(equipments, eq(interventionReports.equipmentId, equipments.id))
      .leftJoin(users, eq(interventionReports.createdById, users.id))
      .orderBy(desc(interventionReports.createdAt));

    const data = result.map(item => ({
      ...item,
      equipment: item.equipment?.id ? item.equipment : undefined,
      createdBy: item.createdBy?.id ? item.createdBy : undefined,
    }));

    return {
      success: true,
      message: "Rapports d'intervention récupérés avec succès",
      data
    }
  } catch (error) {
    console.error(error)
    const e = error as Error
    return {
      success: false,
      message: e.message || "Erreur lors de la récupération des rapports d'intervention"
    }
  }
}

// Récupérer une demande de travaux par ID
export const getWorkRequestById = async (id: string) => {
  try {
    const result = await db
      .select({
        id: workRequests.id,
        requestNumber: workRequests.requestNumber,
        requesterLastName: workRequests.requesterLastName,
        requesterFirstName: workRequests.requesterFirstName,
        failureType: workRequests.failureType,
        failureDescription: workRequests.failureDescription,
        workOrderAssigned: workRequests.workOrderAssigned,
        reportCompleted: workRequests.reportCompleted,
        createdAt: workRequests.createdAt,
        updatedAt: workRequests.updatedAt,
        equipmentId: workRequests.equipmentId,
        createdById: workRequests.createdById,
        equipment: {
          id: equipments.id,
          name: equipments.name,
        },
        createdBy: {
          id: users.id,
          name: users.name,
        },
      })
      .from(workRequests)
      .leftJoin(equipments, eq(workRequests.equipmentId, equipments.id))
      .leftJoin(users, eq(workRequests.createdById, users.id))
      .where(eq(workRequests.id, id))
      .limit(1);

    const data = result[0] ? {
      ...result[0],
      equipment: result[0].equipment?.id ? result[0].equipment : undefined,
      createdBy: result[0].createdBy?.id ? result[0].createdBy : undefined,
    } : null;

    return {
      success: true,
      message: "Demande de travail récupérée avec succès",
      data
    }
  } catch (error) {
    console.error(error)
    const e = error as Error
    return {
      success: false,
      message: e.message || "Erreur lors de la récupération de la demande de travail"
    }
  }
}

// Récupérer un ordre de travail par ID
export const getWorkOrderById = async (id: string) => {
  try {
    const result = await db
      .select({
        id: workOrders.id,
        workOrderNumber: workOrders.workOrderNumber,
        workRequestNumber: workOrders.workRequestNumber,
        interventionType: workOrders.interventionType,
        numberOfIntervenants: workOrders.numberOfIntervenants,
        interventionDateTime: workOrders.interventionDateTime,
        approximateDuration: workOrders.approximateDuration,
        stepsToFollow: workOrders.stepsToFollow,
        createdAt: workOrders.createdAt,
        updatedAt: workOrders.updatedAt,
        createdById: workOrders.createdById,
        createdBy: {
          id: users.id,
          name: users.name,
        },
      })
      .from(workOrders)
      .leftJoin(users, eq(workOrders.createdById, users.id))
      .where(eq(workOrders.id, id))
      .limit(1);

    const data = result[0] ? {
      ...result[0],
      createdBy: result[0].createdBy?.id ? result[0].createdBy : undefined,
    } : null;

    return {
      success: true,
      message: "Ordre de travail récupéré avec succès",
      data
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

// Récupérer une intervention par ID (peut être une demande, un ordre ou un rapport)
export const getInterventionById = async (id: string) => {
  try {
    // Essayer de trouver dans les demandes de travail
    const workRequestResult = await getWorkRequestById(id);
    if (workRequestResult.success && workRequestResult.data) {
      return workRequestResult;
    }

    // Essayer de trouver dans les ordres de travail
    const workOrderResult = await getWorkOrderById(id);
    if (workOrderResult.success && workOrderResult.data) {
      return workOrderResult;
    }

    // Essayer de trouver dans les rapports d'intervention
    const reportResult = await getInterventionReportById(id);
    if (reportResult.success && reportResult.data) {
      return reportResult;
    }

    return {
      success: false,
      message: "Intervention non trouvée"
    }
  } catch (error) {
    console.error(error)
    const e = error as Error
    return {
      success: false,
      message: e.message || "Erreur lors de la récupération de l'intervention"
    }
  }
}

// Supprimer une demande de travaux
export const deleteWorkRequest = async (id: string) => {
  try {
    await db.delete(workRequests).where(eq(workRequests.id, id));
    return {
      success: true,
      message: "Demande de travail supprimée avec succès"
    }
  } catch (error) {
    console.error(error)
    const e = error as Error
    return {
      success: false,
      message: e.message || "Erreur lors de la suppression de la demande de travail"
    }
  }
}

// Supprimer un ordre de travail
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

// Supprimer un rapport d'intervention
export const deleteInterventionReport = async (id: string) => {
  try {
    await db.delete(interventionReports).where(eq(interventionReports.id, id));
    return {
      success: true,
      message: "Rapport d'intervention supprimé avec succès"
    }
  } catch (error) {
    console.error(error)
    const e = error as Error
    return {
      success: false,
      message: e.message || "Erreur lors de la suppression du rapport d'intervention"
    }
  }
}

// Créer une nouvelle intervention (demande de travail)
export const createIntervention = async (data: {
  equipmentId: string;
  failureType?: string;
  material?: string;
  date?: Date;
}) => {
  try {
    const requestNumber = `REQ-${Date.now()}`;
    
    const result = await db.insert(workRequests).values({
      id: createId(),
      requestNumber,
      requesterLastName: "Système",
      requesterFirstName: "Auto",
      failureType: data.failureType || "Non spécifié",
      failureDescription: data.material || "Intervention créée automatiquement",
      equipmentId: data.equipmentId,
      createdById: "system", // À remplacer par l'ID de l'utilisateur connecté
    }).returning();

    return {
      success: true,
      message: "Intervention créée avec succès",
      data: result[0]
    }
  } catch (error) {
    console.error(error)
    const e = error as Error
    return {
      success: false,
      message: e.message || "Erreur lors de la création de l'intervention"
    }
  }
}