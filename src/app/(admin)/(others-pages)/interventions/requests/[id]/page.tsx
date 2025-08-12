import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import WorkRequestDetails from "@/components/details/WorkRequestDetails";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Détails de la demande d'intervention | Mem's Fixly",
    description: "This is Détails de la demande d'intervention page for Mem's Fixly",
};

interface WorkRequestDetailsPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function WorkRequestDetailsPage({ params }: WorkRequestDetailsPageProps) {
    const { id } = await params;
    return (
        <div>
            <PageBreadcrumb pageTitle="Détails de la demande d'intervention" />
            <WorkRequestDetails workRequestId={id} />
        </div>
    );
}