"use client";

import React, { useState, useTransition } from "react";
import { Edit, Trash2, Package, AlertTriangle, Loader2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Badge from "@/components/ui/badge/Badge";
import Image from "next/image";
import { deleteStock } from "@/server/stocks";
import ComponentCard from "@/components/common/ComponentCard";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Stock {
  id: string;
  name: string;
  quantity: number;
  supplier: string | null;
  price: number | null;
  createdAt: Date;
  updatedAt: Date;
}

interface StockTableProps {
  stocks: Stock[];
  onStockUpdated?: (stock: Stock) => void;
  onStockDeleted?: (id: string) => void;
}

export default function StockTable({ stocks, onStockUpdated, onStockDeleted }: StockTableProps) {
  const [isPending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();

  const handleEdit = (id: string) => {
    router.push(`/stocks/${id}/edit`);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet article ?")) {
      setDeletingId(id);
      const { success, message } = await deleteStock(id);
      if (success) {
        toast.success(message);
        onStockDeleted?.(id);
      } else {
        toast.error(message);
      }
      setDeletingId(null);
    }
  };

  const getStockStatus = (quantity: number) => {
    if (quantity === 0) {
      return { label: "Rupture", color: "error" as const };
    } else if (quantity <= 10) {
      return { label: "Stock faible", color: "warning" as const };
    } else {
      return { label: "En stock", color: "success" as const };
    }
  };

  const formatPrice = (price: number | null) => {
    if (!price) return "-";
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  return (
    isPending ? (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-4 h-4 animate-spin" />
      </div>
    ) : (
      stocks.length > 0 ? (
        <ComponentCard title="Liste des articles en stock">
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="max-w-full overflow-x-auto">
              <div className="min-w-[1102px]">
                <Table>
                  {/* Table Header */}
                  <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                    <TableRow>
                      <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                      >
                        Article
                      </TableCell>
                      <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                      >
                        Quantité
                      </TableCell>
                      <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                      >
                        Statut
                      </TableCell>
                      <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                      >
                        Fournisseur
                      </TableCell>
                      <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                      >
                        Prix unitaire
                      </TableCell>
                      <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                      >
                        Valeur totale
                      </TableCell>
                      <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                      >
                        Dernière mise à jour
                      </TableCell>
                      <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400"
                      >
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHeader>

                  {/* Table Body */}
                  <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                    {stocks.map((stock) => {
                      const status = getStockStatus(stock.quantity);
                      const totalValue = (stock.price || 0) * stock.quantity;

                      return (
                        <TableRow key={stock.id}>
                          <TableCell className="px-5 py-4 sm:px-6 text-start">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 overflow-hidden rounded-full">
                                <Image
                                  width={40}
                                  height={40}
                                  src="/images/equipement.png"
                                  alt={stock.name}
                                />
                              </div>
                              <div>
                                <button
                                  onClick={() => router.push(`/stocks/${stock.id}`)}
                                  className="block font-medium text-gray-800 text-theme-sm dark:text-white/90 hover:text-brand-500 transition-colors text-left"
                                >
                                  {stock.name}
                                </button>
                                <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                                  {stock.supplier || "Aucun fournisseur"}
                                </span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                            <span className={`font-medium ${
                              stock.quantity === 0 ? 'text-red-600' : 
                              stock.quantity <= 10 ? 'text-orange-600' : 
                              'text-green-600'
                            }`}>
                              {stock.quantity}
                            </span>
                          </TableCell>
                          <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                            <Badge
                              size="sm"
                              color={status.color}
                            >
                              {status.label}
                            </Badge>
                          </TableCell>
                          <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                            {stock.supplier || "-"}
                          </TableCell>
                          <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                            {formatPrice(stock.price)}
                          </TableCell>
                          <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                            {formatPrice(totalValue)}
                          </TableCell>
                          <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                            {formatDate(stock.updatedAt)}
                          </TableCell>
                          <TableCell className="px-4 py-3 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleEdit(stock.id)}
                                className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Modifier"
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                onClick={() => handleDelete(stock.id)}
                                disabled={deletingId === stock.id}
                                className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                title="Supprimer"
                              >
                                {deletingId === stock.id ? (
                                  <Loader2 size={16} className="animate-spin" />
                                ) : (
                                  <Trash2 size={16} />
                                )}
                              </button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </ComponentCard>
      ) : (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500 text-theme-sm dark:text-gray-400">Aucun article trouvé</p>
        </div>
      )
    )
  );
}