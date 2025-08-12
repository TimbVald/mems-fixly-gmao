import { Metadata } from "next";
import StocksDashboard from "@/components/stocks/StocksDashboard";

export const metadata: Metadata = {
  title: "Gestion des Stocks | GMAO",
  description: "Tableau de bord de gestion des stocks et inventaire",
};

export default function StocksPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Gestion des Stocks</h1>
        <p className="text-muted-foreground">
          Gérez votre inventaire, pièces détachées et approvisionnements
        </p>
      </div>
      
      <StocksDashboard />
    </div>
  );
}