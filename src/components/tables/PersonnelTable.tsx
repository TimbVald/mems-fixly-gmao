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
import { getAllUsers, deleteUser } from "@/server/users";
import { Loader2, Edit, Trash2 } from "lucide-react";
import ComponentCard from "../common/ComponentCard";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    matricule: string | null;
    createdAt: Date;
    updatedAt: Date;
}

export default function PersonnelTable() {
    const [users, setUsers] = useState<User[]>([]);
    const [isPending, startTransition] = useTransition();
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const data = await getAllUsers();
            startTransition(() => {
                setUsers(data);
            });
        } catch (error) {
            toast.error("Erreur lors du chargement des utilisateurs");
        }
    };

    const handleEdit = (id: string) => {
        router.push(`/personnel/${id}/edit`);
    };

    const handleDelete = async (id: string) => {
        if (confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
            setDeletingId(id);
            const { success, message } = await deleteUser(id);
            if (success) {
                toast.success(message);
                fetchUsers();
            } else {
                toast.error(message);
            }
            setDeletingId(null);
        }
    };

    const getRoleColor = (role: string) => {
        switch (role) {
            case "ADMIN":
                return "error";
            case "TECHNICIEN":
                return "warning";
            case "PERSONNEL":
                return "success";
            default:
                return "primary";
        }
    };

    const getRoleLabel = (role: string) => {
        switch (role) {
            case "ADMIN":
                return "Administrateur";
            case "TECHNICIEN":
                return "Technicien";
            case "PERSONNEL":
                return "Personnel";
            default:
                return role;
        }
    };

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        isPending ? (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="w-4 h-4 animate-spin" />
            </div>
        ) : (
            users.length > 0 ? (
                <ComponentCard title="Liste du personnel">
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                    <div className="max-w-full overflow-x-auto">
                        <div className="min-w-[800px]">
                            <Table>
                                {/* Table Header */}
                                <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                                    <TableRow>
                                        <TableCell
                                            isHeader
                                            className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                        >
                                            Utilisateur
                                        </TableCell>
                                        <TableCell
                                            isHeader
                                            className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                        >
                                            Email
                                        </TableCell>
                                        <TableCell
                                            isHeader
                                            className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                        >
                                            Matricule
                                        </TableCell>
                                        <TableCell
                                            isHeader
                                            className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                        >
                                            Rôle
                                        </TableCell>
                                        <TableCell
                                            isHeader
                                            className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                        >
                                            Date de création
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
                                    {users.map((user) => (
                                        <TableRow key={user.id}>
                                            <TableCell className="px-5 py-4 sm:px-6 text-start">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                                            {user.name.charAt(0).toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <button
                                                            onClick={() => router.push(`/personnel/${user.id}`)}
                                                            className="block font-medium text-gray-800 text-theme-sm dark:text-white/90 hover:text-brand-500 transition-colors text-left"
                                                        >
                                                            {user.name}
                                                        </button>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                {user.email}
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                {user.matricule || "Non défini"}
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                <Badge
                                                    size="sm"
                                                    color={getRoleColor(user.role) as "success" | "warning" | "error" | "primary"}
                                                >
                                                    {getRoleLabel(user.role)}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                {formatDate(user.createdAt)}
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        onClick={() => handleEdit(user.id)}
                                                        className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                                                        title="Modifier"
                                                    >
                                                        <Edit size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(user.id)}
                                                        disabled={deletingId === user.id}
                                                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                                        title="Supprimer"
                                                    >
                                                        {deletingId === user.id ? (
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
                    <p className="text-gray-500 text-theme-sm dark:text-gray-400">Aucun utilisateur trouvé</p>
                </div>
            )
        )
    )
}