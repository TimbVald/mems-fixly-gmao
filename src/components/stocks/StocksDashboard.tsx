"use client";

import { useState, useEffect } from "react";
import { Plus, Package, TrendingUp, AlertTriangle, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import StockTable from "./StockTable";
import StockForm from "./forms/StockForm";
import { useModal } from "@/hooks/useModal";
import { Modal } from "@/components/ui/modal";
import { getStocks } from "@/server/stocks";

interface Stock {
  id: string;
  name: string;
  quantity: number;
  supplier: string | null;
  price: number | null;
  createdAt: Date;
  updatedAt: Date;
}
import { toast } from "sonner";

interface StockStats {
  totalItems: number;
  totalValue: number;
  lowStockItems: number;
  outOfStockItems: number;
}

export default function StocksDashboard() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [stats, setStats] = useState<StockStats>({
    totalItems: 0,
    totalValue: 0,
    lowStockItems: 0,
    outOfStockItems: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const { isOpen, openModal, closeModal } = useModal();

  const fetchStocks = async () => {
    const { success, message, data } = await getStocks();
    if (success && data) {
      setStocks(data);
      calculateStats(data);
    } else {
      toast.error(message);
    }
    setIsLoading(false);
  };

  const calculateStats = (stocksData: Stock[]) => {
    const totalItems = stocksData.length;
    const totalValue = stocksData.reduce((sum, stock) => {
      return sum + (stock.price || 0) * stock.quantity;
    }, 0);
    const lowStockItems = stocksData.filter(stock => stock.quantity > 0 && stock.quantity <= 10).length;
    const outOfStockItems = stocksData.filter(stock => stock.quantity === 0).length;

    setStats({
      totalItems,
      totalValue,
      lowStockItems,
      outOfStockItems,
    });
  };

  const handleStockCreated = (newStock: Stock) => {
    setStocks(prev => [...prev, newStock]);
    calculateStats([...stocks, newStock]);
    closeModal();
    toast.success("Article ajouté avec succès");
  };

  const handleStockUpdated = (updatedStock: Stock) => {
    setStocks(prev => prev.map(stock => 
      stock.id === updatedStock.id ? updatedStock : stock
    ));
    const updatedStocks = stocks.map(stock => 
      stock.id === updatedStock.id ? updatedStock : stock
    );
    calculateStats(updatedStocks);
    toast.success("Article mis à jour avec succès");
  };

  const handleStockDeleted = (deletedId: string) => {
    setStocks(prev => prev.filter(stock => stock.id !== deletedId));
    const updatedStocks = stocks.filter(stock => stock.id !== deletedId);
    calculateStats(updatedStocks);
    toast.success("Article supprimé avec succès");
  };

  useEffect(() => {
    fetchStocks();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestion des Stocks</h1>
          <p className="text-muted-foreground">
            Gérez votre inventaire et suivez vos stocks
          </p>
        </div>
        <Button onClick={openModal} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Ajouter un article
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Articles</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalItems}</div>
            <p className="text-xs text-muted-foreground">
              Articles en inventaire
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valeur Totale</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat('fr-FR', {
                style: 'currency',
                currency: 'EUR'
              }).format(stats.totalValue)}
            </div>
            <p className="text-xs text-muted-foreground">
              Valeur de l'inventaire
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stock Faible</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.lowStockItems}</div>
            <p className="text-xs text-muted-foreground">
              Articles à réapprovisionner
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rupture de Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.outOfStockItems}</div>
            <p className="text-xs text-muted-foreground">
              Articles en rupture
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Stock Table */}
      <Card>
        <CardHeader>
          <CardTitle>Inventaire</CardTitle>
          <CardDescription>
            Liste complète de vos articles en stock
          </CardDescription>
        </CardHeader>
        <CardContent>
          <StockTable 
            stocks={stocks}
            onStockUpdated={handleStockUpdated}
            onStockDeleted={handleStockDeleted}
          />
        </CardContent>
      </Card>

      {/* Add Stock Modal */}
      <Modal isOpen={isOpen} onClose={closeModal}>
        <StockForm onStockCreated={handleStockCreated} />
      </Modal>
    </div>
  );
}