
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import EquipementForm from "@/components/forms/equipment/EquipementForm";
import { Metadata } from "next";


export const metadata: Metadata = {
    title: "Ajouter un équipement | Machine Care",
    description: "This is Ajouter un équipement page for Machine Care",
  };
  
  export default function AddEquipementPage() {
    return (
      <div>
        <PageBreadcrumb pageTitle="Ajouter un équipement" />
            <EquipementForm />
      </div>
    )
  }