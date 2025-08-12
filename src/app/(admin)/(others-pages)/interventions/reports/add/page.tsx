import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import InterventionReportForm from "@/components/forms/InterventionReportForm";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Ajouter un compte rendu d'intervention | Mem's Fixly",
  description:
    "This is Ajouter un compte rendu d'intervention page for Mem's Fixly",
  // other metadata
};

export default function AddInterventionReportPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Ajouter un compte rendu d'intervention" />
      <InterventionReportForm />
    </div>
  );
}