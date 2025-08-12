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
import { getWorkRequests, deleteWorkRequest } from "@/server/work-requests";
import { Loader2, Edit, Trash2, Plus } from "lucide-react";
import ComponentCard from "../common/ComponentCard";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface WorkRequest {
    id: string;
    requestNumber: string;
    requesterLastName: string;
    requesterFirstName: string;
    equipmentName: string;
    failureType: string;
    failureDescription: string;
    workOrderAssigned: boolean | null;
    reportCompleted: boolean | null;
    createdAt: Date;
    updatedAt: Date;
    equipmentId: string | null;
    createdById: string | null;
}

const getFailureTypeColor = (failureType: string) => {
    switch (failureType.toLowerCase()) {
        case "mécanique": return "warning";
        case "électrique": return "info";
        default: return "primary";
    }
};

const getStatusColor = (workOrderAssigned: boolean, reportCompleted: boolean) => {
    if (reportCompleted) return "success";
    if (workOrderAssigned) return "info";
    return "warning";
};

const getStatusText = (workOrderAssigned: boolean, reportCompleted: boolean) => {
    if (reportCompleted) return "Terminé";
    if (workOrderAssigned) return "En cours";
    return "En attente";
};

const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('fr-FR');
};

export default function WorkRequestsTable() {
    const [workRequests, setWorkRequests] = useState<WorkRequest[]>([]);
    const [isPending, startTransition] = useTransition();
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        fetchWorkRequests();
    }, []);

    const fetchWorkRequests = async () => {
        const { success, data } = await getWorkRequests();
        if (success && data) {
            startTransition(() => {
                setWorkRequests(data);
            });
        }
    };

    const handleEdit = (id: string) => {
        router.push(`/interventions/requests/${id}/edit`);
    };

    const handleDelete = async (id: string) => {
        if (confirm("Êtes-vous sûr de vouloir supprimer cette demande d'intervention ?")) {
            setDeletingId(id);
            const { success, message } = await deleteWorkRequest(id);
            if (success) {
                toast.success(message);
                fetchWorkRequests();
            } else {
                toast.error(message);
            }
            setDeletingId(null);
        }
    };

    const handleAdd = () => {
        router.push("/interventions/requests/add");
    };

    return (
        isPending ? (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="w-4 h-4 animate-spin" />
            </div>
        ) : (
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Demandes d'Intervention</h3>
                    <button
                        onClick={handleAdd}
                        className="flex items-center gap-2 px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors"
                    >
                        <Plus size={16} />
                        Nouvelle demande
                    </button>
                </div>
                
                {workRequests.length > 0 ? (
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
                                                N° Demande
                                            </TableCell>
                                            <TableCell
                                                isHeader
                                                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                            >
                                                Date création
                                            </TableCell>
                                            <TableCell
                                                isHeader
                                                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                            >
                                                Demandeur
                                            </TableCell>
                                            <TableCell
                                                isHeader
                                                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                            >
                                                Équipement
                                            </TableCell>
                                            <TableCell
                                                isHeader
                                                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                            >
                                                Type de panne
                                            </TableCell>
                                            <TableCell
                                                isHeader
                                                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                            >
                                                Description
                                            </TableCell>
                                            <TableCell
                                                isHeader
                                                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                            >
                                                Statut
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
                                        {workRequests.map((workRequest) => (
                                            <TableRow key={workRequest.id}>
                                                <TableCell className="px-5 py-4 sm:px-6 text-start">
                                                    <button
                                                        onClick={() => router.push(`/interventions/requests/${workRequest.id}`)}
                                                        className="font-medium text-gray-800 text-theme-sm dark:text-white/90 hover:text-brand-500 transition-colors text-left"
                                                    >
                                                        {workRequest.requestNumber}
                                                    </button>
                                                </TableCell>
                                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                    {formatDate(workRequest.createdAt)}
                                                </TableCell>
                                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                    {workRequest.requesterFirstName} {workRequest.requesterLastName}
                                                </TableCell>
                                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                    {workRequest.equipmentName}
                                                </TableCell>
                                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                    <Badge size="sm" color={getFailureTypeColor(workRequest.failureType) as "primary" | "warning" | "info"}>
                                                        {workRequest.failureType}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                    <div className="max-w-xs truncate" title={workRequest.failureDescription}>
                                                        {workRequest.failureDescription}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                    <Badge size="sm" color={getStatusColor(workRequest.workOrderAssigned ?? false, workRequest.reportCompleted ?? false)}>
                                                        {getStatusText(workRequest.workOrderAssigned ?? false, workRequest.reportCompleted ?? false)}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="px-4 py-3 text-center">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <button
                                                            onClick={() => handleEdit(workRequest.id)}
                                                            className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                                                            title="Modifier"
                                                        >
                                                            <Edit size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(workRequest.id)}
                                                            disabled={deletingId === workRequest.id}
                                                            className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                                            title="Supprimer"
                                                        >
                                                            {deletingId === workRequest.id ? (
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
                        <p className="text-gray-500 text-theme-sm dark:text-gray-400">Aucune demande d'intervention trouvée</p>
                    </div>
                )}
            </div>
        )
    )
}