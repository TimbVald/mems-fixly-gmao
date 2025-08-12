import { Metadata } from "next";
import StocksDashboard from "@/components/stocks/StocksDashboard";

export const metadata: Metadata = {
  title: "Gestion des Stocks | GMAO",
  description: "Tableau de bord de gestion des stocks et inventaire",
};

export default function StocksPage() {
  return (
    <div className="container mx-auto py-6">
      <StocksDashboard />
    </div>
  );
}