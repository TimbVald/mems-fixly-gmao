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
import Image from "next/image";
import { getEquipements, deleteEquipement } from "@/server/equipement";
import { Loader2, Edit, Trash2 } from "lucide-react";
import ComponentCard from "../common/ComponentCard";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Equipement {
    id: string;
    name: string;
    machineName: string | null;
    subAssemblies: string | null;
    criticalityIndex: number | null;
    plan: string | null;
    characteristics: string | null;
    technicalFolder: string | null;
    failureOccurrence: number | null;
    mtbf: number | null;
    mttr: number | null;
    image: string | null;
}

export default function EquipementTable() {
    const [equipements, setEquipements] = useState<Equipement[]>([]);
    const [isPending, startTransition] = useTransition();
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        fetchEquipements();
    }, []);

    const fetchEquipements = async () => {
        const { success, data } = await getEquipements();
        if (success && data) {
            startTransition(() => {
                setEquipements(data);
            });
        }
    };

    const handleEdit = (id: string) => {
        router.push(`/equipements/${id}/edit`);
    };

    const handleDelete = async (id: string) => {
        if (confirm("Êtes-vous sûr de vouloir supprimer cet équipement ?")) {
            setDeletingId(id);
            const { success, message } = await deleteEquipement(id);
            if (success) {
                toast.success(message);
                fetchEquipements();
            } else {
                toast.error(message);
            }
            setDeletingId(null);
        }
    };

    return (
        isPending ? (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="w-4 h-4 animate-spin" />
            </div>
        ) : (
            equipements.length > 0 ? (
                <ComponentCard title="Liste des équipements">
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
                                            Equipement & Machine
                                        </TableCell>
                                        <TableCell
                                            isHeader
                                            className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400"
                                        >
                                            Image
                                        </TableCell>
                                        <TableCell
                                            isHeader
                                            className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                        >
                                            Sous-assemblées
                                        </TableCell>
                                        <TableCell
                                            isHeader
                                            className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                        >
                                            Criticité
                                        </TableCell>
                                        <TableCell
                                            isHeader
                                            className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                        >
                                            Plan
                                        </TableCell>
                                        <TableCell
                                            isHeader
                                            className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                        >
                                            Caractéristiques
                                        </TableCell>
                                        <TableCell
                                            isHeader
                                            className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                        >
                                            Dossier technique
                                        </TableCell>
                                        <TableCell
                                            isHeader
                                            className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                        >
                                            Fréquence d'occurrence
                                        </TableCell>
                                        <TableCell
                                            isHeader
                                            className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                        >
                                            MTBF
                                        </TableCell>
                                        <TableCell
                                            isHeader
                                            className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                        >
                                            MTTR
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
                                    {equipements.map((equipement) => (
                                        <TableRow key={equipement.id}>
                                            <TableCell className="px-5 py-4 sm:px-6 text-start">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 overflow-hidden rounded-full">
                                                        <Image
                                                            width={40}
                                                            height={40}
                                                            src="/images/equipement.svg"
                                                            alt={equipement.name}
                                                        />
                                                    </div>
                                                    <div>
                                                        <button
                                                            onClick={() => router.push(`/equipements/${equipement.id}`)}
                                                            className="block font-medium text-gray-800 text-theme-sm dark:text-white/90 hover:text-brand-500 transition-colors text-left"
                                                        >
                                                            {equipement.name}
                                                        </button>
                                                        <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                                                            {equipement.machineName}
                                                        </span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-center">
                                                {equipement.image ? (
                                                    <div className="flex justify-center">
                                                        <img 
                                                            src={equipement.image} 
                                                            alt={equipement.name}
                                                            className="w-12 h-12 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                                                            onError={(e) => {
                                                                e.currentTarget.style.display = 'none';
                                                            }}
                                                        />
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-400 text-theme-xs">Aucune image</span>
                                                )}
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                {equipement.subAssemblies}
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                <Badge
                                                    size="sm"
                                                    color={
                                                        equipement.criticalityIndex === 1
                                                            ? "success"
                                                            : equipement.criticalityIndex === 2
                                                                ? "warning"
                                                                : "error"
                                                    }
                                                >
                                                    {equipement.criticalityIndex}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                {equipement.plan}
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                                                {equipement.characteristics}
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                                                {equipement.technicalFolder}
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                                                <Badge
                                                    size="sm"
                                                    color={
                                                        equipement.failureOccurrence === 1
                                                            ? "success"
                                                            : equipement.failureOccurrence === 2
                                                                ? "warning"
                                                                : "error"
                                                    }
                                                >
                                                    {equipement.failureOccurrence}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                                                <Badge
                                                    size="sm"
                                                    color={
                                                        equipement.mtbf === 1
                                                            ? "success"
                                                            : equipement.mtbf === 2
                                                                ? "warning"
                                                                : "error"
                                                    }
                                                >
                                                    {equipement.mtbf}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                                                <Badge
                                                    size="sm"
                                                    color={
                                                        equipement.mttr === 1
                                                            ? "success"
                                                            : equipement.mttr === 2
                                                                ? "warning"
                                                                : "error"
                                                    }
                                                >
                                                    {equipement.mttr}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        onClick={() => handleEdit(equipement.id)}
                                                        className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                                                        title="Modifier"
                                                    >
                                                        <Edit size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(equipement.id)}
                                                        disabled={deletingId === equipement.id}
                                                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                                        title="Supprimer"
                                                    >
                                                        {deletingId === equipement.id ? (
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
                </ComponentCard>
            ) : (
                <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500 text-theme-sm dark:text-gray-400">Aucun équipement trouvé</p>
                </div>
            )
        )
    )
}