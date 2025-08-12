"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit, Eye, Plus } from "lucide-react";
import { toast } from "sonner";
import { deleteWorkRequest, type Intervention } from "@/server/interventions";

interface InterventionTableProps {
  interventions: Intervention[];
  onInterventionUpdated?: () => void;
  onInterventionDeleted?: () => void;
}

export default function InterventionTable({
  interventions,
  onInterventionUpdated,
  onInterventionDeleted,
}: InterventionTableProps) {
  const [isPending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette intervention ?")) {
      return;
    }

    setDeletingId(id);
    startTransition(async () => {
      const { success, message } = await deleteWorkRequest(id);
      if (success) {
        toast.success(message);
        onInterventionDeleted?.();
      } else {
        toast.error(message);
      }
      setDeletingId(null);
    });
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (intervention: Intervention) => {
    // Logique simple pour déterminer le statut
    const daysSinceCreation = Math.floor(
      (new Date().getTime() - new Date(intervention.createdAt).getTime()) / (1000 * 60 * 60 * 24)
    );
    
    if (daysSinceCreation === 0) {
      return <Badge variant="default">Nouvelle</Badge>;
    } else if (daysSinceCreation <= 7) {
      return <Badge variant="secondary">En cours</Badge>;
    } else {
      return <Badge variant="outline">Terminée</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Liste des Interventions</CardTitle>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle Intervention
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {interventions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Aucune intervention trouvée
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2 font-medium">N°</th>
                  <th className="text-left p-2 font-medium">Équipement</th>
                  <th className="text-left p-2 font-medium">Type de Panne</th>
                  <th className="text-left p-2 font-medium">Matériel</th>
                  <th className="text-left p-2 font-medium">Date</th>
                  <th className="text-left p-2 font-medium">Statut</th>
                  <th className="text-left p-2 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {interventions.map((intervention) => (
                  <tr key={intervention.id} className="border-b hover:bg-muted/50">
                    <td className="p-2 font-mono text-sm">
                      #{intervention.number.toString().padStart(4, "0")}
                    </td>
                    <td className="p-2">
                      <div>
                        <div className="font-medium">
                          {intervention.equipment?.name || "Équipement inconnu"}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          ID: {intervention.equipmentId}
                        </div>
                      </div>
                    </td>
                    <td className="p-2">
                      {intervention.failureType || (
                        <span className="text-muted-foreground italic">Non spécifié</span>
                      )}
                    </td>
                    <td className="p-2">
                      {intervention.material || (
                        <span className="text-muted-foreground italic">Non spécifié</span>
                      )}
                    </td>
                    <td className="p-2 text-sm">
                      {formatDate(intervention.date)}
                    </td>
                    <td className="p-2">
                      {getStatusBadge(intervention)}
                    </td>
                    <td className="p-2">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          title="Voir les détails"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          title="Modifier"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          title="Supprimer"
                          onClick={() => handleDelete(intervention.id)}
                          disabled={isPending && deletingId === intervention.id}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}