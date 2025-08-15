"use client"

import React, { useState, useEffect, useTransition } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../ui/table";

import Badge from "../ui/badge/Badge";
import { Loader2 } from "lucide-react";
import ComponentCard from "../common/ComponentCard";
import { toast } from "sonner";
import { getHistoriqueStock } from "@/server/historique-stock";

interface HistoriqueStock {
    id: string;
    nom: string;
    quantite: number;
    fournisseur: string | null;
    prix: number | null;
    statut: 'ajouter' | 'retirer';
    createdAt: Date;
    stockId: string | null;
    createdById: string | null;
}

export default function HistoriqueStockTable() {
    const [historiqueStock, setHistoriqueStock] = useState<HistoriqueStock[]>([]);
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        fetchHistoriqueStock();
    }, []);

    const fetchHistoriqueStock = async () => {
        try {
            const { success, data } = await getHistoriqueStock();
            if (success && data) {
                startTransition(() => {
                    setHistoriqueStock(data);
                });
            } else {
                toast.error("Erreur lors du chargement de l'historique de stock");
            }
        } catch (error) {
            console.error("Erreur lors du chargement de l'historique de stock:", error);
            toast.error("Erreur lors du chargement de l'historique de stock");
        }
    };

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('fr-FR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };

    const formatPrice = (price: number | null) => {
        if (price === null) return '-';
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR'
        }).format(price);
    };

    return (
        <ComponentCard title="Historique des modifications de stock">
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader className="bg-gray-50 dark:bg-white/[0.02]">
                        <TableRow>
                            <TableCell
                                isHeader
                                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                            >
                                Nom
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
                                Fournisseur
                            </TableCell>
                            <TableCell
                                isHeader
                                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                            >
                                Prix
                            </TableCell>
                            <TableCell
                                isHeader
                                className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400"
                            >
                                Statut
                            </TableCell>
                            <TableCell
                                isHeader
                                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                            >
                                Date de modification
                            </TableCell>
                        </TableRow>
                    </TableHeader>

                    <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                        {isPending ? (
                            <TableRow>
                                <TableCell className="px-5 py-8 text-center">
                                    <div className="flex items-center justify-center gap-2">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        <span className="text-gray-500 dark:text-gray-400">Chargement...</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : historiqueStock.length === 0 ? (
                            <TableRow>
                                <TableCell className="px-5 py-8 text-center">
                                    <span className="text-gray-500 dark:text-gray-400">Aucun historique de stock trouvé</span>
                                </TableCell>
                            </TableRow>
                        ) : (
                            historiqueStock.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                                        <div className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                            {item.nom}
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        {item.quantite}
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        {item.fournisseur || '-'}
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        {formatPrice(item.prix)}
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-center">
                                        <Badge
                                            size="sm"
                                            color={item.statut === 'ajouter' ? 'success' : 'error'}
                                        >
                                            {item.statut === 'ajouter' ? 'Ajouté' : 'Retiré'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        {formatDate(item.createdAt)}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </ComponentCard>
    );
}