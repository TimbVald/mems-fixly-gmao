import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import InterventionReportEditForm from "@/components/forms/InterventionReportEditForm";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Modifier un compte rendu d'intervention | Machine Care",
    description: "This is Modifier un compte rendu d'intervention page for Machine Care",
};

interface EditInterventionReportPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function EditInterventionReportPage({ params }: EditInterventionReportPageProps) {
    const { id } = await params;
    return (
        <div>
            <PageBreadcrumb pageTitle="Modifier un compte rendu d'intervention" />
            <InterventionReportEditForm reportId={id} />
        </div>
    );
}