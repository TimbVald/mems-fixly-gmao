import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import EquipementEditForm from "@/components/forms/equipment/EquipementEditForm";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Modifier un équipement | Machine Care",
    description: "This is Modifier un équipement page for Machine Care",
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