import { Metadata } from "next";
import HistoriqueStockTable from "@/components/tables/HistoriqueStockTable";

export const metadata: Metadata = {
  title: "Historique de Stock | GMAO Builder",
  description: "Historique des modifications de stock",
};

export default function HistoriqueStockPage() {
  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Historique de Stock
        </h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Suivez toutes les modifications apportées à votre stock
        </p>
      </div>
      
      <HistoriqueStockTable />
    </div>
  );
}