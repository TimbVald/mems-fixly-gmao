"use server";
import { db } from "@/server/db";
import { historiqueStock, stocks, users } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";
import { getCurrentUser } from "@/lib/auth-helpers";

export interface HistoriqueStock {
  id: string;
  nom: string;
  quantite: number;
  fournisseur?: string;
  prix?: number;
  statut: 'ajouter' | 'retirer';
  createdAt: Date;
  stockId?: string;
  createdById?: string;
  createdByName?: string;
}

export interface CreateHistoriqueStockData {
  nom: string;
  quantite: number;
  fournisseur?: string;
  prix?: number;
  statut: 'ajouter' | 'retirer';
  stockId?: string;
}

export const addHistoriqueStock = async (data: CreateHistoriqueStockData) => {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return {
        success: false,
        message: "Utilisateur non connecté"
      }
    }

    const historique = await db.insert(historiqueStock).values({
      id: createId(),
      nom: data.nom,
      quantite: data.quantite,
      fournisseur: data.fournisseur,
      prix: data.prix,
      statut: data.statut,
      stockId: data.stockId,
      createdById: currentUser.id,
      createdAt: new Date(),
    }).returning();
    
    return {
      success: true,
      message: "Historique de stock ajouté avec succès",
      data: historique[0]
    }
  } catch (error) {
    console.error(error)
    const e = error as Error
    return {
      success: false,
      message: e.message || "Erreur lors de l'ajout de l'historique de stock"
    }
  }
}

export const getHistoriqueStock = async () => {
  try {
    const historique = await db.select({
      id: historiqueStock.id,
      nom: historiqueStock.nom,
      quantite: historiqueStock.quantite,
      fournisseur: historiqueStock.fournisseur,
      prix: historiqueStock.prix,
      statut: historiqueStock.statut,
      createdAt: historiqueStock.createdAt,
      stockId: historiqueStock.stockId,
      createdById: historiqueStock.createdById,
      createdByName: users.name
    })
    .from(historiqueStock)
    .leftJoin(users, eq(historiqueStock.createdById, users.id))
    .orderBy(desc(historiqueStock.createdAt));
    
    return {
      success: true,
      data: historique
    }
  } catch (error) {
    console.error(error)
    const e = error as Error
    return {
      success: false,
      message: e.message || "Erreur lors de la récupération de l'historique de stock"
    }
  }
}

export const getHistoriqueStockById = async (id: string) => {
  try {
    const historique = await db.select().from(historiqueStock).where(eq(historiqueStock.id, id)).limit(1);
    
    if (historique.length === 0) {
      return {
        success: false,
        message: "Historique de stock non trouvé"
      }
    }
    
    return {
      success: true,
      data: historique[0]
    }
  } catch (error) {
    console.error(error)
    const e = error as Error
    return {
      success: false,
      message: e.message || "Erreur lors de la récupération de l'historique de stock"
    }
  }
}

export const getHistoriqueStockByStockId = async (stockId: string) => {
  try {
    const historique = await db.select().from(historiqueStock)
      .where(eq(historiqueStock.stockId, stockId))
      .orderBy(desc(historiqueStock.createdAt));
    
    return {
      success: true,
      data: historique
    }
  } catch (error) {
    console.error(error)
    const e = error as Error
    return {
      success: false,
      message: e.message || "Erreur lors de la récupération de l'historique de stock"
    }
  }
}

export const deleteHistoriqueStock = async (id: string) => {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return {
        success: false,
        message: "Utilisateur non connecté"
      }
    }

    await db.delete(historiqueStock).where(eq(historiqueStock.id, id));
    
    return {
      success: true,
      message: "Historique de stock supprimé avec succès"
    }
  } catch (error) {
    console.error(error)
    const e = error as Error
    return {
      success: false,
      message: e.message || "Erreur lors de la suppression de l'historique de stock"
    }
  }
}