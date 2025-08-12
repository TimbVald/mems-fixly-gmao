import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import EquipementDetails from "@/components/equipment/EquipementDetails";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Détails de l'équipement | Mem's Fixly",
    description: "This is Détails de l'équipement page for Mem's Fixly",
};

interface EquipementDetailsPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function EquipementDetailsPage({ params }: EquipementDetailsPageProps) {
    const { id } = await params;
    return (
        <div>
            <PageBreadcrumb pageTitle="Détails de l'équipement" />
            <EquipementDetails equipementId={id} />
        </div>
    );
}