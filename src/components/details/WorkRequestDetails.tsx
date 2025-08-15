"use client"
import { useEffect, useState } from "react"
import { getWorkRequestById } from "@/server/work-requests"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import ComponentCard from "../common/ComponentCard"
import { Loader2, Edit, ArrowLeft } from "lucide-react"
import Badge from "../ui/badge/Badge"
import PrintButton from "../print/PrintButton"
import WorkRequestPrint from "../print/WorkRequestPrint"

interface WorkRequest {
    id: string;
    requestNumber: string;
    requesterLastName: string;
    requesterFirstName: string;
    equipmentName: string;
    failureType: string;
    failureDescription: string;
    workOrderAssigned: boolean;
    reportCompleted: boolean;
    createdAt: Date;
    updatedAt: Date;
    equipmentId: string | null;
    createdById: string | null;
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
                    workOrderAssigned: data.workOrderAssigned ?? false
                } as WorkRequest)
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
                    <div className="flex items-center gap-2">
                        <PrintButton
                            documentName={`Demande_${workRequest.requestNumber}`}
                            variant="outline"
                        >
                            <WorkRequestPrint workRequest={workRequest} />
                        </PrintButton>
                        <button
                            onClick={() => router.push(`/interventions/requests/${workRequest.id}/edit`)}
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
                                Numéro de demande
                            </label>
                            <p className="text-gray-900 dark:text-white font-semibold">{workRequest.requestNumber}</p>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Demandé par
                            </label>
                            <p className="text-gray-600 dark:text-gray-400">{workRequest.requesterFirstName} {workRequest.requesterLastName}</p>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Type de panne
                            </label>
                            <p className="text-gray-600 dark:text-gray-400">{workRequest.failureType}</p>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Ordre de travail assigné
                            </label>
                            <Badge size="sm" color={workRequest.workOrderAssigned ? "success" : "warning"}>
                                {workRequest.workOrderAssigned ? "Oui" : "Non"}
                            </Badge>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Rapport complété
                            </label>
                            <Badge size="sm" color={workRequest.reportCompleted ? "success" : "warning"}>
                                {workRequest.reportCompleted ? "Oui" : "Non"}
                            </Badge>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Nom de l'équipement
                            </label>
                            <p className="text-gray-600 dark:text-gray-400">{workRequest.equipmentName}</p>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                ID Équipement
                            </label>
                            <p className="text-gray-600 dark:text-gray-400">{workRequest.equipmentId || "Non spécifié"}</p>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Créé par
                            </label>
                            <p className="text-gray-600 dark:text-gray-400">{workRequest.createdById || "Non spécifié"}</p>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Créé le
                            </label>
                            <p className="text-gray-600 dark:text-gray-400">{formatDate(workRequest.createdAt.toString())}</p>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Modifié le
                            </label>
                            <p className="text-gray-600 dark:text-gray-400">{formatDate(workRequest.updatedAt.toString())}</p>
                        </div>
                    </div>
                </div>

                {/* Description de la panne */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Description de la panne
                        </label>
                        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                                {workRequest.failureDescription || "Aucune description spécifiée"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </ComponentCard>
    )
}