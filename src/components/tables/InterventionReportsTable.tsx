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
import { getInterventionReports, deleteInterventionReport } from "@/server/intervention-reports";
import { Loader2, Edit, Trash2, Plus } from "lucide-react";
import ComponentCard from "../common/ComponentCard";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface InterventionReport {
    id: string;
    reportNumber: string;
    workOrderNumber: string | null;
    failureType: string;
    failureDescription: string;
    interventionType: string;
    materialUsed: string | null;
    numberOfIntervenants: number;
    causes: string;
    symptoms: string;
    effectsOnEquipment: string;
    repairTime: number;
    stepsFollowed: string;
    createdAt: Date;
    updatedAt: Date;
    equipmentId: string | null;
    createdById: string;
}

const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('fr-FR');
};

export default function InterventionReportsTable() {
    const [reports, setReports] = useState<InterventionReport[]>([]);
    const [isPending, startTransition] = useTransition();
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        const { success, data } = await getInterventionReports();
        if (success && data) {
            startTransition(() => {
                setReports(data);
            });
        }
    };

    const handleEdit = (id: string) => {
        router.push(`/interventions/reports/${id}/edit`);
    };

    const handleDelete = async (id: string) => {
        if (confirm("Êtes-vous sûr de vouloir supprimer ce compte rendu ?")) {
            setDeletingId(id);
            const { success, message } = await deleteInterventionReport(id);
            if (success) {
                toast.success(message);
                fetchReports();
            } else {
                toast.error(message);
            }
            setDeletingId(null);
        }
    };

    const handleAdd = () => {
        router.push("/interventions/reports/add");
    };

    return (
        isPending ? (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="w-4 h-4 animate-spin" />
            </div>
        ) : (
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Comptes Rendus d'Intervention</h3>
                    <button
                        onClick={handleAdd}
                        className="flex items-center gap-2 px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors"
                    >
                        <Plus size={16} />
                        Nouveau compte rendu
                    </button>
                </div>
                
                {reports.length > 0 ? (
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
                                                N° Rapport
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
                                                Type d'intervention
                                            </TableCell>
                                            <TableCell
                                                isHeader
                                                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                            >
                                                Intervenants
                                            </TableCell>
                                            <TableCell
                                                isHeader
                                                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                            >
                                                Temps réparation (min)
                                            </TableCell>
                                            <TableCell
                                                isHeader
                                                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                            >
                                                Date création
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
                                        {reports.map((report) => (
                                            <TableRow key={report.id}>
                                                <TableCell className="px-5 py-4 sm:px-6 text-start">
                                                    <button
                                                        onClick={() => router.push(`/interventions/reports/${report.id}`)}
                                                        className="font-medium text-gray-800 text-theme-sm dark:text-white/90 hover:text-brand-500 transition-colors text-left"
                                                    >
                                                        {report.reportNumber}
                                                    </button>
                                                </TableCell>
                                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                    {report.failureType}
                                                </TableCell>
                                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                    {report.interventionType}
                                                </TableCell>
                                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                    {report.numberOfIntervenants}
                                                </TableCell>
                                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                    {report.repairTime} min
                                                </TableCell>
                                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                    {formatDate(report.createdAt)}
                                                </TableCell>
                                                <TableCell className="px-4 py-3 text-center">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <button
                                                            onClick={() => handleEdit(report.id)}
                                                            className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                                                            title="Modifier"
                                                        >
                                                            <Edit size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(report.id)}
                                                            disabled={deletingId === report.id}
                                                            className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                                            title="Supprimer"
                                                        >
                                                            {deletingId === report.id ? (
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
                        <p className="text-gray-500 text-theme-sm dark:text-gray-400">Aucun compte rendu trouvé</p>
                    </div>
                )}
            </div>
        )
    )
}