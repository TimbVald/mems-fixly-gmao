import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import WorkOrderForm from "@/components/forms/WorkOrderForm";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Ajouter un ordre de travail | Machine Care",
  description: "This is Ajouter un ordre de travail page for Machine Care",
  // other metadata
};

export default function AddWorkOrderPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Ajouter un ordre de travail" />
      <WorkOrderForm />
    </div>
  );
}