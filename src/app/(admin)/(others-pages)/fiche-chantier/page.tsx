"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import Link from "next/link";
import { FicheChantierTable } from "@/components/tables/FicheChantierTable";

export default function FicheChantierPage() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Fiches Chantier</h1>
          <p className="text-muted-foreground">
            Gérez les fiches de chantier et suivez l'avancement des travaux
          </p>
        </div>
        <Link href="/fiche-chantier/add">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Ajouter une fiche
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher une fiche..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {/* Table */}
      <FicheChantierTable searchTerm={searchTerm} />
    </div>
  );
}