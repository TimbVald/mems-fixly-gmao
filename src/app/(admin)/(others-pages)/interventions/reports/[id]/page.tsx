import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import InterventionReportDetails from "@/components/details/InterventionReportDetails";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Détails du compte rendu d'intervention | Mem's Fixly",
    description: "This is Détails du compte rendu d'intervention page for Mem's Fixly",
};

interface InterventionReportDetailsPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function InterventionReportDetailsPage({ params }: InterventionReportDetailsPageProps) {
    const { id } = await params;
    return (
        <div>
            <PageBreadcrumb pageTitle="Détails du compte rendu d'intervention" />
            <InterventionReportDetails reportId={id} />
        </div>
    );
}