import React from 'react';
import Badge from '../ui/badge/Badge';

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
        const formatDate = (date: Date) => {
            return new Date(date).toLocaleDateString('fr-FR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        };

        return (
            <div ref={ref} className="p-8 bg-white text-black">
                {/* En-tête */}
                <div className="text-center mb-8 border-b-2 border-gray-300 pb-4">
                    <h1 className="text-2xl font-bold mb-2">DEMANDE D'INTERVENTION</h1>
                    <p className="text-lg font-semibold text-gray-700">{workRequest.requestNumber}</p>
                </div>

                {/* Informations principales */}
                <div className="grid grid-cols-2 gap-8 mb-8">
                    <div className="space-y-4">
                        <div>
                            <h3 className="font-semibold text-gray-800 mb-1">Numéro de demande</h3>
                            <p className="text-gray-600">{workRequest.requestNumber}</p>
                        </div>
                        
                        <div>
                            <h3 className="font-semibold text-gray-800 mb-1">Demandé par</h3>
                            <p className="text-gray-600">{workRequest.requesterFirstName} {workRequest.requesterLastName}</p>
                        </div>
                        
                        <div>
                            <h3 className="font-semibold text-gray-800 mb-1">Type de panne</h3>
                            <p className="text-gray-600">{workRequest.failureType}</p>
                        </div>
                        
                        <div>
                            <h3 className="font-semibold text-gray-800 mb-1">Ordre de travail assigné</h3>
                            <p className="text-gray-600">{workRequest.workOrderAssigned ? 'Oui' : 'Non'}</p>
                        </div>
                        
                        <div>
                            <h3 className="font-semibold text-gray-800 mb-1">Rapport complété</h3>
                            <p className="text-gray-600">{workRequest.reportCompleted ? 'Oui' : 'Non'}</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <h3 className="font-semibold text-gray-800 mb-1">Nom de l'équipement</h3>
                            <p className="text-gray-600">{workRequest.equipmentName}</p>
                        </div>
                        
                        <div>
                            <h3 className="font-semibold text-gray-800 mb-1">ID Équipement</h3>
                            <p className="text-gray-600">{workRequest.equipmentId || 'Non spécifié'}</p>
                        </div>
                        
                        <div>
                            <h3 className="font-semibold text-gray-800 mb-1">Créé par</h3>
                            <p className="text-gray-600">{workRequest.createdById || 'Non spécifié'}</p>
                        </div>
                        
                        <div>
                            <h3 className="font-semibold text-gray-800 mb-1">Créé le</h3>
                            <p className="text-gray-600">{formatDate(workRequest.createdAt)}</p>
                        </div>
                        
                        <div>
                            <h3 className="font-semibold text-gray-800 mb-1">Modifié le</h3>
                            <p className="text-gray-600">{formatDate(workRequest.updatedAt)}</p>
                        </div>
                    </div>
                </div>

                {/* Description de la panne */}
                <div className="mb-8">
                    <h3 className="font-semibold text-gray-800 mb-2">Description de la panne</h3>
                    <div className="border border-gray-300 p-4 rounded">
                        <p className="text-gray-600 whitespace-pre-wrap">
                            {workRequest.failureDescription || 'Aucune description spécifiée'}
                        </p>
                    </div>
                </div>

                {/* Pied de page */}
                <div className="border-t-2 border-gray-300 pt-4 mt-8">
                    <div className="flex justify-between text-sm text-gray-500">
                        <p>Document généré le {new Date().toLocaleDateString('fr-FR')}</p>
                        <p>GMAO Builder - Système de gestion de maintenance</p>
                    </div>
                </div>
            </div>
        );
    }
);

WorkRequestPrint.displayName = 'WorkRequestPrint';

export default WorkRequestPrint;