"use client"
import { useEffect, useState } from "react"
import { getInterventionReportById } from "@/server/intervention-reports"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import ComponentCard from "../common/ComponentCard"
import { Loader2, Edit, ArrowLeft } from "lucide-react"
import Badge from "../ui/badge/Badge"

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
    createdAt: string;
    updatedAt: string;
    equipmentId: string | null;
    createdById: string;
    equipment?: {
        id: string;
        name: string;
    };
    createdBy?: {
        id: string;
        name: string;
    };
}

interface InterventionReportDetailsProps {
    reportId: string;
}

export default function InterventionReportDetails({ reportId }: InterventionReportDetailsProps) {
    const [report, setReport] = useState<InterventionReport | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        const loadReport = async () => {
            const { success, data } = await getInterventionReportById(reportId)
            if (success && data) {
                setReport({
                    ...data,
                    createdAt: data.createdAt.toString(),
                    updatedAt: data.updatedAt.toString()
                })
            } else {
                toast.error("Compte rendu d'intervention non trouvé")
                router.push("/interventions/reports")
            }
            setIsLoading(false)
        }
        loadReport()
    }, [reportId, router])

    if (isLoading) {
        return (
            <ComponentCard title="Détails du compte rendu">
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="w-8 h-8 animate-spin" />
                </div>
            </ComponentCard>
        )
    }

    if (!report) {
        return (
            <ComponentCard title="Compte rendu non trouvé">
                <div className="flex items-center justify-center h-64">
                    <p className="text-gray-500">Compte rendu d'intervention non trouvé</p>
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
        <ComponentCard title={`Compte rendu: ${report.reportNumber}`}>
            <div className="space-y-6">
                {/* Actions */}
                <div className="flex justify-between items-center">
                    <button
                        onClick={() => router.push("/interventions/reports")}
                        className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <ArrowLeft size={16} />
                        Retour à la liste
                    </button>
                    <button
                        onClick={() => router.push(`/interventions/reports/${report.id}/edit`)}
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
                                Numéro de rapport
                            </label>
                            <p className="text-gray-900 dark:text-white font-semibold">{report.reportNumber}</p>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Numéro d'ordre de travail
                            </label>
                            <p className="text-gray-600 dark:text-gray-400">{report.workOrderNumber || 'Non assigné'}</p>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Équipement
                            </label>
                            <p className="text-gray-600 dark:text-gray-400">{report.equipment?.name || 'Non spécifié'}</p>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Type de panne
                            </label>
                            <p className="text-gray-600 dark:text-gray-400">{report.failureType}</p>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Type d'intervention
                            </label>
                            <p className="text-gray-600 dark:text-gray-400">{report.interventionType}</p>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Nombre d'intervenants
                            </label>
                            <p className="text-gray-600 dark:text-gray-400">{report.numberOfIntervenants}</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Temps de réparation
                            </label>
                            <p className="text-gray-600 dark:text-gray-400">{report.repairTime} minutes</p>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Matériel utilisé
                            </label>
                            <p className="text-gray-600 dark:text-gray-400">{report.materialUsed || 'Aucun'}</p>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Créé par
                            </label>
                            <p className="text-gray-600 dark:text-gray-400">{report.createdBy?.name || 'Inconnu'}</p>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Créé le
                            </label>
                            <p className="text-gray-600 dark:text-gray-400">{formatDate(report.createdAt)}</p>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Modifié le
                            </label>
                            <p className="text-gray-600 dark:text-gray-400">{formatDate(report.updatedAt)}</p>
                        </div>
                    </div>
                </div>

                {/* Informations détaillées */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Description de la panne
                        </label>
                        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                                {report.failureDescription}
                            </p>
                        </div>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Causes
                        </label>
                        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                                {report.causes}
                            </p>
                        </div>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Symptômes
                        </label>
                        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                                {report.symptoms}
                            </p>
                        </div>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Effets sur l'équipement
                        </label>
                        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                                {report.effectsOnEquipment}
                            </p>
                        </div>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Étapes suivies
                        </label>
                        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                                {report.stepsFollowed}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </ComponentCard>
    )
}