import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import WorkRequestsTable from "@/components/tables/WorkRequestsTable";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Demandes d'Intervention | Mem's Fixly",
  description:
    "This is Demandes d'Intervention page for Mem's Fixly",
  // other metadata
};

export default function WorkRequestsPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Demandes d'Intervention" />
      <div className="space-y-6">
        <ComponentCard title="Liste des demandes d'intervention">
          <WorkRequestsTable />
        </ComponentCard>
      </div>
    </div>
  );
}