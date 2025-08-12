"use server";
import { db } from "@/server/db";
import { stocks } from "@/db/schema";
import { eq } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";

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
    const stock = await db.insert(stocks).values({
      id: createId(),
      name: data.name,
      quantity: data.quantity,
      supplier: data.supplier,
      price: data.price,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning();
    
    return {
      success: true,
      message: "Stock ajouté avec succès",
      data: stock[0]
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
    const stock = await db.update(stocks)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(stocks.id, id))
      .returning();
      
    return {
      success: true,
      message: "Stock modifié avec succès",
      data: stock[0]
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