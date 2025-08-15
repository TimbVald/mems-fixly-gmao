"use server";
import { db } from "@/server/db";
import { stocks, historiqueStock } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";
import { getCurrentUser } from "@/lib/auth-helpers";

export interface Stock {
  id: string;
  name: string;
  quantity: number;
  supplier?: string;
  price?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateStockData {
  name: string;
  quantity: number;
  supplier?: string;
  price?: number;
}

export interface UpdateStockData {
  name?: string;
  quantity?: number;
  supplier?: string;
  price?: number;
}

export const addStock = async (data: CreateStockData) => {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return {
        success: false,
        message: "Utilisateur non connecté"
      }
    }

    // Utiliser une transaction pour s'assurer que les deux opérations réussissent
    const result = await db.transaction(async (tx) => {
      // 1. Créer le stock
      const stock = await tx.insert(stocks).values({
        id: createId(),
        name: data.name,
        quantity: data.quantity,
        supplier: data.supplier,
        price: data.price,
        createdAt: new Date(),
        updatedAt: new Date(),
      }).returning();

      // 2. Ajouter une entrée dans l'historique
      await tx.insert(historiqueStock).values({
        id: createId(),
        nom: data.name,
        quantite: data.quantity,
        fournisseur: data.supplier,
        prix: data.price,
        statut: 'ajouter',
        stockId: stock[0].id,
        createdById: currentUser.id,
        createdAt: new Date(),
      });

      return stock[0];
    });
    
    return {
      success: true,
      message: "Stock ajouté avec succès",
      data: result
    }
  } catch (error) {
    console.error(error)
    const e = error as Error
    return {
      success: false,
      message: e.message || "Erreur lors de l'ajout du stock"
    }
  }
}

export const getStocks = async () => {
  try {
    const stocksList = await db.select().from(stocks).orderBy(stocks.name);
    return {
      success: true,
      message: "Stocks récupérés avec succès",
      data: stocksList
    }
  } catch (error) {
    console.error(error)
    const e = error as Error
    return {
      success: false,
      message: e.message || "Erreur lors de la récupération des stocks"
    }
  }
}

export const getStockById = async (id: string) => {
  try {
    const stock = await db.select().from(stocks).where(eq(stocks.id, id)).limit(1);
    return {
      success: true,
      message: "Stock récupéré avec succès",
      data: stock[0] || null
    }
  } catch (error) {
    console.error(error)
    const e = error as Error
    return {
      success: false,
      message: e.message || "Erreur lors de la récupération du stock"
    }
  }
}

export const updateStock = async (id: string, data: UpdateStockData) => {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return {
        success: false,
        message: "Utilisateur non connecté"
      }
    }

    // Récupérer l'ancien stock pour comparer les quantités
    const oldStock = await db.select().from(stocks).where(eq(stocks.id, id)).limit(1);
    if (oldStock.length === 0) {
      return {
        success: false,
        message: "Stock non trouvé"
      }
    }

    // Utiliser une transaction pour s'assurer que les deux opérations réussissent
    const result = await db.transaction(async (tx) => {
      // 1. Mettre à jour le stock
      const stock = await tx.update(stocks)
        .set({
          ...data,
          updatedAt: new Date(),
        })
        .where(eq(stocks.id, id))
        .returning();

      // 2. Ajouter une entrée dans l'historique si la quantité a changé
      if (data.quantity !== undefined && data.quantity !== oldStock[0].quantity) {
        const quantityDiff = data.quantity - oldStock[0].quantity;
        const statut = quantityDiff > 0 ? 'ajouter' : 'retirer';
        
        await tx.insert(historiqueStock).values({
          id: createId(),
          nom: stock[0].name,
          quantite: Math.abs(quantityDiff),
          fournisseur: stock[0].supplier,
          prix: stock[0].price,
          statut: statut,
          stockId: stock[0].id,
          createdById: currentUser.id,
          createdAt: new Date(),
        });
      }

      return stock[0];
    });
      
    return {
      success: true,
      message: "Stock modifié avec succès",
      data: result
    }
  } catch (error) {
    console.error(error)
    const e = error as Error
    return {
      success: false,
      message: e.message || "Erreur lors de la modification du stock"
    }
  }
}

export const deleteStock = async (id: string) => {
  try {
    await db.delete(stocks).where(eq(stocks.id, id));
    return {
      success: true,
      message: "Stock supprimé avec succès"
    }
  } catch (error) {
    console.error(error)
    const e = error as Error
    return {
      success: false,
      message: e.message || "Erreur lors de la suppression du stock"
    }
  }
}

export const getStockByName = async (name: string) => {
  try {
    const stock = await db.select().from(stocks).where(eq(stocks.name, name)).limit(1);
    return {
      success: true,
      message: "Stock récupéré avec succès",
      data: stock[0] || null
    }
  } catch (error) {
    console.error(error)
    const e = error as Error
    return {
      success: false,
      message: e.message || "Erreur lors de la récupération du stock"
    }
  }
}