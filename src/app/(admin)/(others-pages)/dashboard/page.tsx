import type { Metadata } from "next";
import { EcommerceMetrics } from "@/components/ecommerce/EcommerceMetrics";
import React from "react";
import MonthlyTarget from "@/components/ecommerce/MonthlyTarget";
import StatisticsChart from "@/components/ecommerce/StatisticsChart";
import RecentInterventions from "@/components/ecommerce/RecentInterventions";
import EquipmentMTBFMTTR from "@/components/ecommerce/EquipmentMTBFMTTR";

export const metadata: Metadata = {
  title:
    "Machine Care - Dashboard",
  description: "Ceci est le tableau de bord de Machine Care",
};

export default function Ecommerce() {
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12 space-y-6 xl:col-span-7">
        <EcommerceMetrics />
      </div>

      <div className="col-span-12 xl:col-span-5">
        <MonthlyTarget />
      </div>

      <div className="col-span-12">
        <StatisticsChart />
      </div>

      <div className="col-span-12 xl:col-span-7">
        <RecentInterventions />
      </div>

      <div className="col-span-12">
        <EquipmentMTBFMTTR />
      </div>
    </div>
  );
}
