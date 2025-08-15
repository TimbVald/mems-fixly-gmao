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
                    return 'text-green-600';
                case 'maintenance corrective':
                case 'corrective':
                    return 'text-red-600';
                case 'inspection':
                    return 'text-blue-600';
                default:
                    return 'text-gray-600';
            }
        };

        return (
            <div ref={ref} className="p-8 bg-white text-black">
                {/* En-tête */}
                <div className="text-center mb-8 border-b-2 border-gray-300 pb-4">
                    <h1 className="text-2xl font-bold mb-2">ORDRE DE TRAVAIL</h1>
                    <p className="text-lg font-semibold text-gray-700">{workOrder.workOrderNumber}</p>
                </div>

                {/* Informations principales */}
                <div className="grid grid-cols-2 gap-8 mb-8">
                    <div className="space-y-4">
                        <div>
                            <h3 className="font-semibold text-gray-800 mb-1">Numéro d'ordre</h3>
                            <p className="text-gray-600">{workOrder.workOrderNumber}</p>
                        </div>
                        
                        <div>
                            <h3 className="font-semibold text-gray-800 mb-1">Numéro de demande</h3>
                            <p className="text-gray-600">{workOrder.workRequestNumber}</p>
                        </div>
                        
                        <div>
                            <h3 className="font-semibold text-gray-800 mb-1">Type d'intervention</h3>
                            <p className={`font-semibold ${getInterventionTypeColor(workOrder.interventionType)}`}>
                                {workOrder.interventionType}
                            </p>
                        </div>
                        
                        <div>
                            <h3 className="font-semibold text-gray-800 mb-1">Nombre d'intervenants</h3>
                            <p className="text-gray-600">{workOrder.numberOfIntervenants}</p>
                        </div>
                        
                        <div>
                            <h3 className="font-semibold text-gray-800 mb-1">Date et heure d'intervention</h3>
                            <p className="text-gray-600">{formatDate(workOrder.interventionDateTime)}</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <h3 className="font-semibold text-gray-800 mb-1">Durée approximative</h3>
                            <p className="text-gray-600">
                                {workOrder.approximateDuration ? `${workOrder.approximateDuration} heures` : 'Non spécifiée'}
                            </p>
                        </div>
                        
                        <div>
                            <h3 className="font-semibold text-gray-800 mb-1">Créé le</h3>
                            <p className="text-gray-600">{formatDate(workOrder.createdAt)}</p>
                        </div>
                        
                        <div>
                            <h3 className="font-semibold text-gray-800 mb-1">Modifié le</h3>
                            <p className="text-gray-600">{formatDate(workOrder.updatedAt)}</p>
                        </div>
                        
                        <div>
                            <h3 className="font-semibold text-gray-800 mb-1">Créé par</h3>
                            <p className="text-gray-600">{workOrder.createdById}</p>
                        </div>
                    </div>
                </div>

                {/* Étapes à suivre */}
                <div className="mb-8">
                    <h3 className="font-semibold text-gray-800 mb-2">Étapes à suivre</h3>
                    <div className="border border-gray-300 p-4 rounded">
                        <p className="text-gray-600 whitespace-pre-wrap">
                            {workOrder.stepsToFollow || 'Aucune étape spécifiée'}
                        </p>
                    </div>
                </div>

                {/* Section signatures */}
                <div className="grid grid-cols-2 gap-8 mb-8">
                    <div className="border border-gray-300 p-4 rounded">
                        <h3 className="font-semibold text-gray-800 mb-4">Signature du technicien</h3>
                        <div className="h-16 border-b border-gray-300 mb-2"></div>
                        <p className="text-sm text-gray-500">Date et signature</p>
                    </div>
                    
                    <div className="border border-gray-300 p-4 rounded">
                        <h3 className="font-semibold text-gray-800 mb-4">Signature du superviseur</h3>
                        <div className="h-16 border-b border-gray-300 mb-2"></div>
                        <p className="text-sm text-gray-500">Date et signature</p>
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

WorkOrderPrint.displayName = 'WorkOrderPrint';

export default WorkOrderPrint;