
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import EquipementForm from "@/components/forms/equipment/EquipementForm";
import { Metadata } from "next";


export const metadata: Metadata = {
    title: "Ajouter un équipement | Mem's Fixly",
    description:
      "This is Ajouter un équipement page for Mem's Fixly",
  };
  
  export default function AddEquipementPage() {
    return (
      <div>
        <PageBreadcrumb pageTitle="Ajouter un équipement" />
            <EquipementForm />
      </div>
    )
  }