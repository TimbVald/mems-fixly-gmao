"use client";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import Image from "next/image";
import { getDashboardStats } from "@/server/dashboard-stats";

// Define the TypeScript interface for the table rows
interface Intervention {
  id: string;
  reportNumber: string;
  equipmentName: string;
  interventionType: string;
  failureType: string;
  createdAt: Date;
  technicianName: string;
  repairTime: number;
}

// Fonction pour obtenir le statut basé sur le type d'intervention
const getInterventionStatus = (type: string) => {
  return type === "préventive" ? "Terminé" : "En cours";
};

// Fonction pour obtenir la priorité basée sur le temps de réparation
const getInterventionPriority = (repairTime: number | null | undefined) => {
  if (!repairTime || typeof repairTime !== 'number') {
    return "secondary";
  }
  if (repairTime > 240) {
    return "error"; // Urgent
  }
  if (repairTime > 120) {
    return "warning"; // Normal
  }
  return "secondary"; // Faible
};

// Données statiques de fallback (gardées pour compatibilité)
const fallbackData: Intervention[] = [
  {
    id: "1",
    reportNumber: "RPT-001",
    equipmentName: "Compresseur d'air Atlas Copco",
    interventionType: "préventive",
    failureType: "Maintenance programmée",
    createdAt: new Date(),
    technicianName: "Jean Dupont",
    repairTime: 120,
  },
  {
    id: "2",
    reportNumber: "RPT-002",
    equipmentName: "Pompe hydraulique Parker",
    interventionType: "curative",
    failureType: "Panne critique hydraulique",
    createdAt: new Date(),
    technicianName: "Marie Martin",
    repairTime: 180,
  },
];

export default function RecentInterventions() {
  const [interventions, setInterventions] = useState<Intervention[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInterventions = async () => {
      try {
        const result = await getDashboardStats();
        if (result.success && result.data) {
          setInterventions(result.data.recentInterventions);
        } else {
          // Utiliser les données de fallback en cas d'erreur
          setInterventions(fallbackData);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des interventions:', error);
        setInterventions(fallbackData);
      } finally {
        setLoading(false);
      }
    };

    fetchInterventions();
  }, []);
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Interventions Récentes
          </h3>
        </div>

        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
            <svg
              className="stroke-current fill-white dark:fill-gray-800"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2.29004 5.90393H17.7067"
                stroke=""
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M17.7075 14.0961H2.29085"
                stroke=""
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12.0826 3.33331C13.5024 3.33331 14.6534 4.48431 14.6534 5.90414C14.6534 7.32398 13.5024 8.47498 12.0826 8.47498C10.6627 8.47498 9.51172 7.32398 9.51172 5.90415C9.51172 4.48432 10.6627 3.33331 12.0826 3.33331Z"
                fill=""
                stroke=""
                strokeWidth="1.5"
              />
              <path
                d="M7.91745 11.525C6.49762 11.525 5.34662 12.676 5.34662 14.0959C5.34661 15.5157 6.49762 16.6667 7.91745 16.6667C9.33728 16.6667 10.4883 15.5157 10.4883 14.0959C10.4883 12.676 9.33728 11.525 7.91745 11.525Z"
                fill=""
                stroke=""
                strokeWidth="1.5"
              />
            </svg>
            Filtrer
          </button>
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
            Voir tout
          </button>
        </div>
      </div>
      <div className="max-w-full overflow-x-auto">
        <Table>
          {/* Table Header */}
          <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
            <TableRow>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Équipement
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Type
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Technicien
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Priorité
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Statut
              </TableCell>
            </TableRow>
          </TableHeader>

          {/* Table Body */}
          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {loading ? (
              // État de chargement
              Array.from({ length: 3 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell className="py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-[50px] w-[50px] bg-gray-200 rounded-md animate-pulse dark:bg-gray-700"></div>
                      <div>
                        <div className="h-4 bg-gray-200 rounded w-32 mb-2 animate-pulse dark:bg-gray-700"></div>
                        <div className="h-3 bg-gray-200 rounded w-24 animate-pulse dark:bg-gray-700"></div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-3">
                    <div className="h-4 bg-gray-200 rounded w-20 animate-pulse dark:bg-gray-700"></div>
                  </TableCell>
                  <TableCell className="py-3">
                    <div className="h-4 bg-gray-200 rounded w-24 animate-pulse dark:bg-gray-700"></div>
                  </TableCell>
                  <TableCell className="py-3">
                    <div className="h-6 bg-gray-200 rounded w-16 animate-pulse dark:bg-gray-700"></div>
                  </TableCell>
                  <TableCell className="py-3">
                    <div className="h-6 bg-gray-200 rounded w-16 animate-pulse dark:bg-gray-700"></div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              interventions.map((intervention) => (
                <TableRow key={intervention.id} className="">
                  <TableCell className="py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-[50px] w-[50px] overflow-hidden rounded-md bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {intervention.equipmentName}
                        </p>
                        <span className="text-gray-500 text-theme-xs dark:text-gray-400">
                          {intervention.reportNumber}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {intervention.interventionType === 'préventive' ? 'Maintenance préventive' : 'Réparation'}
                  </TableCell>
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {intervention.technicianName}
                  </TableCell>
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    <Badge
                      size="sm"
                      color={getInterventionPriority(intervention.repairTime) as "info" | "warning" | "error"}
                    >
                      {intervention.repairTime > 240 ? 'Urgent' : intervention.repairTime > 120 ? 'Normal' : 'Faible'}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    <Badge
                      size="sm"
                      color={intervention.interventionType === "préventive" ? "success" : "warning"}
                    >
                      {new Date().getTime() - intervention.createdAt.getTime() > 86400000 ? 'Terminé' : 'En cours'}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
