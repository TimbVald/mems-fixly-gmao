"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, Trash2, Calendar, Clock, MapPin, Truck, Fuel, Route } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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

export default function FicheChantierDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [fiche, setFiche] = useState<FicheChantier | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchFiche = async () => {
      try {
        const response = await fetch(`/api/fiche-chantier/${params.id}`);
        if (!response.ok) {
          throw new Error("Fiche non trouvée");
        }
        const data = await response.json();
        setFiche(data);
      } catch (error) {
        console.error("Error fetching fiche:", error);
        toast.error("Erreur lors du chargement de la fiche");
        router.push("/fiche-chantier");
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchFiche();
    }
  }, [params.id, router]);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/fiche-chantier/${params.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la suppression");
      }

      toast.success("Fiche supprimée avec succès");
      router.push("/fiche-chantier");
    } catch (error) {
      console.error("Error deleting fiche:", error);
      toast.error("Erreur lors de la suppression");
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("fr-FR");
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

  const calculateDistance = (debut: number | null, fin: number | null) => {
    if (debut !== null && fin !== null) {
      return (fin - debut).toFixed(1);
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement de la fiche...</p>
        </div>
      </div>
    );
  }

  if (!fiche) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Fiche non trouvée</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/fiche-chantier">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{fiche.nom}</h1>
            <p className="text-muted-foreground">
              Fiche chantier - {formatDate(fiche.date)}
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Link href={`/fiche-chantier/${params.id}/edit`}>
            <Button variant="outline">
              <Edit className="mr-2 h-4 w-4" />
              Modifier
            </Button>
          </Link>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Supprimer
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                <AlertDialogDescription>
                  Êtes-vous sûr de vouloir supprimer cette fiche chantier ? Cette action est irréversible.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {isDeleting ? "Suppression..." : "Supprimer"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Informations principales */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="mr-2 h-5 w-5" />
                Informations générales
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Nom</p>
                  <p className="text-lg font-semibold">{fiche.nom}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Localisation</p>
                  <p className="text-lg">{fiche.localisation}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Engin utilisé</p>
                  <div className="flex items-center">
                    <Truck className="mr-2 h-4 w-4 text-muted-foreground" />
                    <p className="text-lg">{fiche.nomEngin}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Date</p>
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                    <p className="text-lg">{formatDate(fiche.date)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="mr-2 h-5 w-5" />
                Horaires et durée
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Heure de début</p>
                  <p className="text-lg font-semibold">{fiche.heureDebut}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Heure de fin</p>
                  <p className="text-lg font-semibold">{fiche.heureFin}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Durée totale</p>
                  <Badge variant="secondary" className="text-sm">
                    {calculateDuration(fiche.heureDebut, fiche.heureFin)}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Avancement des travaux</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{fiche.avancement}</p>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Métriques */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Route className="mr-2 h-5 w-5" />
                Kilométrage
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Début</p>
                <p className="text-2xl font-bold">
                  {fiche.kilometrageDebut ? `${fiche.kilometrageDebut} km` : "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Fin</p>
                <p className="text-2xl font-bold">
                  {fiche.kilometrageFin ? `${fiche.kilometrageFin} km` : "N/A"}
                </p>
              </div>
              {fiche.kilometrageDebut && fiche.kilometrageFin && (
                <div className="pt-2 border-t">
                  <p className="text-sm font-medium text-muted-foreground">Distance parcourue</p>
                  <Badge variant="outline" className="text-lg font-semibold">
                    {calculateDistance(fiche.kilometrageDebut, fiche.kilometrageFin)} km
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Fuel className="mr-2 h-5 w-5" />
                Carburant
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Consommation</p>
                <p className="text-3xl font-bold">
                  {fiche.carburant ? `${fiche.carburant} L` : "N/A"}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Métadonnées */}
          <Card>
            <CardHeader>
              <CardTitle>Informations système</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div>
                <p className="font-medium text-muted-foreground">Créé le</p>
                <p>{formatDateTime(fiche.createdAt)}</p>
              </div>
              <div>
                <p className="font-medium text-muted-foreground">Modifié le</p>
                <p>{formatDateTime(fiche.updatedAt)}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}