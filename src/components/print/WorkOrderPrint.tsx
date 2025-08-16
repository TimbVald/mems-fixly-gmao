import React from 'react';

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

interface WorkOrderPrintProps {
    workOrder: WorkOrder;
}

const WorkOrderPrint = React.forwardRef<HTMLDivElement, WorkOrderPrintProps>(
    ({ workOrder }, ref) => {
        const formatDate = (date: Date | undefined) => {
            if (!date) return 'Non spécifié';
            return new Date(date).toLocaleDateString('fr-FR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        };

        const getInterventionTypeColor = (type: string) => {
            switch (type.toLowerCase()) {
                case 'maintenance préventive':
                case 'preventive':
                    return 'text-green-600 font-semibold';
                case 'maintenance corrective':
                case 'corrective':
                    return 'text-red-600 font-semibold';
                case 'inspection':
                    return 'text-blue-600 font-semibold';
                case 'urgence':
                case 'emergency':
                    return 'text-orange-600 font-bold';
                default:
                    return 'text-gray-600';
            }
        };

        const getUrgencyLevel = (type: string) => {
            if (type.toLowerCase().includes('urgence') || type.toLowerCase().includes('emergency')) {
                return '🚨 URGENT';
            }
            if (type.toLowerCase().includes('corrective')) {
                return '⚠️ PRIORITAIRE';
            }
            return '';
        };

        return (
            <div ref={ref} className="max-w-4xl mx-auto p-6 bg-white text-black print:p-4 print:max-w-none print:mx-0">
                <style jsx>{`
                    @media print {
                        .print\:p-4 { padding: 1rem !important; }
                        .print\:max-w-none { max-width: none !important; }
                        .print\:mx-0 { margin-left: 0 !important; margin-right: 0 !important; }
                        .print\:text-sm { font-size: 0.875rem !important; }
                        .print\:mb-4 { margin-bottom: 1rem !important; }
                        .print\:break-inside-avoid { break-inside: avoid !important; }
                        .print\:shadow-none { box-shadow: none !important; }
                        .print\:bg-white { background-color: white !important; }
                    }
                `}</style>
                {/* En-tête avec logo et informations entreprise */}
                <div className="text-center mb-6 pb-4 border-b-2 border-gray-800 print:mb-4">
                    <div className="flex items-center justify-center mb-4">
                        <img src="/images/logo/logo.jpg" alt="Machine Care" className="h-12 w-auto mr-4" />
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800 print:text-2xl">ORDRE DE TRAVAIL</h1>
                            <p className="text-sm text-gray-600">Machine Care - Système de gestion de maintenance</p>
                        </div>
                    </div>
                    <div className="bg-gray-100 p-3 rounded print:bg-gray-50">
                        <p className="text-xl font-bold text-gray-800 print:text-lg">N° {workOrder.workOrderNumber}</p>
                        {getUrgencyLevel(workOrder.interventionType) && (
                            <p className="text-lg font-bold text-red-600 mt-1">{getUrgencyLevel(workOrder.interventionType)}</p>
                        )}
                    </div>
                </div>

                {/* Informations principales dans un tableau structuré */}
                <div className="mb-6 print:mb-4 print:break-inside-avoid">
                    <h2 className="text-lg font-bold text-gray-800 mb-3 border-b border-gray-300 pb-1">INFORMATIONS GÉNÉRALES</h2>
                    <div className="grid grid-cols-2 gap-6 print:gap-4">
                        <div className="space-y-3 print:space-y-2">
                            <div className="flex border-b border-gray-200 pb-2">
                                <span className="font-semibold text-gray-800 w-40 print:text-sm">Numéro d'ordre :</span>
                                <span className="text-gray-700 print:text-sm font-semibold">{workOrder.workOrderNumber}</span>
                            </div>
                            
                            <div className="flex border-b border-gray-200 pb-2">
                                <span className="font-semibold text-gray-800 w-40 print:text-sm">Demande liée :</span>
                                <span className="text-blue-600 print:text-sm font-semibold">{workOrder.workRequestNumber}</span>
                            </div>
                            
                            <div className="flex border-b border-gray-200 pb-2">
                                <span className="font-semibold text-gray-800 w-40 print:text-sm">Type d'intervention :</span>
                                <span className={`${getInterventionTypeColor(workOrder.interventionType)} print:text-sm`}>
                                    {workOrder.interventionType}
                                </span>
                            </div>
                            
                            <div className="flex border-b border-gray-200 pb-2">
                                <span className="font-semibold text-gray-800 w-40 print:text-sm">Intervenants :</span>
                                <span className="text-gray-700 print:text-sm font-semibold">{workOrder.numberOfIntervenants} personne(s)</span>
                            </div>
                            
                            <div className="flex border-b border-gray-200 pb-2">
                                <span className="font-semibold text-gray-800 w-40 print:text-sm">Planifié le :</span>
                                <span className="text-gray-700 print:text-sm font-semibold">{formatDate(workOrder.interventionDateTime)}</span>
                            </div>
                        </div>

                        <div className="space-y-3 print:space-y-2">
                            <div className="flex border-b border-gray-200 pb-2">
                                <span className="font-semibold text-gray-800 w-40 print:text-sm">Durée estimée :</span>
                                <span className="text-gray-700 print:text-sm">
                                    {workOrder.approximateDuration ? `${workOrder.approximateDuration} heure(s)` : 'Non spécifiée'}
                                </span>
                            </div>
                            
                            <div className="flex border-b border-gray-200 pb-2">
                                <span className="font-semibold text-gray-800 w-40 print:text-sm">Créé le :</span>
                                <span className="text-gray-700 print:text-sm">{formatDate(workOrder.createdAt)}</span>
                            </div>
                            
                            <div className="flex border-b border-gray-200 pb-2">
                                <span className="font-semibold text-gray-800 w-40 print:text-sm">Modifié le :</span>
                                <span className="text-gray-700 print:text-sm">{formatDate(workOrder.updatedAt)}</span>
                            </div>
                            
                            <div className="flex border-b border-gray-200 pb-2">
                                <span className="font-semibold text-gray-800 w-40 print:text-sm">Créé par :</span>
                                <span className="text-gray-700 print:text-sm">{workOrder.createdById}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Étapes à suivre */}
                <div className="mb-6 print:mb-4 print:break-inside-avoid">
                    <h2 className="text-lg font-bold text-gray-800 mb-3 border-b border-gray-300 pb-1">PROCÉDURE D'INTERVENTION</h2>
                    <div className="bg-gray-50 p-4 rounded border print:bg-white print:border-gray-300">
                        <div className="text-gray-700 whitespace-pre-wrap print:text-sm leading-relaxed">
                            {workOrder.stepsToFollow || 'Aucune procédure spécifiée - Suivre les protocoles standards de maintenance'}
                        </div>
                    </div>
                </div>

                {/* Section de suivi et traçabilité */}
                <div className="mb-6 print:mb-4 print:break-inside-avoid">
                    <h2 className="text-lg font-bold text-gray-800 mb-3 border-b border-gray-300 pb-1">SUIVI ET TRAÇABILITÉ</h2>
                    <div className="grid grid-cols-2 gap-4 print:gap-2">
                        <div className="flex border-b border-gray-200 pb-2">
                            <span className="font-semibold text-gray-800 w-32 print:text-sm">Créé par :</span>
                            <span className="text-gray-700 print:text-sm">{workOrder.createdById}</span>
                        </div>
                        <div className="flex border-b border-gray-200 pb-2">
                            <span className="font-semibold text-gray-800 w-32 print:text-sm">Dernière MAJ :</span>
                            <span className="text-gray-700 print:text-sm">{formatDate(workOrder.updatedAt)}</span>
                        </div>
                    </div>
                </div>

                {/* Validation et signatures */}
                <div className="mb-6 print:mb-4 print:break-inside-avoid">
                    <h2 className="text-lg font-bold text-gray-800 mb-4 border-b border-gray-300 pb-1">VALIDATION ET SIGNATURES</h2>
                    <div className="grid grid-cols-2 gap-6 print:gap-4">
                        <div className="border-2 border-gray-300 p-4 rounded print:border print:rounded-none">
                            <h3 className="font-bold text-gray-800 mb-3 text-center print:text-sm">TECHNICIEN INTERVENANT</h3>
                            <div className="space-y-3">
                                <div>
                                    <label className="text-sm font-semibold text-gray-700">Nom et prénom :</label>
                                    <div className="border-b border-gray-400 h-6 mt-1"></div>
                                </div>
                                <div>
                                    <label className="text-sm font-semibold text-gray-700">Date d'intervention :</label>
                                    <div className="border-b border-gray-400 h-6 mt-1"></div>
                                </div>
                                <div>
                                    <label className="text-sm font-semibold text-gray-700">Signature :</label>
                                    <div className="border border-gray-400 h-16 mt-1 bg-gray-50 print:bg-white"></div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="border-2 border-gray-300 p-4 rounded print:border print:rounded-none">
                            <h3 className="font-bold text-gray-800 mb-3 text-center print:text-sm">SUPERVISEUR / RESPONSABLE</h3>
                            <div className="space-y-3">
                                <div>
                                    <label className="text-sm font-semibold text-gray-700">Nom et prénom :</label>
                                    <div className="border-b border-gray-400 h-6 mt-1"></div>
                                </div>
                                <div>
                                    <label className="text-sm font-semibold text-gray-700">Date de validation :</label>
                                    <div className="border-b border-gray-400 h-6 mt-1"></div>
                                </div>
                                <div>
                                    <label className="text-sm font-semibold text-gray-700">Signature :</label>
                                    <div className="border border-gray-400 h-16 mt-1 bg-gray-50 print:bg-white"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Pied de page professionnel */}
                <div className="text-center text-sm text-gray-500 border-t-2 border-gray-300 pt-4 mt-8 print:mt-4 print:pt-2 print:text-xs">
                    <div className="flex justify-between items-center">
                        <span>Machine Care - Système de gestion de maintenance</span>
                        <span>Document généré le {formatDate(new Date())}</span>
                    </div>
                    <p className="mt-2 text-xs text-gray-400">Ce document est confidentiel et propriété de l'entreprise</p>
                </div>
            </div>
        );
    }
);

WorkOrderPrint.displayName = 'WorkOrderPrint';

export default WorkOrderPrint;