"use client"
import { useEffect, useState } from "react"
import { getEquipementById } from "@/server/equipement"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import ComponentCard from "../common/ComponentCard"
import { Loader2, Edit, ArrowLeft } from "lucide-react"
import Badge from "../ui/badge/Badge"

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
    createdAt: string;
    updatedAt: string;
}

interface EquipementDetailsProps {
    equipementId: string;
}

export default function EquipementDetails({ equipementId }: EquipementDetailsProps) {
    const [equipement, setEquipement] = useState<Equipement | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        const loadEquipement = async () => {
            const { success, data } = await getEquipementById(equipementId)
            if (success && data) {
                setEquipement({
                    ...data,
                    createdAt: data.createdAt.toString(),
                    updatedAt: data.updatedAt.toString()
                })
            } else {
                toast.error("Équipement non trouvé")
                router.push("/equipements")
            }
            setIsLoading(false)
        }
        loadEquipement()
    }, [equipementId, router])

    if (isLoading) {
        return (
            <ComponentCard title="Détails de l'équipement">
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="w-8 h-8 animate-spin" />
                </div>
            </ComponentCard>
        )
    }

    if (!equipement) {
        return (
            <ComponentCard title="Équipement non trouvé">
                <div className="flex items-center justify-center h-64">
                    <p className="text-gray-500">Équipement non trouvé</p>
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

    const getCriticalityColor = (index: number | null) => {
        if (index === 1) return "success"
        if (index === 2) return "warning"
        return "error"
    }

    return (
        <ComponentCard title={`Détails de l'équipement: ${equipement.name}`}>
            <div className="space-y-6">
                {/* Actions */}
                <div className="flex justify-between items-center">
                    <button
                        onClick={() => router.push("/equipements")}
                        className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <ArrowLeft size={16} />
                        Retour à la liste
                    </button>
                    <button
                        onClick={() => router.push(`/equipements/${equipement.id}/edit`)}
                        className="flex items-center gap-2 px-4 py-2 text-white bg-brand-500 hover:bg-brand-600 rounded-lg transition-colors"
                    >
                        <Edit size={16} />
                        Modifier
                    </button>
                </div>

                {/* Image de l'équipement */}
                {equipement.image && (
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Image de l'équipement
                        </label>
                        <div className="flex justify-center">
                            <img 
                                src={equipement.image} 
                                alt={equipement.name}
                                className="max-w-md max-h-64 object-contain rounded-lg border border-gray-200 dark:border-gray-700"
                                onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                }}
                            />
                        </div>
                    </div>
                )}

                {/* Informations principales */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Nom de l'équipement
                            </label>
                            <p className="text-gray-900 dark:text-white font-semibold">{equipement.name}</p>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Nom de la machine
                            </label>
                            <p className="text-gray-600 dark:text-gray-400">{equipement.machineName || "Non spécifié"}</p>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Sous-assemblées
                            </label>
                            <p className="text-gray-600 dark:text-gray-400">{equipement.subAssemblies || "Non spécifié"}</p>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Indice de criticité
                            </label>
                            {equipement.criticalityIndex ? (
                                <Badge size="sm" color={getCriticalityColor(equipement.criticalityIndex)}>
                                    {equipement.criticalityIndex}
                                </Badge>
                            ) : (
                                <p className="text-gray-600 dark:text-gray-400">Non spécifié</p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Fréquence d'occurrence
                            </label>
                            {equipement.failureOccurrence ? (
                                <Badge size="sm" color={getCriticalityColor(equipement.failureOccurrence)}>
                                    {equipement.failureOccurrence}
                                </Badge>
                            ) : (
                                <p className="text-gray-600 dark:text-gray-400">Non spécifié</p>
                            )}
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                MTBF (Mean Time Between Failures)
                            </label>
                            {equipement.mtbf ? (
                                <Badge size="sm" color={getCriticalityColor(equipement.mtbf)}>
                                    {equipement.mtbf}
                                </Badge>
                            ) : (
                                <p className="text-gray-600 dark:text-gray-400">Non spécifié</p>
                            )}
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                MTTR (Mean Time To Repair)
                            </label>
                            {equipement.mttr ? (
                                <Badge size="sm" color={getCriticalityColor(equipement.mttr)}>
                                    {equipement.mttr}
                                </Badge>
                            ) : (
                                <p className="text-gray-600 dark:text-gray-400">Non spécifié</p>
                            )}
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Créé le
                            </label>
                            <p className="text-gray-600 dark:text-gray-400">{formatDate(equipement.createdAt)}</p>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Modifié le
                            </label>
                            <p className="text-gray-600 dark:text-gray-400">{formatDate(equipement.updatedAt)}</p>
                        </div>
                    </div>
                </div>

                {/* Informations détaillées */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Plan
                        </label>
                        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                                {equipement.plan || "Aucun plan spécifié"}
                            </p>
                        </div>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Caractéristiques
                        </label>
                        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                                {equipement.characteristics || "Aucune caractéristique spécifiée"}
                            </p>
                        </div>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Dossier technique
                        </label>
                        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            {equipement.technicalFolder ? (
                                <div className="flex items-center space-x-3">
                                    <div className="flex-shrink-0">
                                        <svg className="h-8 w-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                            Document technique disponible
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {equipement.technicalFolder.includes('application/pdf') ? 'PDF' : 'DOCX'}
                                        </p>
                                    </div>
                                    <a
                                        href={equipement.technicalFolder}
                                        download={`dossier-technique-${equipement.name}.${equipement.technicalFolder.includes('application/pdf') ? 'pdf' : 'docx'}`}
                                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                                    >
                                        Télécharger
                                    </a>
                                </div>
                            ) : (
                                <p className="text-gray-600 dark:text-gray-400">
                                    Aucun dossier technique spécifié
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </ComponentCard>
    )
}