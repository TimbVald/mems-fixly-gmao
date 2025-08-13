"use client"
import { useEffect, useState } from "react"
import { getUserById } from "@/server/users"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import ComponentCard from "../common/ComponentCard"
import { Loader2, Edit, ArrowLeft } from "lucide-react"
import Badge from "../ui/badge/Badge"

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    matricule: string | null;
    createdAt: Date;
    updatedAt: Date;
}

interface PersonnelDetailsProps {
    userId: string;
}

export default function PersonnelDetails({ userId }: PersonnelDetailsProps) {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        const loadUser = async () => {
            try {
                const userData = await getUserById(userId)
                if (userData) {
                    setUser(userData)
                } else {
                    toast.error("Utilisateur non trouvé")
                    router.push("/personnel")
                }
            } catch (error) {
                toast.error("Erreur lors du chargement de l'utilisateur")
                router.push("/personnel")
            }
            setIsLoading(false)
        }
        loadUser()
    }, [userId, router])

    if (isLoading) {
        return (
            <ComponentCard title="Détails de l'utilisateur">
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="w-8 h-8 animate-spin" />
                </div>
            </ComponentCard>
        )
    }

    if (!user) {
        return (
            <ComponentCard title="Utilisateur non trouvé">
                <div className="flex items-center justify-center h-64">
                    <p className="text-gray-500">Utilisateur non trouvé</p>
                </div>
            </ComponentCard>
        )
    }

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

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
    }

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
    }

    return (
        <ComponentCard title={`Détails de l'utilisateur: ${user.name}`}>
            <div className="space-y-6">
                {/* Actions */}
                <div className="flex justify-between items-center">
                    <button
                        onClick={() => router.push("/personnel")}
                        className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <ArrowLeft size={16} />
                        Retour à la liste
                    </button>
                    <button
                        onClick={() => router.push(`/personnel/${user.id}/edit`)}
                        className="flex items-center gap-2 px-4 py-2 text-white bg-brand-500 hover:bg-brand-600 rounded-lg transition-colors"
                    >
                        <Edit size={16} />
                        Modifier
                    </button>
                </div>

                {/* Photo de profil et informations principales */}
                <div className="flex items-start gap-6">
                    <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        <span className="text-3xl font-bold text-gray-600 dark:text-gray-300">
                            {user.name.charAt(0).toUpperCase()}
                        </span>
                    </div>
                    <div className="flex-1">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            {user.name}
                        </h2>
                        <div className="flex items-center gap-4 mb-4">
                            <Badge size="md" color={getRoleColor(user.role) as "error" | "warning" | "success" | "primary"}>
                                {getRoleLabel(user.role)}
                            </Badge>
                            {user.matricule && (
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                    Matricule: {user.matricule}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Informations détaillées */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Nom complet
                            </label>
                            <p className="text-gray-900 dark:text-white font-semibold">{user.name}</p>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Adresse email
                            </label>
                            <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Matricule
                            </label>
                            <p className="text-gray-600 dark:text-gray-400">{user.matricule || "Non défini"}</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Rôle
                            </label>
                            <Badge size="sm" color={getRoleColor(user.role)}>
                                {getRoleLabel(user.role)}
                            </Badge>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Créé le
                            </label>
                            <p className="text-gray-600 dark:text-gray-400">{formatDate(user.createdAt)}</p>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Modifié le
                            </label>
                            <p className="text-gray-600 dark:text-gray-400">{formatDate(user.updatedAt)}</p>
                        </div>
                    </div>
                </div>

                {/* Informations supplémentaires */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Permissions et accès
                        </label>
                        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <div className="space-y-2">
                                {user.role === "ADMIN" && (
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                            Accès administrateur complet
                                        </span>
                                    </div>
                                )}
                                {user.role === "TECHNICIEN" && (
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                            Accès technicien - Gestion des interventions
                                        </span>
                                    </div>
                                )}
                                {user.role === "PERSONNEL" && (
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                            Accès personnel - Consultation et demandes
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ComponentCard>
    )
}