import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import StockDetails from "@/components/stocks/StockDetails";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Détails de l'article | Mem's Fixly",
    description: "This is Détails de l'article page for Mem's Fixly",
};

interface StockDetailsPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function StockDetailsPage({ params }: StockDetailsPageProps) {
    const { id } = await params;
    return (
        <div>
            <PageBreadcrumb pageTitle="Détails de l'article" />
            <StockDetails stockId={id} />
        </div>
    );
}