import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import StockEditForm from "@/components/stocks/forms/StockEditForm";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Modifier un article | Machine Care",
    description: "This is Modifier un article page for Machine Care",
};

interface EditStockPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function EditStockPage({ params }: EditStockPageProps) {
    const { id } = await params;
    return (
        <div>
            <PageBreadcrumb pageTitle="Modifier l'article" />
            <StockEditForm stockId={id} />
        </div>
    );
}