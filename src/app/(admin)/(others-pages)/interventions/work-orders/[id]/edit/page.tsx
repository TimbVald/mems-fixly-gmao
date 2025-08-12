import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import WorkOrderEditForm from "@/components/forms/WorkOrderEditForm";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Modifier un ordre de travail | Mem's Fixly",
    description: "This is Modifier un ordre de travail page for Mem's Fixly",
};

interface EditWorkOrderPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function EditWorkOrderPage({ params }: EditWorkOrderPageProps) {
    const { id } = await params;
    return (
        <div>
            <PageBreadcrumb pageTitle="Modifier un ordre de travail" />
            <WorkOrderEditForm workOrderId={id} />
        </div>
    );
}