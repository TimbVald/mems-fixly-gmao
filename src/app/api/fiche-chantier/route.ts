import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { ficheChantier } from "@/db/schema";
import { desc } from "drizzle-orm";
import { nanoid } from "nanoid";

// GET - Récupérer toutes les fiches chantier
export async function GET() {
  try {
    const fiches = await db
      .select()
      .from(ficheChantier)
      .orderBy(desc(ficheChantier.createdAt));

    return NextResponse.json(fiches);
  } catch (error) {
    console.error("Error fetching fiches chantier:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des fiches" },
      { status: 500 }
    );
  }
}

// POST - Créer une nouvelle fiche chantier
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      nom,
      localisation,
      nomEngin,
      date,
      heureDebut,
      heureFin,
      avancement,
      kilometrageDebut,
      kilometrageFin,
      carburant,
    } = body;

    // Validation des champs obligatoires
    if (!nom || !localisation || !nomEngin || !date || !heureDebut || !heureFin || !avancement) {
      return NextResponse.json(
        { error: "Tous les champs obligatoires doivent être remplis" },
        { status: 400 }
      );
    }

    const newFiche = {
      id: nanoid(),
      nom,
      localisation,
      nomEngin,
      date: new Date(date),
      heureDebut,
      heureFin,
      avancement,
      kilometrageDebut: kilometrageDebut || null,
      kilometrageFin: kilometrageFin || null,
      carburant: carburant || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const [createdFiche] = await db
      .insert(ficheChantier)
      .values(newFiche)
      .returning();

    return NextResponse.json(createdFiche, { status: 201 });
  } catch (error) {
    console.error("Error creating fiche chantier:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création de la fiche" },
      { status: 500 }
    );
  }
}