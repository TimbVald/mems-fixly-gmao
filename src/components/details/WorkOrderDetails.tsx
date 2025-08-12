"use client"
import { useEffect, useState } from "react"
import { getWorkOrderById } from "@/server/work-orders"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import ComponentCard from "../common/ComponentCard"
import { Loader2, Edit, ArrowLeft } from "lucide-react"
import Badge from "../ui/badge/Badge"

interface WorkOrder {
    id: string;
    workOrderNumber: string;
    workRequestId: string;
    equipmentId: string;
    assignedTo: string;
    plannedStartDate: string;
    plannedEndDate: string;
    estimatedDuration: number;
    priority: "low" | "medium" | "high" | "urgent";
    status: "planned" | "in_progress" | "completed" | "cancelled";
    workType: "corrective" | "preventive" | "improvement";
    description: string;
    instructions: string;
    createdAt: string;
    updatedAt: string;
}

interface WorkOrderDetailsProps {
    workOrderId: string;
}

export default function WorkOrderDetails({ workOrderId }: WorkOrderDetailsProps) {
    const [workOrder, setWorkOrder] = useState<WorkOrder | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        const loadWorkOrder = async () => {
            const { success, data } = await getWorkOrderById(workOrderId)
            if (success && data) {
                setWorkOrder({
                    ...data,
                    plannedStartDate: data.plannedStartDate.toString(),
                    plannedEndDate: data.plannedEndDate.toString(),
                    createdAt: data.createdAt.toString(),
                    updatedAt: data.updatedAt.toString()
                })
            } else {
                toast.error("Ordre de travail non trouvé")
                router.push("/interventions/work-orders")
            }
            setIsLoading(false)
        }
        loadWorkOrder()
    }, [workOrderId, router])

    if (isLoading) {
        return (
            <ComponentCard title="Détails de l'ordre">
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="w-8 h-8 animate-spin" />
                </div>
            </ComponentCard>
        )
    }

    if (!workOrder) {
        return (
            <ComponentCard title="Ordre non trouvé">
                <div className="flex items-center justify-center h-64">
                    <p className="text-gray-500">Ordre de travail non trouvé</p>
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
            case "planned": return "info"
            case "in_progress": return "warning"
            case "completed": return "success"
            case "cancelled": return "error"
            default: return "default"
        }
    }

    const getWorkTypeColor = (workType: string) => {
        switch (workType) {
            case "corrective": return "error"
            case "preventive": return "success"
            case "improvement": return "info"
            default: return "default"
        }
    }

    return (
        <ComponentCard title={`Ordre de travail: ${workOrder.workOrderNumber}`}>
            <div className="space-y-6">
                {/* Actions */}
                <div className="flex justify-between items-center">
                    <button
                        onClick={() => router.push("/interventions/work-orders")}
                        className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <ArrowLeft size={16} />
                        Retour à la liste
                    </button>
                    <button
                        onClick={() => router.push(`/interventions/work-orders/${workOrder.id}/edit`)}
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
                                Numéro d'ordre
                            </label>
                            <p className="text-gray-900 dark:text-white font-semibold">{workOrder.workOrderNumber}</p>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                ID Demande liée
                            </label>
                            <p className="text-gray-600 dark:text-gray-400">{workOrder.workRequestId}</p>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Assigné à
                            </label>
                            <p className="text-gray-600 dark:text-gray-400">{workOrder.assignedTo}</p>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Type de travail
                            </label>
                            <Badge size="sm" color={getWorkTypeColor(workOrder.workType)}>
                                {workOrder.workType}
                            </Badge>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Priorité
                            </label>
                            <Badge size="sm" color={getPriorityColor(workOrder.priority)}>
                                {workOrder.priority}
                            </Badge>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Statut
                            </label>
                            <Badge size="sm" color={getStatusColor(workOrder.status)}>
                                {workOrder.status}
                            </Badge>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                ID Équipement
                            </label>
                            <p className="text-gray-600 dark:text-gray-400">{workOrder.equipmentId}</p>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Date début prévue
                            </label>
                            <p className="text-gray-600 dark:text-gray-400">{formatDateOnly(workOrder.plannedStartDate)}</p>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Date fin prévue
                            </label>
                            <p className="text-gray-600 dark:text-gray-400">{formatDateOnly(workOrder.plannedEndDate)}</p>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Durée estimée
                            </label>
                            <p className="text-gray-600 dark:text-gray-400">{workOrder.estimatedDuration} heures</p>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Créé le
                            </label>
                            <p className="text-gray-600 dark:text-gray-400">{formatDate(workOrder.createdAt)}</p>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Modifié le
                            </label>
                            <p className="text-gray-600 dark:text-gray-400">{formatDate(workOrder.updatedAt)}</p>
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
                                {workOrder.description || "Aucune description spécifiée"}
                            </p>
                        </div>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Instructions
                        </label>
                        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                                {workOrder.instructions || "Aucune instruction spécifiée"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </ComponentCard>
    )
}