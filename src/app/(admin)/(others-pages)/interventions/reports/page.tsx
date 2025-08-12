import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import InterventionReportsTable from "@/components/tables/InterventionReportsTable";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Comptes Rendus d'Intervention | Mem's Fixly",
  description:
    "This is Comptes Rendus d'Intervention page for Mem's Fixly",
  // other metadata
};

export default function InterventionReportsPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Comptes Rendus d'Intervention" />
      <div className="space-y-6">
        <ComponentCard title="Liste des comptes rendus d'intervention">
          <InterventionReportsTable />
        </ComponentCard>
      </div>
    </div>
  );
}