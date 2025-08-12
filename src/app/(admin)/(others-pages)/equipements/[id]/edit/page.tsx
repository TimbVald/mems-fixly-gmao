import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import EquipementEditForm from "@/components/forms/equipment/EquipementEditForm";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Modifier un équipement | Mem's Fixly",
    description: "This is Modifier un équipement page for Mem's Fixly",
};

interface EditEquipementPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function EditEquipementPage({ params }: EditEquipementPageProps) {
    const { id } = await params;
    return (
        <div>
            <PageBreadcrumb pageTitle="Modifier l'équipement" />
            <EquipementEditForm equipementId={id} />
        </div>
    );
}