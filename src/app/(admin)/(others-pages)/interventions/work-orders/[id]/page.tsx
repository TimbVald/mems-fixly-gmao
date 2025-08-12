import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import WorkOrderDetails from "@/components/details/WorkOrderDetails";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Détails de l'ordre de travail | Mem's Fixly",
    description: "This is Détails de l'ordre de travail page for Mem's Fixly",
};

interface WorkOrderDetailsPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function WorkOrderDetailsPage({ params }: WorkOrderDetailsPageProps) {
    const { id } = await params;
    return (
        <div>
            <PageBreadcrumb pageTitle="Détails de l'ordre de travail" />
            <WorkOrderDetails workOrderId={id} />
        </div>
    );
}