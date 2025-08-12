"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CalendarIcon, ClockIcon, UserIcon, WrenchIcon } from "lucide-react";
import { getWorkRequestById } from "@/server/interventions";
import { toast } from "sonner";

interface InterventionDetailsProps {
  interventionId: string;
  onClose?: () => void;
}

interface Intervention {
  id: string;
  equipmentId: string;
  failureType?: string;
  material?: string;
  date?: Date;
  createdAt: Date;
  updatedAt: Date;
  equipment?: {
    id: string;
    name: string;
    type?: string;
    location?: string;
  };
}

export default function InterventionDetails({
  interventionId,
  onClose,
}: InterventionDetailsProps) {
  const [intervention, setIntervention] = useState<Intervention | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadIntervention = async () => {
      setLoading(true);
      setError(null);
      const { success, message, data } = await getWorkRequestById(interventionId);
      if (success && data) {
        setIntervention(data);
      } else {
        setError(message);
        toast.error(message);
      }
      setLoading(false);
    };

    if (interventionId) {
      loadIntervention();
    }
  }, [interventionId]);

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return "Non spécifiée";
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2">Chargement...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !intervention) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">
              {error || "Intervention non trouvée"}
            </p>
            {onClose && (
              <Button onClick={onClose} variant="outline">
                Retour
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Intervention #{intervention.id.slice(-8)}
          </h1>
          <p className="text-muted-foreground">
            Créée le {formatDate(intervention.createdAt)}
          </p>
        </div>
        {onClose && (
          <Button onClick={onClose} variant="outline">
            Retour
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Informations principales */}
        <div className="lg:col-span-2 space-y-6">
          {/* Équipement */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <WrenchIcon className="h-5 w-5" />
                Équipement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg">
                    {intervention.equipment?.name || "Équipement non spécifié"}
                  </h3>
                  {intervention.equipment?.type && (
                    <p className="text-muted-foreground">
                      Type: {intervention.equipment.type}
                    </p>
                  )}
                  {intervention.equipment?.location && (
                    <p className="text-muted-foreground">
                      Localisation: {intervention.equipment.location}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Détails de l'intervention */}
          <Card>
            <CardHeader>
              <CardTitle>Détails de l'Intervention</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {intervention.failureType && (
                  <div>
                    <h4 className="font-medium mb-2">Type de Panne</h4>
                    <p className="text-muted-foreground">
                      {intervention.failureType}
                    </p>
                  </div>
                )}

                {intervention.material && (
                  <div>
                    <h4 className="font-medium mb-2">Matériel Utilisé</h4>
                    <p className="text-muted-foreground whitespace-pre-wrap">
                      {intervention.material}
                    </p>
                  </div>
                )}

                {intervention.date && (
                  <div>
                    <h4 className="font-medium mb-2">Date d'Intervention</h4>
                    <p className="text-muted-foreground flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4" />
                      {formatDate(intervention.date)}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Informations système */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClockIcon className="h-5 w-5" />
                Informations Système
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-1">ID Intervention</h4>
                  <p className="text-sm text-muted-foreground font-mono">
                    {intervention.id}
                  </p>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-1">Créée le</h4>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(intervention.createdAt)}
                  </p>
                </div>

                <div>
                  <h4 className="font-medium mb-1">Dernière modification</h4>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(intervention.updatedAt)}
                  </p>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-2">Statut</h4>
                  <Badge variant="secondary">
                    En cours
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}