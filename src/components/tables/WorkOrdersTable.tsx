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
import { getWorkOrders, deleteWorkOrder } from "@/server/work-orders";
import { Loader2, Edit, Trash2, Plus } from "lucide-react";
import ComponentCard from "../common/ComponentCard";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface WorkOrder {
    id: string;
    workOrderNumber: string;
    workRequestNumber: string;
    interventionType: "préventive" | "curative";
    numberOfIntervenants: number;
    interventionDateTime: Date;
    approximateDuration: number | null;
    stepsToFollow: string;
    createdAt: Date;
    updatedAt: Date;
    createdById: string;
}



const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('fr-FR');
};

export default function WorkOrdersTable() {
    const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
    const [isPending, startTransition] = useTransition();
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        fetchWorkOrders();
    }, []);

    const fetchWorkOrders = async () => {
        const { success, data } = await getWorkOrders();
        if (success && data) {
            startTransition(() => {
             setWorkOrders(data as WorkOrder[]);
            });
        }
    };

    const handleEdit = (id: string) => {
        router.push(`/interventions/work-orders/${id}/edit`);
    };

    const handleDelete = async (id: string) => {
        if (confirm("Êtes-vous sûr de vouloir supprimer cet ordre de travail ?")) {
            setDeletingId(id);
            const { success, message } = await deleteWorkOrder(id);
            if (success) {
                toast.success(message);
                fetchWorkOrders();
            } else {
                toast.error(message);
            }
            setDeletingId(null);
        }
    };

    const handleAdd = () => {
        router.push("/interventions/work-orders/add");
    };

    return (
        isPending ? (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="w-4 h-4 animate-spin" />
            </div>
        ) : (
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Ordres de Travail</h3>
                    <button
                        onClick={handleAdd}
                        className="flex items-center gap-2 px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors"
                    >
                        <Plus size={16} />
                        Nouvel ordre
                    </button>
                </div>
                
                {workOrders.length > 0 ? (
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
                                                N° Ordre
                                            </TableCell>
                                            <TableCell
                                                isHeader
                                                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                            >
                                                N° Demande
                                            </TableCell>
                                            <TableCell
                                                isHeader
                                                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                            >
                                                Type d'intervention
                                            </TableCell>
                                            <TableCell
                                                isHeader
                                                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                            >
                                                Nb Intervenants
                                            </TableCell>
                                            <TableCell
                                                isHeader
                                                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                            >
                                                Date intervention
                                            </TableCell>
                                            <TableCell
                                                isHeader
                                                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                            >
                                                Durée (min)
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
                                        {workOrders.map((workOrder) => (
                                            <TableRow key={workOrder.id}>
                                                <TableCell className="px-5 py-4 sm:px-6 text-start">
                                                    <button
                                                        onClick={() => router.push(`/interventions/work-orders/${workOrder.id}`)}
                                                        className="font-medium text-gray-800 text-theme-sm dark:text-white/90 hover:text-brand-500 transition-colors text-left"
                                                    >
                                                        {workOrder.workOrderNumber}
                                                    </button>
                                                </TableCell>
                                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                    {workOrder.workRequestNumber}
                                                </TableCell>
                                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                    <Badge size="sm" color={workOrder.interventionType === 'préventive' ? 'info' : 'warning'}>
                                                        {workOrder.interventionType}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                    {workOrder.numberOfIntervenants}
                                                </TableCell>
                                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                    {formatDate(workOrder.interventionDateTime)}
                                                </TableCell>
                                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                    {workOrder.approximateDuration ? `${workOrder.approximateDuration} min` : 'Non définie'}
                                                </TableCell>
                                                <TableCell className="px-4 py-3 text-center">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <button
                                                            onClick={() => handleEdit(workOrder.id)}
                                                            className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                                                            title="Modifier"
                                                        >
                                                            <Edit size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(workOrder.id)}
                                                            disabled={deletingId === workOrder.id}
                                                            className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                                            title="Supprimer"
                                                        >
                                                            {deletingId === workOrder.id ? (
                                                                <Loader2 size={16} className="animate-spin" />
                                                            ) : (
                                                                <Trash2 size={16} />
                                                            )}
                                                        </button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-32 border border-gray-200 rounded-lg">
                        <p className="text-gray-500 text-theme-sm dark:text-gray-400">Aucun ordre de travail trouvé</p>
                    </div>
                )}
            </div>
        )
    )
}