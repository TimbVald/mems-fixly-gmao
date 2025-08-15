"use client";
import React, { useEffect, useState } from "react";
import Badge from "../ui/badge/Badge";
import { ArrowDownIcon, ArrowUpIcon, BoxIconLine, GroupIcon, BoxIcon, TaskIcon } from "@/icons";
import { getDashboardMetrics } from "@/server/dashboard-stats";

interface DashboardMetrics {
  totalEquipments: number;
  monthlyInterventions: number;
  pendingRequests: number;
  completedReports: number;
}

export const EcommerceMetrics = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalEquipments: 0,
    monthlyInterventions: 0,
    pendingRequests: 0,
    completedReports: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const result = await getDashboardMetrics();
        if (result.success && result.data) {
          setMetrics(result.data);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des métriques:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
            <div className="animate-pulse">
              <div className="w-12 h-12 bg-gray-200 rounded-xl dark:bg-gray-700"></div>
              <div className="mt-5">
                <div className="h-4 bg-gray-200 rounded dark:bg-gray-700 w-24"></div>
                <div className="h-6 bg-gray-200 rounded dark:bg-gray-700 w-16 mt-2"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl dark:bg-blue-900/20">
          <BoxIcon className="text-blue-600 size-6 dark:text-blue-400" />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Équipements Actifs
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {metrics.totalEquipments}
            </h4>
          </div>
          <Badge color="success">
            <ArrowUpIcon />
            2.3%
          </Badge>
        </div>
      </div>
      {/* <!-- Metric Item End --> */}

      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl dark:bg-green-900/20">
          <TaskIcon className="text-green-600 dark:text-green-400" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Interventions du Mois
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {metrics.monthlyInterventions}
            </h4>
          </div>

          <Badge color="success">
            <ArrowUpIcon className="text-success-500" />
            8.2%
          </Badge>
        </div>
      </div>
      {/* <!-- Metric Item End --> */}

      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-xl dark:bg-orange-900/20">
          <BoxIconLine className="text-orange-600 size-6 dark:text-orange-400" />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Demandes en Attente
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {metrics.pendingRequests}
            </h4>
          </div>
          <Badge color="warning">
            <ArrowDownIcon />
            1.5%
          </Badge>
        </div>
      </div>
      {/* <!-- Metric Item End --> */}

      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-xl dark:bg-purple-900/20">
          <GroupIcon className="text-purple-600 size-6 dark:text-purple-400" />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Rapports Terminés
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {metrics.completedReports}
            </h4>
          </div>
          <Badge color="success">
            <ArrowUpIcon />
            5.7%
          </Badge>
        </div>
      </div>
      {/* <!-- Metric Item End --> */}
    </div>
  );
};
