"use server";
import { db } from "@/server/db";
import { equipments, workRequests, workOrders, interventionReports, users } from "@/db/schema";
import { count, eq, gte, and } from "drizzle-orm";

// Interface pour les statistiques du dashboard
export interface DashboardStats {
  totalEquipments: number;
  monthlyInterventions: number;
  pendingWorkRequests: number;
  completedReports: number;
  recentInterventions: Array<{
    id: string;
    reportNumber: string;
    equipmentName: string;
    interventionType: string;
    failureType: string;
    createdAt: Date;
    technicianName: string;
    repairTime: number;
  }>;
}

// Fonction pour récupérer toutes les statistiques du dashboard
export const getDashboardStats = async (): Promise<{ success: boolean; data?: DashboardStats; message?: string }> => {
  try {
    // Calculer le début du mois actuel
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // 1. Nombre total d'équipements
    const totalEquipmentsResult = await db.select({ count: count() }).from(equipments);
    const totalEquipments = totalEquipmentsResult[0]?.count || 0;

    // 2. Nombre d'interventions ce mois-ci
    const monthlyInterventionsResult = await db
      .select({ count: count() })
      .from(interventionReports)
      .where(gte(interventionReports.createdAt, startOfMonth));
    const monthlyInterventions = monthlyInterventionsResult[0]?.count || 0;

    // 3. Nombre de demandes de travail en attente (sans ordre de travail assigné)
    const pendingWorkRequestsResult = await db
      .select({ count: count() })
      .from(workRequests)
      .where(eq(workRequests.workOrderAssigned, false));
    const pendingWorkRequests = pendingWorkRequestsResult[0]?.count || 0;

    // 4. Nombre de comptes rendus terminés ce mois-ci
    const completedReportsResult = await db
      .select({ count: count() })
      .from(interventionReports)
      .where(gte(interventionReports.createdAt, startOfMonth));
    const completedReports = completedReportsResult[0]?.count || 0;

    // 5. Récupérer les interventions récentes avec les détails
    const recentInterventionsData = await db
      .select({
        id: interventionReports.id,
        reportNumber: interventionReports.reportNumber,
        equipmentName: equipments.name,
        interventionType: interventionReports.interventionType,
        failureType: interventionReports.failureType,
        createdAt: interventionReports.createdAt,
        technicianName: users.name,
        repairTime: interventionReports.repairTime,
      })
      .from(interventionReports)
      .leftJoin(equipments, eq(interventionReports.equipmentId, equipments.id))
      .leftJoin(users, eq(interventionReports.createdById, users.id))
      .orderBy(interventionReports.createdAt)
      .limit(10);

    const recentInterventions = recentInterventionsData.map(item => ({
      id: item.id,
      reportNumber: item.reportNumber,
      equipmentName: item.equipmentName || 'Équipement non spécifié',
      interventionType: item.interventionType,
      failureType: item.failureType,
      createdAt: item.createdAt,
      technicianName: item.technicianName || 'Technicien non spécifié',
      repairTime: item.repairTime,
    }));

    const dashboardStats: DashboardStats = {
      totalEquipments,
      monthlyInterventions,
      pendingWorkRequests,
      completedReports,
      recentInterventions,
    };

    return {
      success: true,
      data: dashboardStats,
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques du dashboard:', error);
    return {
      success: false,
      message: 'Erreur lors de la récupération des statistiques',
    };
  }
};

// Fonction pour récupérer uniquement les métriques principales
export const getDashboardMetrics = async () => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [totalEquipments, monthlyInterventions, pendingRequests, completedReports] = await Promise.all([
      db.select({ count: count() }).from(equipments),
      db.select({ count: count() }).from(interventionReports).where(gte(interventionReports.createdAt, startOfMonth)),
      db.select({ count: count() }).from(workRequests).where(eq(workRequests.workOrderAssigned, false)),
      db.select({ count: count() }).from(interventionReports).where(gte(interventionReports.createdAt, startOfMonth)),
    ]);

    return {
      success: true,
      data: {
        totalEquipments: totalEquipments[0]?.count || 0,
        monthlyInterventions: monthlyInterventions[0]?.count || 0,
        pendingRequests: pendingRequests[0]?.count || 0,
        completedReports: completedReports[0]?.count || 0,
      },
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des métriques:', error);
    return {
      success: false,
      message: 'Erreur lors de la récupération des métriques',
    };
  }
};