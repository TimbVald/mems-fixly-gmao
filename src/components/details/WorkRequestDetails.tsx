"use client"
import { useEffect, useState } from "react"
import { getWorkRequestById } from "@/server/work-requests"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import ComponentCard from "../common/ComponentCard"
import { Loader2, Edit, ArrowLeft } from "lucide-react"
import Badge from "../ui/badge/Badge"

interface WorkRequest {
    id: string;
    requestNumber: string;
    equipmentId: string;
    requestedBy: string;
    description: string;
    priority: "low" | "medium" | "high" | "urgent";
    status: "pending" | "approved" | "in_progress" | "completed" | "cancelled";
    requestDate: string;
    requiredDate: string;
    estimatedCost: number;
    justification: string;
    createdAt: string;
    updatedAt: string;
}

interface WorkRequestDetailsProps {
    workRequestId: string;
}

export default function WorkRequestDetails({ workRequestId }: WorkRequestDetailsProps) {
    const [workRequest, setWorkRequest] = useState<WorkRequest | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        const loadWorkRequest = async () => {
            const { success, data } = await getWorkRequestById(workRequestId)
            if (success && data) {
                setWorkRequest({
                    ...data,
                    requestDate: data.requestDate.toString(),
                    requiredDate: data.requiredDate.toString(),
                    createdAt: data.createdAt.toString(),
                    updatedAt: data.updatedAt.toString()
                })
            } else {
                toast.error("Demande d'intervention non trouvée")
                router.push("/interventions/requests")
            }
            setIsLoading(false)
        }
        loadWorkRequest()
    }, [workRequestId, router])

    if (isLoading) {
        return (
            <ComponentCard title="Détails de la demande">
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="w-8 h-8 animate-spin" />
                </div>
            </ComponentCard>
        )
    }

    if (!workRequest) {
        return (
            <ComponentCard title="Demande non trouvée">
                <div className="flex items-center justify-center h-64">
                    <p className="text-gray-500">Demande d'intervention non trouvée</p>
                </div>
            </ComponentCard>
        )
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const formatDateOnly = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('fr-FR')
    }

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case "low": return "success"
            case "medium": return "warning"
            case "high": return "error"
            case "urgent": return "error"
            default: return "default"
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "pending": return "warning"
            case "approved": return "info"
            case "in_progress": return "warning"
            case "completed": return "success"
            case "cancelled": return "error"
            default: return "default"
        }
    }

    return (
        <ComponentCard title={`Demande d'intervention: ${workRequest.requestNumber}`}>
            <div className="space-y-6">
                {/* Actions */}
                <div className="flex justify-between items-center">
                    <button
                        onClick={() => router.push("/interventions/requests")}
                        className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <ArrowLeft size={16} />
                        Retour à la liste
                    </button>
                    <button
                        onClick={() => router.push(`/interventions/requests/${workRequest.id}/edit`)}
                        className="flex items-center gap-2 px-4 py-2 text-white bg-brand-500 hover:bg-brand-600 rounded-lg transition-colors"
                    >
                        <Edit size={16} />
                        Modifier
                    </button>
                </div>

                {/* Informations principales */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Numéro de demande
                            </label>
                            <p className="text-gray-900 dark:text-white font-semibold">{workRequest.requestNumber}</p>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Demandé par
                            </label>
                            <p className="text-gray-600 dark:text-gray-400">{workRequest.requestedBy}</p>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Priorité
                            </label>
                            <Badge size="sm" color={getPriorityColor(workRequest.priority)}>
                                {workRequest.priority}
                            </Badge>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Statut
                            </label>
                            <Badge size="sm" color={getStatusColor(workRequest.status)}>
                                {workRequest.status}
                            </Badge>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Date de demande
                            </label>
                            <p className="text-gray-600 dark:text-gray-400">{formatDateOnly(workRequest.requestDate)}</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                ID Équipement
                            </label>
                            <p className="text-gray-600 dark:text-gray-400">{workRequest.equipmentId}</p>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Date requise
                            </label>
                            <p className="text-gray-600 dark:text-gray-400">{formatDateOnly(workRequest.requiredDate)}</p>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Coût estimé
                            </label>
                            <p className="text-gray-600 dark:text-gray-400">{workRequest.estimatedCost.toLocaleString('fr-FR')} €</p>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Créé le
                            </label>
                            <p className="text-gray-600 dark:text-gray-400">{formatDate(workRequest.createdAt)}</p>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Modifié le
                            </label>
                            <p className="text-gray-600 dark:text-gray-400">{formatDate(workRequest.updatedAt)}</p>
                        </div>
                    </div>
                </div>

                {/* Informations détaillées */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Description
                        </label>
                        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                                {workRequest.description || "Aucune description spécifiée"}
                            </p>
                        </div>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Justification
                        </label>
                        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                                {workRequest.justification || "Aucune justification spécifiée"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </ComponentCard>
    )
}