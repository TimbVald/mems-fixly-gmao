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
            <div ref={ref} className="p-8 bg-white text-black">
                {/* En-tête */}
                <div className="text-center mb-8 border-b-2 border-gray-300 pb-4">
                    <h1 className="text-2xl font-bold mb-2">COMPTE RENDU D'INTERVENTION</h1>
                    <p className="text-lg font-semibold text-gray-700">{report.reportNumber}</p>
                </div>

                {/* Informations principales */}
                <div className="grid grid-cols-2 gap-8 mb-8">
                    <div className="space-y-4">
                        <div>
                            <h3 className="font-semibold text-gray-800 mb-1">Numéro de rapport</h3>
                            <p className="text-gray-600">{report.reportNumber}</p>
                        </div>
                        
                        <div>
                            <h3 className="font-semibold text-gray-800 mb-1">Numéro d'ordre de travail</h3>
                            <p className="text-gray-600">{report.workOrderNumber || 'Non spécifié'}</p>
                        </div>
                        
                        <div>
                            <h3 className="font-semibold text-gray-800 mb-1">Type de panne</h3>
                            <p className="text-gray-600">{report.failureType}</p>
                        </div>
                        
                        <div>
                            <h3 className="font-semibold text-gray-800 mb-1">Type d'intervention</h3>
                            <p className="text-gray-600">{report.interventionType}</p>
                        </div>
                        
                        <div>
                            <h3 className="font-semibold text-gray-800 mb-1">Nombre d'intervenants</h3>
                            <p className="text-gray-600">{report.numberOfIntervenants}</p>
                        </div>
                        
                        <div>
                            <h3 className="font-semibold text-gray-800 mb-1">Temps de réparation</h3>
                            <p className="text-gray-600">{report.repairTime} heures</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <h3 className="font-semibold text-gray-800 mb-1">Équipement</h3>
                            <p className="text-gray-600">{report.equipment?.name || 'Non spécifié'}</p>
                        </div>
                        
                        <div>
                            <h3 className="font-semibold text-gray-800 mb-1">Matériel utilisé</h3>
                            <p className="text-gray-600">{report.materialUsed || 'Aucun matériel spécifié'}</p>
                        </div>
                        
                        <div>
                            <h3 className="font-semibold text-gray-800 mb-1">Créé par</h3>
                            <p className="text-gray-600">{report.createdBy?.name || 'Non spécifié'}</p>
                        </div>
                        
                        <div>
                            <h3 className="font-semibold text-gray-800 mb-1">Créé le</h3>
                            <p className="text-gray-600">{formatDate(report.createdAt)}</p>
                        </div>
                        
                        <div>
                            <h3 className="font-semibold text-gray-800 mb-1">Modifié le</h3>
                            <p className="text-gray-600">{formatDate(report.updatedAt)}</p>
                        </div>
                    </div>
                </div>

                {/* Description de la panne */}
                <div className="mb-8">
                    <h3 className="font-semibold text-gray-800 mb-2">Description de la panne</h3>
                    <div className="border border-gray-300 p-4 rounded">
                        <p className="text-gray-600 whitespace-pre-wrap">
                            {report.failureDescription || 'Aucune description spécifiée'}
                        </p>
                    </div>
                </div>

                {/* Symptômes */}
                <div className="mb-8">
                    <h3 className="font-semibold text-gray-800 mb-2">Symptômes observés</h3>
                    <div className="border border-gray-300 p-4 rounded">
                        <p className="text-gray-600 whitespace-pre-wrap">
                            {report.symptoms || 'Aucun symptôme spécifié'}
                        </p>
                    </div>
                </div>

                {/* Causes */}
                <div className="mb-8">
                    <h3 className="font-semibold text-gray-800 mb-2">Causes identifiées</h3>
                    <div className="border border-gray-300 p-4 rounded">
                        <p className="text-gray-600 whitespace-pre-wrap">
                            {report.causes || 'Aucune cause spécifiée'}
                        </p>
                    </div>
                </div>

                {/* Effets sur l'équipement */}
                <div className="mb-8">
                    <h3 className="font-semibold text-gray-800 mb-2">Effets sur l'équipement</h3>
                    <div className="border border-gray-300 p-4 rounded">
                        <p className="text-gray-600 whitespace-pre-wrap">
                            {report.effectsOnEquipment || 'Aucun effet spécifié'}
                        </p>
                    </div>
                </div>

                {/* Étapes suivies */}
                <div className="mb-8">
                    <h3 className="font-semibold text-gray-800 mb-2">Étapes de réparation suivies</h3>
                    <div className="border border-gray-300 p-4 rounded">
                        <p className="text-gray-600 whitespace-pre-wrap">
                            {report.stepsFollowed || 'Aucune étape spécifiée'}
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

InterventionReportPrint.displayName = 'InterventionReportPrint';

export default InterventionReportPrint;