import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import InterventionReportForm from "@/components/forms/InterventionReportForm";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Ajouter un compte rendu d'intervention | Machine Care",
  description: "This is Ajouter un compte rendu d'intervention page for Machine Care",
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