import React from 'react';

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

interface InterventionReportPrintProps {
    report: InterventionReport;
}

const InterventionReportPrint = React.forwardRef<HTMLDivElement, InterventionReportPrintProps>(
    ({ report }, ref) => {
        const formatDate = (dateString: string) => {
            return new Date(dateString).toLocaleDateString('fr-FR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        };

        return (
        <div className="max-w-4xl mx-auto p-6 bg-white text-black print:p-4 print:max-w-none print:mx-0">
            <style jsx>{`
                @media print {
                    body { margin: 0; }
                    .print\:text-xs { font-size: 0.75rem; }
                    .print\:text-sm { font-size: 0.875rem; }
                    .print\:p-4 { padding: 1rem; }
                    .print\:mb-4 { margin-bottom: 1rem; }
                    .print\:gap-4 { gap: 1rem; }
                    .print\:space-y-2 > * + * { margin-top: 0.5rem; }
                    .print\:break-inside-avoid { break-inside: avoid; }
                    .print\:max-w-none { max-width: none; }
                    .print\:mx-0 { margin-left: 0; margin-right: 0; }
                    .print\:bg-white { background-color: white; }
                    .print\:border-gray-300 { border-color: #d1d5db; }
                    .print\:bg-gray-50 { background-color: #f9fafb; }
                    .print\:rounded-none { border-radius: 0; }
                    .print\:border { border-width: 1px; }
                    .print\:pt-2 { padding-top: 0.5rem; }
                    .print\:mt-4 { margin-top: 1rem; }
                }
            `}</style>
            
            {/* En-tête avec logo et informations entreprise */}
            <div className="text-center mb-6 pb-4 border-b-2 border-gray-800 print:mb-4">
                <div className="flex items-center justify-center mb-4">
                    <img src="/images/logo/logo.jpg" alt="Machine Care" className="h-12 w-auto mr-4" />
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 print:text-2xl">COMPTE RENDU D'INTERVENTION</h1>
                        <p className="text-sm text-gray-600">Machine Care - Système de gestion de maintenance</p>
                    </div>
                </div>
                <div className="bg-gray-100 p-3 rounded print:bg-gray-50">
                    <p className="text-xl font-bold text-gray-800 print:text-lg">Rapport N° {report.reportNumber}</p>
                </div>
            </div>

                {/* Informations principales dans un tableau structuré */}
                <div className="mb-6 print:mb-4 print:break-inside-avoid">
                    <h2 className="text-lg font-bold text-gray-800 mb-3 border-b border-gray-300 pb-1">INFORMATIONS GÉNÉRALES</h2>
                    <div className="grid grid-cols-2 gap-6 print:gap-4">
                        <div className="space-y-3 print:space-y-2">
                            <div className="flex border-b border-gray-200 pb-2">
                                <span className="font-semibold text-gray-800 w-40 print:text-sm">Rapport N° :</span>
                                <span className="text-gray-700 print:text-sm font-semibold">{report.reportNumber}</span>
                            </div>
                            
                            <div className="flex border-b border-gray-200 pb-2">
                                <span className="font-semibold text-gray-800 w-40 print:text-sm">Ordre de travail :</span>
                                <span className="text-blue-600 print:text-sm font-semibold">{report.workOrderNumber || 'Non spécifié'}</span>
                            </div>
                            
                            <div className="flex border-b border-gray-200 pb-2">
                                <span className="font-semibold text-gray-800 w-40 print:text-sm">Type de panne :</span>
                                <span className="text-red-600 print:text-sm font-semibold">{report.failureType}</span>
                            </div>
                            
                            <div className="flex border-b border-gray-200 pb-2">
                                <span className="font-semibold text-gray-800 w-40 print:text-sm">Type d'intervention :</span>
                                <span className="text-green-600 print:text-sm font-semibold">{report.interventionType}</span>
                            </div>
                            
                            <div className="flex border-b border-gray-200 pb-2">
                                <span className="font-semibold text-gray-800 w-40 print:text-sm">Intervenants :</span>
                                <span className="text-gray-700 print:text-sm">{report.numberOfIntervenants} personne(s)</span>
                            </div>
                            
                            <div className="flex border-b border-gray-200 pb-2">
                                <span className="font-semibold text-gray-800 w-40 print:text-sm">Temps réparation :</span>
                                <span className="text-gray-700 print:text-sm font-semibold">{report.repairTime} heure(s)</span>
                            </div>
                        </div>

                        <div className="space-y-3 print:space-y-2">
                            <div className="flex border-b border-gray-200 pb-2">
                                <span className="font-semibold text-gray-800 w-40 print:text-sm">Équipement :</span>
                                <span className="text-gray-700 print:text-sm">{report.equipment?.name || 'Non spécifié'}</span>
                            </div>
                            
                            <div className="flex border-b border-gray-200 pb-2">
                                <span className="font-semibold text-gray-800 w-40 print:text-sm">Matériel utilisé :</span>
                                <span className="text-gray-700 print:text-sm">{report.materialUsed || 'Aucun matériel spécifié'}</span>
                            </div>
                            
                            <div className="flex border-b border-gray-200 pb-2">
                                <span className="font-semibold text-gray-800 w-40 print:text-sm">Créé par :</span>
                                <span className="text-gray-700 print:text-sm">{report.createdBy?.name || 'Non spécifié'}</span>
                            </div>
                            
                            <div className="flex border-b border-gray-200 pb-2">
                                <span className="font-semibold text-gray-800 w-40 print:text-sm">Créé le :</span>
                                <span className="text-gray-700 print:text-sm">{formatDate(report.createdAt)}</span>
                            </div>
                            
                            <div className="flex border-b border-gray-200 pb-2">
                                <span className="font-semibold text-gray-800 w-40 print:text-sm">Modifié le :</span>
                                <span className="text-gray-700 print:text-sm">{formatDate(report.updatedAt)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Description de la panne */}
                <div className="mb-6 print:mb-4 print:break-inside-avoid">
                    <h2 className="text-lg font-bold text-gray-800 mb-3 border-b border-gray-300 pb-1">DESCRIPTION DE LA PANNE</h2>
                    <div className="bg-gray-50 p-4 rounded border print:bg-white print:border-gray-300">
                        <p className="text-gray-700 whitespace-pre-wrap print:text-sm leading-relaxed">
                            {report.failureDescription || 'Aucune description fournie'}
                        </p>
                    </div>
                </div>

                {/* Symptômes observés */}
                <div className="mb-6 print:mb-4 print:break-inside-avoid">
                    <h2 className="text-lg font-bold text-gray-800 mb-3 border-b border-gray-300 pb-1">SYMPTÔMES OBSERVÉS</h2>
                    <div className="bg-gray-50 p-4 rounded border print:bg-white print:border-gray-300">
                        <p className="text-gray-700 whitespace-pre-wrap print:text-sm leading-relaxed">
                            {report.symptoms || 'Aucun symptôme spécifié'}
                        </p>
                    </div>
                </div>

                {/* Causes identifiées */}
                <div className="mb-6 print:mb-4 print:break-inside-avoid">
                    <h2 className="text-lg font-bold text-gray-800 mb-3 border-b border-gray-300 pb-1">CAUSES IDENTIFIÉES</h2>
                    <div className="bg-gray-50 p-4 rounded border print:bg-white print:border-gray-300">
                        <p className="text-gray-700 whitespace-pre-wrap print:text-sm leading-relaxed">
                            {report.causes || 'Aucune cause identifiée'}
                        </p>
                    </div>
                </div>

                {/* Effets sur l'équipement */}
                <div className="mb-6 print:mb-4 print:break-inside-avoid">
                    <h2 className="text-lg font-bold text-gray-800 mb-3 border-b border-gray-300 pb-1">EFFETS SUR L'ÉQUIPEMENT</h2>
                    <div className="bg-gray-50 p-4 rounded border print:bg-white print:border-gray-300">
                        <p className="text-gray-700 whitespace-pre-wrap print:text-sm leading-relaxed">
                            {report.effectsOnEquipment || 'Aucun effet spécifié'}
                        </p>
                    </div>
                </div>

                {/* Étapes de réparation suivies */}
                <div className="mb-6 print:mb-4 print:break-inside-avoid">
                    <h2 className="text-lg font-bold text-gray-800 mb-3 border-b border-gray-300 pb-1">ÉTAPES DE RÉPARATION</h2>
                    <div className="bg-gray-50 p-4 rounded border print:bg-white print:border-gray-300">
                        <p className="text-gray-700 whitespace-pre-wrap print:text-sm leading-relaxed">
                            {report.stepsFollowed || 'Aucune étape spécifiée'}
                        </p>
                    </div>
                </div>

                {/* Section de suivi et traçabilité */}
                <div className="mb-6 print:mb-4 print:break-inside-avoid">
                    <h2 className="text-lg font-bold text-gray-800 mb-3 border-b border-gray-300 pb-1">SUIVI ET TRAÇABILITÉ</h2>
                    <div className="grid grid-cols-2 gap-4 print:gap-2">
                        <div className="flex border-b border-gray-200 pb-2">
                            <span className="font-semibold text-gray-800 w-32 print:text-sm">Créé par :</span>
                            <span className="text-gray-700 print:text-sm">{report.createdBy?.name || 'Non spécifié'}</span>
                        </div>
                        <div className="flex border-b border-gray-200 pb-2">
                            <span className="font-semibold text-gray-800 w-32 print:text-sm">Dernière MAJ :</span>
                            <span className="text-gray-700 print:text-sm">{formatDate(report.updatedAt)}</span>
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
                        <span>Document généré le {formatDate(new Date().toISOString())}</span>
                    </div>
                    <p className="mt-2 text-xs text-gray-400">Ce document est confidentiel et propriété de l'entreprise</p>
                </div>
            </div>
        );
    }
);

InterventionReportPrint.displayName = 'InterventionReportPrint';

export default InterventionReportPrint;