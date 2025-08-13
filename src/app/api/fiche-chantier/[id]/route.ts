import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { ficheChantier } from "@/db/schema";
import { eq } from "drizzle-orm";

// GET - Récupérer une fiche chantier par ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const [fiche] = await db
      .select()
      .from(ficheChantier)
      .where(eq(ficheChantier.id, params.id))
      .limit(1);

    if (!fiche) {
      return NextResponse.json(
        { error: "Fiche chantier non trouvée" },
        { status: 404 }
      );
    }

    return NextResponse.json(fiche);
  } catch (error) {
    console.error("Error fetching fiche chantier:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération de la fiche" },
      { status: 500 }
    );
  }
}

// PUT - Mettre à jour une fiche chantier
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Vérifier si la fiche existe
    const [existingFiche] = await db
      .select()
      .from(ficheChantier)
      .where(eq(ficheChantier.id, params.id))
      .limit(1);

    if (!existingFiche) {
      return NextResponse.json(
        { error: "Fiche chantier non trouvée" },
        { status: 404 }
      );
    }

    // Validation des champs obligatoires
    if (!nom || !localisation || !nomEngin || !date || !heureDebut || !heureFin || !avancement) {
      return NextResponse.json(
        { error: "Tous les champs obligatoires doivent être remplis" },
        { status: 400 }
      );
    }

    const updateData = {
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
      updatedAt: new Date(),
    };

    const [updatedFiche] = await db
      .update(ficheChantier)
      .set(updateData)
      .where(eq(ficheChantier.id, params.id))
      .returning();

    return NextResponse.json(updatedFiche);
  } catch (error) {
    console.error("Error updating fiche chantier:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour de la fiche" },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer une fiche chantier
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Vérifier si la fiche existe
    const [existingFiche] = await db
      .select()
      .from(ficheChantier)
      .where(eq(ficheChantier.id, params.id))
      .limit(1);

    if (!existingFiche) {
      return NextResponse.json(
        { error: "Fiche chantier non trouvée" },
        { status: 404 }
      );
    }

    await db
      .delete(ficheChantier)
      .where(eq(ficheChantier.id, params.id));

    return NextResponse.json(
      { message: "Fiche chantier supprimée avec succès" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting fiche chantier:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression de la fiche" },
      { status: 500 }
    );
  }
}