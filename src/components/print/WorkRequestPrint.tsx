import React from 'react';
import { Badge } from '@/components/ui/badge';

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

interface WorkRequestPrintProps {
    workRequest: WorkRequest;
}

const WorkRequestPrint = React.forwardRef<HTMLDivElement, WorkRequestPrintProps>(
    ({ workRequest }, ref) => {
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
                    }
                `}</style>
                
                {/* En-tête avec logo et informations entreprise */}
                <div className="text-center mb-6 pb-4 border-b-2 border-gray-800 print:mb-4">
                    <div className="flex items-center justify-center mb-4">
                        <img src="/images/logo/logo.jpg" alt="Machine Care" className="h-12 w-auto mr-4" />
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800 print:text-2xl">DEMANDE D'INTERVENTION</h1>
                            <p className="text-sm text-gray-600">Machine Care - Système de gestion de maintenance</p>
                        </div>
                    </div>
                    <div className="bg-gray-100 p-3 rounded print:bg-gray-50">
                        <p className="text-xl font-bold text-gray-800 print:text-lg">N° {workRequest.requestNumber}</p>
                    </div>
                </div>

                {/* Informations principales dans un tableau structuré */}
                <div className="mb-6 print:mb-4 print:break-inside-avoid">
                    <h2 className="text-lg font-bold text-gray-800 mb-3 border-b border-gray-300 pb-1">INFORMATIONS GÉNÉRALES</h2>
                    <div className="grid grid-cols-2 gap-6 print:gap-4">
                        <div className="space-y-3 print:space-y-2">
                            <div className="flex border-b border-gray-200 pb-2">
                                <span className="font-semibold text-gray-800 w-32 print:text-sm">Numéro :</span>
                                <span className="text-gray-700 print:text-sm">{workRequest.requestNumber}</span>
                            </div>
                            

                            
                            <div className="flex border-b border-gray-200 pb-2">
                                <span className="font-semibold text-gray-800 w-32 print:text-sm">Demandé par :</span>
                                <span className="text-gray-700 print:text-sm">{workRequest.requesterFirstName} {workRequest.requesterLastName}</span>
                            </div>
                            
                            <div className="flex border-b border-gray-200 pb-2">
                                <span className="font-semibold text-gray-800 w-32 print:text-sm">Type de panne :</span>
                                <span className="text-gray-700 print:text-sm">{workRequest.failureType}</span>
                            </div>
                        </div>

                        <div className="space-y-3 print:space-y-2">
                            <div className="flex border-b border-gray-200 pb-2">
                                <span className="font-semibold text-gray-800 w-32 print:text-sm">Équipement :</span>
                                <span className="text-gray-700 print:text-sm">{workRequest.equipmentName}</span>
                            </div>
                            
                            <div className="flex border-b border-gray-200 pb-2">
                                <span className="font-semibold text-gray-800 w-32 print:text-sm">ID Équipement :</span>
                                <span className="text-gray-700 print:text-sm">{workRequest.equipmentId || 'Non spécifié'}</span>
                            </div>
                            
                            <div className="flex border-b border-gray-200 pb-2">
                                <span className="font-semibold text-gray-800 w-32 print:text-sm">Ordre de travail :</span>
                                <span className={`print:text-sm ${workRequest.workOrderAssigned ? 'text-green-600 font-semibold' : 'text-red-600'}`}>
                                    {workRequest.workOrderAssigned ? 'Assigné' : 'Non assigné'}
                                </span>
                            </div>
                            
                            <div className="flex border-b border-gray-200 pb-2">
                                <span className="font-semibold text-gray-800 w-32 print:text-sm">Rapport :</span>
                                <span className={`print:text-sm ${workRequest.reportCompleted ? 'text-green-600 font-semibold' : 'text-orange-600'}`}>
                                    {workRequest.reportCompleted ? 'Complété' : 'En attente'}
                                </span>
                            </div>
                            
                            <div className="flex border-b border-gray-200 pb-2">
                                <span className="font-semibold text-gray-800 w-32 print:text-sm">Créé le :</span>
                                <span className="text-gray-700 print:text-sm">{formatDate(workRequest.createdAt)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Description de la panne avec style amélioré */}
                <div className="mb-6 print:mb-4 print:break-inside-avoid">
                    <h2 className="text-lg font-bold text-gray-800 mb-3 border-b border-gray-300 pb-1">DESCRIPTION DE LA PANNE</h2>
                    <div className="bg-gray-50 border-l-4 border-blue-500 p-4 rounded-r print:bg-white print:border-gray-400">
                        <p className="text-gray-700 whitespace-pre-wrap leading-relaxed print:text-sm">
                            {workRequest.failureDescription || 'Aucune description spécifiée'}
                        </p>
                    </div>
                </div>

                {/* Section informations de suivi */}
                <div className="mb-6 print:mb-4 print:break-inside-avoid">
                    <h2 className="text-lg font-bold text-gray-800 mb-3 border-b border-gray-300 pb-1">SUIVI ET TRAÇABILITÉ</h2>
                    <div className="bg-gray-50 p-4 rounded print:bg-white">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm font-semibold text-gray-700 mb-1">Créé par :</p>
                                <p className="text-gray-600 print:text-sm">{workRequest.createdById}</p>
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-700 mb-1">Dernière modification :</p>
                                <p className="text-gray-600 print:text-sm">{formatDate(workRequest.updatedAt)}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section signatures et validation */}
                <div className="mb-6 print:mb-4 print:break-inside-avoid">
                    <h2 className="text-lg font-bold text-gray-800 mb-3 border-b border-gray-300 pb-1">VALIDATION ET SIGNATURES</h2>
                    <div className="grid grid-cols-3 gap-6 print:gap-4">
                        <div className="text-center">
                            <div className="border-2 border-dashed border-gray-300 h-20 mb-2 flex items-center justify-center">
                                <span className="text-gray-400 text-sm">Signature Demandeur</span>
                            </div>
                            <p className="text-sm font-semibold text-gray-700">Demandeur</p>
                            <p className="text-xs text-gray-500">Date: ___________</p>
                        </div>
                        <div className="text-center">
                            <div className="border-2 border-dashed border-gray-300 h-20 mb-2 flex items-center justify-center">
                                <span className="text-gray-400 text-sm">Signature Technicien</span>
                            </div>
                            <p className="text-sm font-semibold text-gray-700">Technicien</p>
                            <p className="text-xs text-gray-500">Date: ___________</p>
                        </div>
                        <div className="text-center">
                            <div className="border-2 border-dashed border-gray-300 h-20 mb-2 flex items-center justify-center">
                                <span className="text-gray-400 text-sm">Signature Superviseur</span>
                            </div>
                            <p className="text-sm font-semibold text-gray-700">Superviseur</p>
                            <p className="text-xs text-gray-500">Date: ___________</p>
                        </div>
                    </div>
                </div>

                {/* Pied de page professionnel */}
                <div className="border-t-2 border-gray-800 pt-4 mt-8 print:mt-6">
                    <div className="flex justify-between items-center text-sm text-gray-600 print:text-xs">
                        <div>
                            <p className="font-semibold">Document généré le {new Date().toLocaleDateString('fr-FR')}</p>
                            <p>ID Document: {workRequest.id}</p>
                        </div>
                        <div className="text-right">
                            <p className="font-semibold">Machine Care GMAO</p>
                            <p>Système de gestion de maintenance</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
);

WorkRequestPrint.displayName = 'WorkRequestPrint';

export default WorkRequestPrint;