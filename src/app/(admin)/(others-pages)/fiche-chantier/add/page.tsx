"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function AddFicheChantierPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/fiche-chantier", {
        method: "POST",
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
        throw new Error("Erreur lors de la création de la fiche");
      }

      toast.success("Fiche chantier créée avec succès");
      router.push("/fiche-chantier");
    } catch (error) {
      console.error("Error creating fiche chantier:", error);
      toast.error("Erreur lors de la création de la fiche");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link href="/fiche-chantier">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Nouvelle Fiche Chantier</h1>
          <p className="text-muted-foreground">
            Créer une nouvelle fiche de chantier
          </p>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Informations de la fiche</CardTitle>
          <CardDescription>
            Remplissez les informations de la fiche chantier
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
              <Link href="/fiche-chantier">
                <Button type="button" variant="outline">
                  Annuler
                </Button>
              </Link>
              <Button type="submit" disabled={isLoading}>
                <Save className="mr-2 h-4 w-4" />
                {isLoading ? "Création..." : "Créer la fiche"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}