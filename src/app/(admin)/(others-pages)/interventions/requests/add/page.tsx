import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import WorkRequestForm from "@/components/forms/WorkRequestForm";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Ajouter une demande d'intervention | Mem's Fixly",
  description:
    "This is Ajouter une demande d'intervention page for Mem's Fixly",
  // other metadata
};

export default function AddWorkRequestPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Ajouter une demande d'intervention" />
      <WorkRequestForm />
    </div>
  );
}