import React from 'react';

interface FicheChantier {
    id: string;
    nom: string;
    localisation: string;
    nomEngin: string;
    date: string;
    heureDebut: string;
    heureFin: string;
    avancement: string;
    kilometrageDebut: number | null;
    kilometrageFin: number | null;
    carburant: number | null;
    createdAt: string;
    updatedAt: string;
}

interface FicheChantierPrintProps {
    ficheChantier: FicheChantier;
}

const FicheChantierPrint = React.forwardRef<HTMLDivElement, FicheChantierPrintProps>(
    ({ ficheChantier }, ref) => {
        const formatDate = (dateString: string | undefined) => {
            if (!dateString) return 'Non spécifié';
            return new Date(dateString).toLocaleDateString('fr-FR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        };

        const formatDateTime = (dateString: string | undefined) => {
            if (!dateString) return 'Non spécifié';
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
                    <img src="/images/logo/logo.jpg" alt="Machine Care" className="h-8 w-auto mr-4 print:h-6" />
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 print:text-2xl">FICHE DE CHANTIER</h1>
                        <p className="text-sm text-gray-600">Machine Care - Système de gestion de maintenance</p>
                    </div>
                </div>
                <div className="bg-gray-100 p-3 rounded print:bg-gray-50">
                    <p className="text-xl font-bold text-gray-800 print:text-lg">{ficheChantier.localisation}</p>
                    <p className="text-sm text-gray-600 mt-1">Chantier - {ficheChantier.nom}</p>
                </div>
            </div>

                {/* Informations principales dans un tableau structuré */}
                <div className="mb-6 print:mb-4 print:break-inside-avoid">
                    <h2 className="text-lg font-bold text-gray-800 mb-3 border-b border-gray-300 pb-1">INFORMATIONS GÉNÉRALES</h2>
                    <div className="grid grid-cols-2 gap-6 print:gap-4">
                        <div className="space-y-3 print:space-y-2">
                            <div className="flex border-b border-gray-200 pb-2">
                                <span className="font-semibold text-gray-800 w-40 print:text-sm">Nom du chantier :</span>
                                <span className="text-gray-700 print:text-sm font-semibold">{ficheChantier.nom}</span>
                            </div>
                            
                            <div className="flex border-b border-gray-200 pb-2">
                                <span className="font-semibold text-gray-800 w-40 print:text-sm">Localisation :</span>
                                <span className="text-gray-700 print:text-sm">{ficheChantier.localisation}</span>
                            </div>
                            
                            <div className="flex border-b border-gray-200 pb-2">
                                <span className="font-semibold text-gray-800 w-40 print:text-sm">Nom de l'engin :</span>
                                <span className="text-blue-600 print:text-sm font-semibold">{ficheChantier.nomEngin}</span>
                            </div>
                            
                            <div className="flex border-b border-gray-200 pb-2">
                                <span className="font-semibold text-gray-800 w-40 print:text-sm">Date :</span>
                                <span className="text-gray-700 print:text-sm font-semibold">{formatDate(ficheChantier.date)}</span>
                            </div>
                            
                            <div className="flex border-b border-gray-200 pb-2">
                                <span className="font-semibold text-gray-800 w-40 print:text-sm">Heure début :</span>
                                <span className="text-green-600 print:text-sm font-semibold">{ficheChantier.heureDebut}</span>
                            </div>
                            
                            <div className="flex border-b border-gray-200 pb-2">
                                <span className="font-semibold text-gray-800 w-40 print:text-sm">Heure fin :</span>
                                <span className="text-red-600 print:text-sm font-semibold">{ficheChantier.heureFin}</span>
                            </div>
                        </div>

                        <div className="space-y-3 print:space-y-2">
                            <div className="flex border-b border-gray-200 pb-2">
                                <span className="font-semibold text-gray-800 w-40 print:text-sm">Avancement :</span>
                                <span className="text-blue-600 print:text-sm font-bold">{ficheChantier.avancement}</span>
                            </div>
                            
                            <div className="flex border-b border-gray-200 pb-2">
                                <span className="font-semibold text-gray-800 w-40 print:text-sm">Km début :</span>
                                <span className="text-gray-700 print:text-sm">{ficheChantier.kilometrageDebut ? `${ficheChantier.kilometrageDebut} km` : 'Non spécifié'}</span>
                            </div>
                            
                            <div className="flex border-b border-gray-200 pb-2">
                                <span className="font-semibold text-gray-800 w-40 print:text-sm">Km fin :</span>
                                <span className="text-gray-700 print:text-sm">{ficheChantier.kilometrageFin ? `${ficheChantier.kilometrageFin} km` : 'Non spécifié'}</span>
                            </div>
                            
                            <div className="flex border-b border-gray-200 pb-2">
                                <span className="font-semibold text-gray-800 w-40 print:text-sm">Carburant :</span>
                                <span className="text-orange-600 print:text-sm font-semibold">{ficheChantier.carburant ? `${ficheChantier.carburant} L` : 'Non spécifié'}</span>
                            </div>
                            
                            <div className="flex border-b border-gray-200 pb-2">
                                <span className="font-semibold text-gray-800 w-40 print:text-sm">Créé le :</span>
                                <span className="text-gray-700 print:text-sm">{formatDateTime(ficheChantier.createdAt)}</span>
                            </div>
                            
                            <div className="flex border-b border-gray-200 pb-2">
                                <span className="font-semibold text-gray-800 w-40 print:text-sm">Modifié le :</span>
                                <span className="text-gray-700 print:text-sm">{formatDateTime(ficheChantier.updatedAt)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Informations de suivi et calculs */}
                <div className="mb-6 print:mb-4 print:break-inside-avoid">
                    <h2 className="text-lg font-bold text-gray-800 mb-3 border-b border-gray-300 pb-1">SUIVI ET CALCULS</h2>
                    <div className="grid grid-cols-3 gap-6 print:gap-4">
                        <div className="bg-blue-50 p-4 rounded-lg print:bg-gray-50">
                            <h3 className="font-semibold text-blue-800 mb-2 print:text-sm">Avancement</h3>
                            <p className="text-2xl font-bold text-blue-600 print:text-lg">{ficheChantier.avancement}%</p>
                        </div>
                        
                        <div className="bg-green-50 p-4 rounded-lg print:bg-gray-50">
                            <h3 className="font-semibold text-green-800 mb-2 print:text-sm">Kilométrage parcouru</h3>
                            <p className="text-xl font-bold text-green-600 print:text-lg">
                                {ficheChantier.kilometrageDebut && ficheChantier.kilometrageFin 
                                    ? `${ficheChantier.kilometrageFin - ficheChantier.kilometrageDebut} km`
                                    : 'Non calculable'
                                }
                            </p>
                        </div>
                        
                        <div className="bg-orange-50 p-4 rounded-lg print:bg-gray-50">
                            <h3 className="font-semibold text-orange-800 mb-2 print:text-sm">Durée des travaux</h3>
                            <p className="text-xl font-bold text-orange-600 print:text-lg">
                                {ficheChantier.heureFin && ficheChantier.heureDebut 
                                    ? (() => {
                                        const debut = new Date(`1970-01-01T${ficheChantier.heureDebut}:00`);
                                        const fin = new Date(`1970-01-01T${ficheChantier.heureFin}:00`);
                                        const dureeMs = fin.getTime() - debut.getTime();
                                        const heures = Math.floor(dureeMs / (1000 * 60 * 60));
                                        const minutes = Math.floor((dureeMs % (1000 * 60 * 60)) / (1000 * 60));
                                        return `${heures}h ${minutes}min`;
                                    })()
                                    : `De ${ficheChantier.heureDebut} à ${ficheChantier.heureFin}`
                                }
                            </p>
                        </div>
                    </div>
                </div>

                {/* Section de suivi et traçabilité */}
                <div className="mb-6 print:mb-4 print:break-inside-avoid">
                    <h2 className="text-lg font-bold text-gray-800 mb-3 border-b border-gray-300 pb-1">SUIVI ET TRAÇABILITÉ</h2>
                    <div className="grid grid-cols-2 gap-6 print:gap-4">
                        <div className="flex border-b border-gray-200 pb-2">
                            <span className="font-semibold text-gray-800 w-32 print:text-sm">Créé le :</span>
                            <span className="text-gray-700 print:text-sm">{formatDateTime(ficheChantier.createdAt)}</span>
                        </div>
                        <div className="flex border-b border-gray-200 pb-2">
                            <span className="font-semibold text-gray-800 w-32 print:text-sm">Modifié le :</span>
                            <span className="text-gray-700 print:text-sm">{formatDateTime(ficheChantier.updatedAt)}</span>
                        </div>
                    </div>
                </div>

                {/* Section de validation et signatures */}
                <div className="mb-6 print:mb-4 print:break-inside-avoid">
                    <h2 className="text-lg font-bold text-gray-800 mb-4 border-b border-gray-300 pb-1">VALIDATION ET SIGNATURES</h2>
                    <div className="grid grid-cols-3 gap-6 print:gap-4">
                        <div className="border border-gray-300 p-4 rounded-lg print:border-black">
                            <h3 className="font-semibold text-gray-800 mb-3 print:text-sm">TECHNICIEN</h3>
                            <div className="space-y-2">
                                <div className="flex">
                                    <span className="font-medium text-gray-700 w-16 print:text-xs">Nom :</span>
                                    <span className="border-b border-gray-400 flex-1 print:text-xs">_________________</span>
                                </div>
                                <div className="flex">
                                    <span className="font-medium text-gray-700 w-16 print:text-xs">Date :</span>
                                    <span className="border-b border-gray-400 flex-1 print:text-xs">_________________</span>
                                </div>
                                <div className="mt-4">
                                    <p className="text-xs text-gray-600 mb-2">Signature :</p>
                                    <div className="h-16 border border-gray-300 print:h-12"></div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="border border-gray-300 p-4 rounded-lg print:border-black">
                            <h3 className="font-semibold text-gray-800 mb-3 print:text-sm">SUPERVISEUR</h3>
                            <div className="space-y-2">
                                <div className="flex">
                                    <span className="font-medium text-gray-700 w-16 print:text-xs">Nom :</span>
                                    <span className="border-b border-gray-400 flex-1 print:text-xs">_________________</span>
                                </div>
                                <div className="flex">
                                    <span className="font-medium text-gray-700 w-16 print:text-xs">Date :</span>
                                    <span className="border-b border-gray-400 flex-1 print:text-xs">_________________</span>
                                </div>
                                <div className="mt-4">
                                    <p className="text-xs text-gray-600 mb-2">Signature :</p>
                                    <div className="h-16 border border-gray-300 print:h-12"></div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="border border-gray-300 p-4 rounded-lg print:border-black">
                            <h3 className="font-semibold text-gray-800 mb-3 print:text-sm">CLIENT</h3>
                            <div className="space-y-2">
                                <div className="flex">
                                    <span className="font-medium text-gray-700 w-16 print:text-xs">Nom :</span>
                                    <span className="border-b border-gray-400 flex-1 print:text-xs">_________________</span>
                                </div>
                                <div className="flex">
                                    <span className="font-medium text-gray-700 w-16 print:text-xs">Date :</span>
                                    <span className="border-b border-gray-400 flex-1 print:text-xs">_________________</span>
                                </div>
                                <div className="mt-4">
                                    <p className="text-xs text-gray-600 mb-2">Signature :</p>
                                    <div className="h-16 border border-gray-300 print:h-12"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Pied de page professionnel */}
                <div className="mt-8 pt-4 border-t-2 border-gray-400 print:mt-4 print:pt-2">
                    <div className="flex justify-between items-center text-sm text-gray-600 print:text-xs">
                        <div>
                            <p className="font-semibold">Document généré le {new Date().toLocaleDateString('fr-FR')} à {new Date().toLocaleTimeString('fr-FR')}</p>
                            <p>Système GMAO Builder - Gestion de Maintenance Assistée par Ordinateur</p>
                        </div>
                        <div className="text-right">
                            <p className="font-semibold">Fiche de Chantier #{ficheChantier.id}</p>
                            <p className="text-xs text-gray-500">Document confidentiel</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
);

FicheChantierPrint.displayName = 'FicheChantierPrint';

export default FicheChantierPrint;