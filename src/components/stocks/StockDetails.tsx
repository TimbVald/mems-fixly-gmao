"use client"
import { useEffect, useState } from "react"
import { getStockById } from "@/server/stocks"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import ComponentCard from "../common/ComponentCard"
import { Loader2, Edit, ArrowLeft, Package } from "lucide-react"
import Badge from "../ui/badge/Badge"

interface Stock {
    id: string;
    name: string;
    quantity: number;
    supplier: string | null;
    price: number | null;
    createdAt: string;
    updatedAt: string;
}

interface StockDetailsProps {
    stockId: string;
}

export default function StockDetails({ stockId }: StockDetailsProps) {
    const [stock, setStock] = useState<Stock | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        const loadStock = async () => {
            const { success, message, data } = await getStockById(stockId)
            if (success && data) {
                setStock({
                    ...data,
                    createdAt: data.createdAt.toString(),
                    updatedAt: data.updatedAt.toString()
                })
            } else {
                toast.error(message)
                router.push("/stocks")
            }
            setIsLoading(false)
        }
        loadStock()
    }, [stockId, router])

    if (isLoading) {
        return (
            <ComponentCard title="Détails de l'article">
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="w-8 h-8 animate-spin" />
                </div>
            </ComponentCard>
        )
    }

    if (!stock) {
        return (
            <ComponentCard title="Article non trouvé">
                <div className="flex items-center justify-center h-64">
                    <p className="text-gray-500">Article non trouvé</p>
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

    const formatPrice = (price: number | null) => {
        if (!price) return "-";
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR'
        }).format(price);
    };

    const getStockStatus = (quantity: number) => {
        if (quantity === 0) {
            return { label: "Rupture", color: "error" as const };
        } else if (quantity <= 10) {
            return { label: "Stock faible", color: "warning" as const };
        } else {
            return { label: "En stock", color: "success" as const };
        }
    };

    const status = getStockStatus(stock.quantity);
    const totalValue = (stock.price || 0) * stock.quantity;

    return (
        <ComponentCard title={`Détails de l'article: ${stock.name}`}>
            <div className="space-y-6">
                {/* Actions */}
                <div className="flex justify-between items-center">
                    <button
                        onClick={() => router.push("/stocks")}
                        className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <ArrowLeft size={16} />
                        Retour à la liste
                    </button>
                    <button
                        onClick={() => router.push(`/stocks/${stock.id}/edit`)}
                        className="flex items-center gap-2 px-4 py-2 text-white bg-brand-500 hover:bg-brand-600 rounded-lg transition-colors"
                    >
                        <Edit size={16} />
                        Modifier
                    </button>
                </div>

                {/* Informations principales */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Nom de l'article
                            </label>
                            <p className="text-gray-900 dark:text-white font-semibold">{stock.name}</p>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Quantité en stock
                            </label>
                            <div className="flex items-center gap-2">
                                <span className={`font-medium text-lg ${
                                    stock.quantity === 0 ? 'text-red-600' : 
                                    stock.quantity <= 10 ? 'text-orange-600' : 
                                    'text-green-600'
                                }`}>
                                    {stock.quantity}
                                </span>
                                <Package size={16} className="text-gray-400" />
                            </div>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Statut du stock
                            </label>
                            <Badge size="sm" color={status.color}>
                                {status.label}
                            </Badge>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Fournisseur
                            </label>
                            <p className="text-gray-600 dark:text-gray-400">{stock.supplier || "Non spécifié"}</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Prix unitaire
                            </label>
                            <p className="text-gray-900 dark:text-white font-semibold text-lg">
                                {formatPrice(stock.price)}
                            </p>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Valeur totale du stock
                            </label>
                            <p className="text-gray-900 dark:text-white font-semibold text-lg">
                                {formatPrice(totalValue)}
                            </p>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Créé le
                            </label>
                            <p className="text-gray-600 dark:text-gray-400">{formatDate(stock.createdAt)}</p>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Modifié le
                            </label>
                            <p className="text-gray-600 dark:text-gray-400">{formatDate(stock.updatedAt)}</p>
                        </div>
                    </div>
                </div>

                {/* Statistiques */}
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                        Statistiques de l'article
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-brand-500">
                                {stock.quantity}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                Unités en stock
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-green-500">
                                {formatPrice(stock.price)}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                Prix unitaire
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-blue-500">
                                {formatPrice(totalValue)}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                Valeur totale
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ComponentCard>
    )
}