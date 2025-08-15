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
            <div ref={ref} className="p-8 bg-white text-black">
                {/* En-tête */}
                <div className="text-center mb-8 border-b-2 border-gray-300 pb-4">
                    <h1 className="text-2xl font-bold mb-2">FICHE DE CHANTIER</h1>
                    <p className="text-lg font-semibold text-gray-700">{ficheChantier.nom}</p>
                </div>

                {/* Informations principales */}
                <div className="grid grid-cols-2 gap-8 mb-8">
                    <div className="space-y-4">
                        <div>
                            <h3 className="font-semibold text-gray-800 mb-1">Nom du chantier</h3>
                            <p className="text-gray-600">{ficheChantier.nom}</p>
                        </div>
                        
                        <div>
                            <h3 className="font-semibold text-gray-800 mb-1">Localisation</h3>
                            <p className="text-gray-600">{ficheChantier.localisation}</p>
                        </div>
                        
                        <div>
                            <h3 className="font-semibold text-gray-800 mb-1">Nom de l'engin</h3>
                            <p className="text-gray-600">{ficheChantier.nomEngin}</p>
                        </div>
                        
                        <div>
                            <h3 className="font-semibold text-gray-800 mb-1">Date</h3>
                            <p className="text-gray-600">{formatDate(ficheChantier.date)}</p>
                        </div>
                        
                        <div>
                            <h3 className="font-semibold text-gray-800 mb-1">Heure de début</h3>
                            <p className="text-gray-600">{ficheChantier.heureDebut}</p>
                        </div>
                        
                        <div>
                            <h3 className="font-semibold text-gray-800 mb-1">Heure de fin</h3>
                            <p className="text-gray-600">{ficheChantier.heureFin}</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <h3 className="font-semibold text-gray-800 mb-1">Avancement</h3>
                            <p className="text-gray-600">{ficheChantier.avancement}</p>
                        </div>
                        
                        <div>
                            <h3 className="font-semibold text-gray-800 mb-1">Kilométrage début</h3>
                            <p className="text-gray-600">{ficheChantier.kilometrageDebut ? `${ficheChantier.kilometrageDebut} km` : 'Non spécifié'}</p>
                        </div>
                        
                        <div>
                            <h3 className="font-semibold text-gray-800 mb-1">Kilométrage fin</h3>
                            <p className="text-gray-600">{ficheChantier.kilometrageFin ? `${ficheChantier.kilometrageFin} km` : 'Non spécifié'}</p>
                        </div>
                        
                        <div>
                            <h3 className="font-semibold text-gray-800 mb-1">Carburant</h3>
                            <p className="text-gray-600">{ficheChantier.carburant ? `${ficheChantier.carburant} L` : 'Non spécifié'}</p>
                        </div>
                        
                        <div>
                            <h3 className="font-semibold text-gray-800 mb-1">Créé le</h3>
                            <p className="text-gray-600">{formatDateTime(ficheChantier.createdAt)}</p>
                        </div>
                        
                        <div>
                            <h3 className="font-semibold text-gray-800 mb-1">Modifié le</h3>
                            <p className="text-gray-600">{formatDateTime(ficheChantier.updatedAt)}</p>
                        </div>
                    </div>
                </div>

                {/* Informations de suivi */}
                <div className="mb-8">
                    <h3 className="font-semibold text-gray-800 mb-4">Informations de suivi</h3>
                    <div className="grid grid-cols-2 gap-6">
                        <div className="border border-gray-300 p-4 rounded">
                            <h4 className="font-semibold text-gray-700 mb-2">Avancement</h4>
                            <p className="text-gray-600">{ficheChantier.avancement}</p>
                        </div>
                        
                        <div className="border border-gray-300 p-4 rounded">
                            <h4 className="font-semibold text-gray-700 mb-2">Kilométrage parcouru</h4>
                            <p className="text-gray-600">
                                {ficheChantier.kilometrageDebut && ficheChantier.kilometrageFin 
                                    ? `${ficheChantier.kilometrageFin - ficheChantier.kilometrageDebut} km`
                                    : 'Non calculable'
                                }
                            </p>
                        </div>
                    </div>
                </div>

                {/* Calcul de la durée */}
                <div className="mb-8 p-4 bg-gray-50 rounded">
                    <h3 className="font-semibold text-gray-800 mb-2">Durée des travaux</h3>
                    <p className="text-gray-600">
                        De {ficheChantier.heureDebut} à {ficheChantier.heureFin}
                    </p>
                </div>

                {/* Section signatures */}
                <div className="grid grid-cols-3 gap-6 mb-8">
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
                    
                    <div className="border border-gray-300 p-4 rounded">
                        <h3 className="font-semibold text-gray-800 mb-4">Signature du client</h3>
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

FicheChantierPrint.displayName = 'FicheChantierPrint';

export default FicheChantierPrint;