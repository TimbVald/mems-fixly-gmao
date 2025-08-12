import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import WorkRequestEditForm from "@/components/forms/WorkRequestEditForm";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Modifier une demande d'intervention | Mem's Fixly",
    description: "This is Modifier une demande d'intervention page for Mem's Fixly",
};

interface EditWorkRequestPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function EditWorkRequestPage({ params }: EditWorkRequestPageProps) {
    const { id } = await params;
    return (
        <div>
            <PageBreadcrumb pageTitle="Modifier une demande d'intervention" />
            <WorkRequestEditForm workRequestId={id} />
        </div>
    );
}