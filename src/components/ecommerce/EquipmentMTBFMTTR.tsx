"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { getEquipmentMTBFMTTRStats, EquipmentMTBFMTTRData } from "@/server/dashboard-stats";

export default function EquipmentMTBFMTTR() {
  const [equipmentStats, setEquipmentStats] = useState<EquipmentMTBFMTTRData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEquipmentStats = async () => {
      try {
        const result = await getEquipmentMTBFMTTRStats();
        if (result.success && result.data) {
          setEquipmentStats(result.data);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des statistiques par équipement:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEquipmentStats();
  }, []);

  const getMTBFStatus = (mtbf: number) => {
    if (mtbf > 720) return { color: "success" as const, label: "Excellent" };
    if (mtbf > 480) return { color: "warning" as const, label: "Bon" };
    return { color: "error" as const, label: "À surveiller" };
  };

  const getMTTRStatus = (mttr: number) => {
    if (mttr < 120) return { color: "success" as const, label: "Rapide" };
    if (mttr < 240) return { color: "warning" as const, label: "Moyen" };
    return { color: "error" as const, label: "Lent" };
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="mb-6">
          <Skeleton className="h-6 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="border-gray-200 dark:border-gray-700">
              <CardHeader className="pb-3">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-6 w-16" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-6 w-16" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-12" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Calculs MTBF/MTTR par Équipement
        </h3>
        <p className="mt-1 text-gray-500 text-sm dark:text-gray-400">
          Analyse détaillée de la fiabilité et maintenabilité de chaque équipement
        </p>
      </div>

      {equipmentStats.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">
            Aucune donnée d'intervention disponible pour le calcul des statistiques.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {equipmentStats.map((equipment) => {
            const mtbfStatus = getMTBFStatus(equipment.mtbf);
            const mttrStatus = getMTTRStatus(equipment.mttr);

            return (
              <Card key={equipment.equipmentId} className="border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-medium text-gray-800 dark:text-white/90">
                    {equipment.equipmentName}
                  </CardTitle>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {equipment.totalInterventions} intervention(s)
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* MTBF */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                        MTBF
                      </span>
                      <Badge color={mtbfStatus.color}>
                        {mtbfStatus.label}
                      </Badge>
                    </div>
                    <div className="text-2xl font-bold text-gray-800 dark:text-white">
                      {Math.round(equipment.mtbf / 60)}h
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {Math.round(equipment.mtbf)} minutes
                    </div>
                  </div>

                  {/* MTTR */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                        MTTR
                      </span>
                      <Badge color={mttrStatus.color}>
                        {mttrStatus.label}
                      </Badge>
                    </div>
                    <div className="text-2xl font-bold text-gray-800 dark:text-white">
                      {Math.round(equipment.mttr / 60)}h
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {Math.round(equipment.mttr)} minutes
                    </div>
                  </div>

                  {/* Détails des calculs */}
                  <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                    <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                      <div className="flex justify-between">
                        <span>Temps total de réparation:</span>
                        <span>{Math.round(equipment.totalRepairTime)}min</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Temps de fonctionnement:</span>
                        <span>{Math.round(equipment.totalOperatingTime / 60)}h</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Disponibilité:</span>
                        <span>
                          {equipment.totalOperatingTime > 0 
                            ? Math.round((equipment.totalOperatingTime / (equipment.totalOperatingTime + equipment.totalRepairTime)) * 100)
                            : 0}%
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Légende */}
      <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
        <h4 className="text-sm font-medium text-gray-800 dark:text-white/90 mb-2">
          Formules utilisées:
        </h4>
        <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
          <div><strong>MTBF</strong> = Temps de bon fonctionnement / (Nombre d'occurrences - 1)</div>
          <div><strong>MTTR</strong> = Temps total mis pour la réparation / Nombre d'occurrences</div>
          <div><strong>Disponibilité</strong> = Temps de fonctionnement / (Temps de fonctionnement + Temps de réparation)</div>
        </div>
      </div>
    </div>
  );
}