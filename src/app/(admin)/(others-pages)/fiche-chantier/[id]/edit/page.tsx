"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

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
}

export default function EditFicheChantierPage() {
  const router = useRouter();
  const params = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [formData, setFormData] = useState({
    nom: "",
    localisation: "",
    nomEngin: "",
    date: "",
    heureDebut: "",
    heureFin: "",
    avancement: "",
    kilometrageDebut: "",
    kilometrageFin: "",
    carburant: "",
  });

  useEffect(() => {
    const fetchFiche = async () => {
      try {
        const response = await fetch(`/api/fiche-chantier/${params.id}`);
        if (!response.ok) {
          throw new Error("Fiche non trouvée");
        }
        const fiche: FicheChantier = await response.json();
        
        // Formatage de la date pour l'input date
        const formattedDate = new Date(fiche.date).toISOString().split('T')[0];
        
        setFormData({
          nom: fiche.nom,
          localisation: fiche.localisation,
          nomEngin: fiche.nomEngin,
          date: formattedDate,
          heureDebut: fiche.heureDebut,
          heureFin: fiche.heureFin,
          avancement: fiche.avancement,
          kilometrageDebut: fiche.kilometrageDebut?.toString() || "",
          kilometrageFin: fiche.kilometrageFin?.toString() || "",
          carburant: fiche.carburant?.toString() || "",
        });
      } catch (error) {
        console.error("Error fetching fiche:", error);
        toast.error("Erreur lors du chargement de la fiche");
        router.push("/fiche-chantier");
      } finally {
        setIsFetching(false);
      }
    };

    if (params.id) {
      fetchFiche();
    }
  }, [params.id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`/api/fiche-chantier/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          kilometrageDebut: formData.kilometrageDebut ? parseFloat(formData.kilometrageDebut) : null,
          kilometrageFin: formData.kilometrageFin ? parseFloat(formData.kilometrageFin) : null,
          carburant: formData.carburant ? parseFloat(formData.carburant) : null,
          date: new Date(formData.date).toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la modification de la fiche");
      }

      toast.success("Fiche chantier modifiée avec succès");
      router.push(`/fiche-chantier/${params.id}`);
    } catch (error) {
      console.error("Error updating fiche chantier:", error);
      toast.error("Erreur lors de la modification de la fiche");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Chargement de la fiche...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link href={`/fiche-chantier/${params.id}`}>
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Modifier la Fiche Chantier</h1>
          <p className="text-muted-foreground">
            Modifier les informations de la fiche chantier
          </p>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Informations de la fiche</CardTitle>
          <CardDescription>
            Modifiez les informations de la fiche chantier
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="nom">Nom *</Label>
                <Input
                  id="nom"
                  name="nom"
                  value={formData.nom}
                  onChange={handleInputChange}
                  required
                  placeholder="Nom de la fiche"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="localisation">Localisation *</Label>
                <Input
                  id="localisation"
                  name="localisation"
                  value={formData.localisation}
                  onChange={handleInputChange}
                  required
                  placeholder="Localisation du chantier"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nomEngin">Nom de l'engin *</Label>
                <Input
                  id="nomEngin"
                  name="nomEngin"
                  value={formData.nomEngin}
                  onChange={handleInputChange}
                  required
                  placeholder="Nom de l'engin utilisé"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="heureDebut">Heure de début *</Label>
                <Input
                  id="heureDebut"
                  name="heureDebut"
                  type="time"
                  value={formData.heureDebut}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="heureFin">Heure de fin *</Label>
                <Input
                  id="heureFin"
                  name="heureFin"
                  type="time"
                  value={formData.heureFin}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="kilometrageDebut">Kilométrage début</Label>
                <Input
                  id="kilometrageDebut"
                  name="kilometrageDebut"
                  type="number"
                  step="0.1"
                  value={formData.kilometrageDebut}
                  onChange={handleInputChange}
                  placeholder="Kilométrage de début"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="kilometrageFin">Kilométrage fin</Label>
                <Input
                  id="kilometrageFin"
                  name="kilometrageFin"
                  type="number"
                  step="0.1"
                  value={formData.kilometrageFin}
                  onChange={handleInputChange}
                  placeholder="Kilométrage de fin"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="carburant">Carburant (L)</Label>
                <Input
                  id="carburant"
                  name="carburant"
                  type="number"
                  step="0.1"
                  value={formData.carburant}
                  onChange={handleInputChange}
                  placeholder="Quantité de carburant"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="avancement">Avancement *</Label>
              <Textarea
                id="avancement"
                name="avancement"
                value={formData.avancement}
                onChange={handleInputChange}
                required
                placeholder="Description de l'avancement des travaux"
                rows={4}
              />
            </div>

            <div className="flex justify-end space-x-4">
              <Link href={`/fiche-chantier/${params.id}`}>
                <Button type="button" variant="outline">
                  Annuler
                </Button>
              </Link>
              <Button type="submit" disabled={isLoading}>
                <Save className="mr-2 h-4 w-4" />
                {isLoading ? "Modification..." : "Modifier la fiche"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}