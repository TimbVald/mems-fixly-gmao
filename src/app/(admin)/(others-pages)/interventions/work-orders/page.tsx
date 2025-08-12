import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import WorkOrdersTable from "@/components/tables/WorkOrdersTable";
import { Metadata } from "next";
import Link from "next/link";
import React from "react";

export const metadata: Metadata = {
  title: "Ordres de Travail | Mem's Fixly",
  description:
    "This is Ordres de Travail page for Mem's Fixly",
  // other metadata
};

export default function WorkOrdersPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Ordres de Travail" />
      <div className="space-y-6">
        {/* Navigation vers le calendrier */}
        <div className="flex justify-end">
          <Link
            href="/interventions/work-orders/calendar"
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-brand-500 border border-transparent rounded-lg hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            Voir le calendrier
          </Link>
        </div>
        
        <ComponentCard title="Liste des ordres de travail">
          <WorkOrdersTable />
        </ComponentCard>
      </div>
    </div>
  );
}