"use client"
import { useEffect, useState } from "react"
import { getWorkOrderById } from "@/server/work-orders"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import ComponentCard from "../common/ComponentCard"
import { Loader2, Edit, ArrowLeft } from "lucide-react"
import Badge from "../ui/badge/Badge"
import PrintButton from "../print/PrintButton"
import WorkOrderPrint from "../print/WorkOrderPrint"

interface WorkOrder {
    id: string;
    workOrderNumber: string;
    workRequestNumber: string;
    interventionType: string;
    numberOfIntervenants: number;
    interventionDateTime: Date;
    approximateDuration: number | null;
    stepsToFollow: string;
    createdAt: Date;
    updatedAt: Date;
    createdById: string;
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
                setWorkOrder(data)
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
                    <div className="flex items-center gap-2">
                        <PrintButton
                            documentName={`Ordre_${workOrder.workOrderNumber}`}
                            variant="outline"
                        >
                            <WorkOrderPrint workOrder={workOrder} />
                        </PrintButton>
                        <button
                            onClick={() => router.push(`/interventions/work-orders/${workOrder.id}/edit`)}
                            className="flex items-center gap-2 px-4 py-2 text-white bg-brand-500 hover:bg-brand-600 rounded-lg transition-colors"
                        >
                            <Edit size={16} />
                            Modifier
                        </button>
                    </div>
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
                                Numéro de demande liée
                            </label>
                            <p className="text-gray-600 dark:text-gray-400">{workOrder.workRequestNumber}</p>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Type d'intervention
                            </label>
                            <Badge size="sm" color={workOrder.interventionType === 'préventive' ? 'success' : 'warning'}>
                                {workOrder.interventionType}
                            </Badge>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Nombre d'intervenants
                            </label>
                            <p className="text-gray-600 dark:text-gray-400">{workOrder.numberOfIntervenants}</p>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Date et heure d'intervention
                            </label>
                            <p className="text-gray-600 dark:text-gray-400">{formatDate(workOrder.interventionDateTime.toString())}</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Durée approximative
                            </label>
                            <p className="text-gray-600 dark:text-gray-400">
                                {workOrder.approximateDuration ? `${workOrder.approximateDuration} minutes` : 'Non spécifiée'}
                            </p>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Créé par
                            </label>
                            <p className="text-gray-600 dark:text-gray-400">{workOrder.createdById}</p>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Créé le
                            </label>
                            <p className="text-gray-600 dark:text-gray-400">{formatDate(workOrder.createdAt.toString())}</p>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Modifié le
                            </label>
                            <p className="text-gray-600 dark:text-gray-400">{formatDate(workOrder.updatedAt.toString())}</p>
                        </div>
                    </div>
                </div>

                {/* Étapes à suivre */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Étapes à suivre
                        </label>
                        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                                {workOrder.stepsToFollow}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </ComponentCard>
    )
}