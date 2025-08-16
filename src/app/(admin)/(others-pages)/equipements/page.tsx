import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import EquipementTable from "@/components/tables/EquipementTable";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Liste des équipements | Machine Care",
  description: "This is Liste des équipements  page for Machine Care",
  // other metadata
};

export default function EquipementsPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Liste des équipements" />
      <div className="space-y-6">
        <ComponentCard title="Liste des équipements">
          <EquipementTable />
        </ComponentCard>
      </div>
    </div>
  );
}
