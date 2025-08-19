import React from 'react';

interface HistoriqueStock {
    id: string;
    nom: string;
    quantite: number;
    fournisseur: string | null;
    prix: number | null;
    statut: 'ajouter' | 'retirer';
    createdAt: Date;
    stockId: string | null;
    createdById: string | null;
    createdByName: string | null;
}

interface HistoriqueStockPrintProps {
    historiqueStock: HistoriqueStock[];
}

const HistoriqueStockPrint: React.FC<HistoriqueStockPrintProps> = ({ historiqueStock }) => {
    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('fr-FR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };

    const formatPrice = (price: number | null) => {
        if (price === null) return '-';
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR'
        }).format(price);
    };

    const currentDate = new Date().toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div className="print-container bg-white text-black p-8 max-w-full">
            {/* En-tête du document */}
            <div className="print-header mb-8 border-b-2 border-gray-300 pb-6">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">
                            HISTORIQUE DES MODIFICATIONS DE STOCK
                        </h1>
                        <p className="text-lg text-gray-600">
                            Rapport généré le {currentDate}
                        </p>
                    </div>
                    <div className="text-right">
                        <div className="text-sm text-gray-500">
                            GMAO Builder
                        </div>
                        <div className="text-sm text-gray-500">
                            Système de Gestion de Maintenance
                        </div>
                    </div>
                </div>
            </div>

            {/* Statistiques générales */}
            <div className="print-stats mb-8 grid grid-cols-3 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg border">
                    <h3 className="text-sm font-semibold text-gray-600 mb-1">TOTAL MODIFICATIONS</h3>
                    <p className="text-2xl font-bold text-gray-800">{historiqueStock.length}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <h3 className="text-sm font-semibold text-green-600 mb-1">AJOUTS</h3>
                    <p className="text-2xl font-bold text-green-700">
                        {historiqueStock.filter(item => item.statut === 'ajouter').length}
                    </p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                    <h3 className="text-sm font-semibold text-red-600 mb-1">RETRAITS</h3>
                    <p className="text-2xl font-bold text-red-700">
                        {historiqueStock.filter(item => item.statut === 'retirer').length}
                    </p>
                </div>
            </div>

            {/* Tableau des données */}
            <div className="print-table">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Détail des modifications</h2>
                
                {historiqueStock.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        Aucun historique de stock trouvé
                    </div>
                ) : (
                    <table className="w-full border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">
                                    Nom du produit
                                </th>
                                <th className="border border-gray-300 px-4 py-3 text-center font-semibold text-gray-700">
                                    Quantité
                                </th>
                                <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">
                                    Fournisseur
                                </th>
                                <th className="border border-gray-300 px-4 py-3 text-right font-semibold text-gray-700">
                                    Prix
                                </th>
                                <th className="border border-gray-300 px-4 py-3 text-center font-semibold text-gray-700">
                                    Statut
                                </th>
                                <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">
                                    Utilisateur
                                </th>
                                <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">
                                    Date de modification
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {historiqueStock.map((item, index) => (
                                <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                    <td className="border border-gray-300 px-4 py-3 font-medium text-gray-800">
                                        {item.nom}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-3 text-center text-gray-700">
                                        {item.quantite}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-3 text-gray-700">
                                        {item.fournisseur || '-'}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-3 text-right text-gray-700">
                                        {formatPrice(item.prix)}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-3 text-center">
                                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                                            item.statut === 'ajouter' 
                                                ? 'bg-green-100 text-green-800 border border-green-200' 
                                                : 'bg-red-100 text-red-800 border border-red-200'
                                        }`}>
                                            {item.statut === 'ajouter' ? 'Ajouté' : 'Retiré'}
                                        </span>
                                    </td>
                                    <td className="border border-gray-300 px-4 py-3 text-gray-700">
                                        {item.createdByName || 'Utilisateur inconnu'}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-3 text-gray-700">
                                        {formatDate(item.createdAt)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Pied de page */}
            <div className="print-footer mt-8 pt-6 border-t border-gray-300">
                <div className="flex justify-between items-center text-sm text-gray-500">
                    <div>
                        <p>Document généré automatiquement par GMAO Builder</p>
                        <p>Date d'impression : {new Date().toLocaleString('fr-FR')}</p>
                    </div>
                    <div className="text-right">
                        <p>Page 1 sur 1</p>
                        <p>Total : {historiqueStock.length} modification(s)</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HistoriqueStockPrint;