'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Edit, Trash2 } from 'lucide-react'
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table'
import Badge from '@/components/ui/badge/Badge'
import ComponentCard from "../common/ComponentCard";
import Image from 'next/image'

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

interface FicheChantierTableProps {
  searchTerm: string;
}

export function FicheChantierTable({ searchTerm }: FicheChantierTableProps) {
  const [fiches, setFiches] = useState<FicheChantier[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter()

  useEffect(() => {
    const fetchFiches = async () => {
      try {
        const response = await fetch("/api/fiche-chantier");
        if (!response.ok) {
          throw new Error("Erreur lors du chargement des fiches");
        }
        const data = await response.json();
        setFiches(data);
      } catch (error) {
        console.error("Error fetching fiches:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFiches();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette fiche ?')) return
    
    setDeleteId(id)
    setIsDeleting(true)
    try {
      const response = await fetch(`/api/fiche-chantier/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la suppression");
      }

      setFiches(fiches.filter(fiche => fiche.id !== id));
    } catch (error) {
      console.error("Error deleting fiche:", error);
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/fiche-chantier/${id}`)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR");
  };

  const calculateDuration = (debut: string, fin: string) => {
    const [debutH, debutM] = debut.split(":").map(Number);
    const [finH, finM] = fin.split(":").map(Number);
    const debutMinutes = debutH * 60 + debutM;
    const finMinutes = finH * 60 + finM;
    const durationMinutes = finMinutes - debutMinutes;
    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;
    return `${hours}h${minutes.toString().padStart(2, "0")}`;
  };

  const filteredFiches = fiches.filter(fiche =>
    fiche.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    fiche.localisation.toLowerCase().includes(searchTerm.toLowerCase()) ||
    fiche.nomEngin.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    isLoading ? (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    ) : (
      filteredFiches.length > 0 ? (
        <ComponentCard title="Liste des fiches chantier" className="p-0">
          <div className="overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                {/* Table Header */}
                <TableHeader className="bg-gray-50 dark:bg-white/[0.02]">
                  <TableRow className="border-b border-gray-100 dark:border-white/[0.05]">
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                      Nom du chantier
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                      Localisation
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                      Date
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                      Durée
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                      Distance
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                      Carburant
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                      Avancement
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400"
                    >
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHeader>

                {/* Table Body */}
                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                  {filteredFiches.map((fiche) => (
                    <TableRow key={fiche.id}>
                      <TableCell className="px-5 py-4 sm:px-6 text-start">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 overflow-hidden rounded-full">
                            <Image
                              width={40}
                              height={40}
                              src="/images/chantier.png"
                              alt={fiche.nom}
                            />
                          </div>
                          <div>
                            <button
                              onClick={() => router.push(`/fiche-chantier/${fiche.id}`)}
                              className="block font-medium text-gray-800 text-theme-sm dark:text-white/90 hover:text-brand-500 transition-colors text-left"
                            >
                              {fiche.nom}
                            </button>
                            <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                              {fiche.nomEngin}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {fiche.localisation}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {formatDate(fiche.date)}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                        {calculateDuration(fiche.heureDebut, fiche.heureFin)}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                        {fiche.kilometrageFin && fiche.kilometrageDebut ? 
                          `${fiche.kilometrageFin - fiche.kilometrageDebut} km` : 'N/A'}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                        {fiche.carburant ? `${fiche.carburant} L` : 'N/A'}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                        <Badge
                          size="sm"
                          color={
                            parseInt(fiche.avancement) >= 100
                              ? "success"
                              : parseInt(fiche.avancement) >= 50
                                ? "warning"
                                : "error"
                          }
                        >
                          {fiche.avancement}%
                        </Badge>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleEdit(fiche.id)}
                            className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Modifier"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(fiche.id)}
                            disabled={deleteId === fiche.id && isDeleting}
                            className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                            title="Supprimer"
                          >
                            {deleteId === fiche.id && isDeleting ? (
                              <Loader2 size={16} className="animate-spin" />
                            ) : (
                              <Trash2 size={16} />
                            )}
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </ComponentCard>
      ) : (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500 text-theme-sm dark:text-gray-400">Aucune fiche chantier trouvée</p>
        </div>
      )
    )
  );
}