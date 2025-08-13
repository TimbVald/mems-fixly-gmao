"use server";
import { auth } from "@/lib/auth"
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { users } from "@/db/schema";
import type { Role } from "@/db/types";


export async function getCurrentUser() {
  const session = await auth.api.getSession({
    headers: await headers(), // ✅ pas besoin de await
  });

  if (!session) {
    redirect("/signin");
  }

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, session.user.id))
    .limit(1);

  if (!user) {
    redirect("/signin");
  }

  return {
    session,
    currentUser: user,
  };
}
 
export const signIn = async (email: string, password: string) => {
    try {
        await auth.api.signInEmail({
            body: {
                email,
                password
            },
            headers: await headers()
        })
        return {
            success: true,
            message: "Connexion réussie"
        }
    } catch (error) {
        console.error(error)
        const e = error as Error
        return {
            success: false,
            message: e.message || "Email ou mot de passe invalide"
        }
    }
}


export const signUp = async (name: string, email: string, password: string) => {
    try {
        await auth.api.signUpEmail({
            body: {
                email,
                password,
                name
            },
            headers: await headers()
        })
        return {
            success: true,
            message: "Inscription réussie"
        }
    } catch (error) {
        console.error(error)
        const e = error as Error
        return {
            success: false,
            message: e.message || "Email ou mot de passe invalide"
        }
    }
}

export const getAllUsers = async () => {
    try {
        const allUsers = await db.select({
            id: users.id,
            name: users.name,
            email: users.email,
            role: users.role,
            matricule: users.matricule,
            createdAt: users.createdAt,
            updatedAt: users.updatedAt
        }).from(users);
          
        return allUsers;
    } catch (error) {
        console.error(error)
        throw error
    }
}

export const updateUserRole = async (userId: string, newRole: Role) => {
    try {
        await db
            .update(users)
            .set({ role: newRole, updatedAt: new Date() })
            .where(eq(users.id, userId));
        
        return {
            success: true,
            message: "Rôle mis à jour avec succès"
        }
    } catch (error) {
        console.error(error)
        const e = error as Error
        return {
            success: false,
            message: e.message || "Erreur lors de la mise à jour du rôle"
        }
    }
}

export const getUserById = async (userId: string) => {
    try {
        const [user] = await db
            .select()
            .from(users)
            .where(eq(users.id, userId))
            .limit(1);
        
        return user;
    } catch (error) {
        console.error(error)
        throw error
    }
}

export const createUser = async (userData: {
    name: string;
    email: string;
    password: string;
    role: string;
    matricule?: string | null;
}) => {
    try {
        await auth.api.signUpEmail({
            body: {
                email: userData.email,
                password: userData.password,
                name: userData.name
            },
            headers: await headers()
        })

        // Update additional fields if provided
        if (userData.matricule || userData.role !== 'PERSONNEL') {
            const [newUser] = await db
                .select()
                .from(users)
                .where(eq(users.email, userData.email))
                .limit(1);

            if (newUser) {
                await db
                    .update(users)
                    .set({
                        role: userData.role as Role,
                        matricule: userData.matricule,
                        updatedAt: new Date()
                    })
                    .where(eq(users.id, newUser.id));
            }
        }
        
        return {
            success: true,
            message: "Utilisateur créé avec succès"
        }
    } catch (error) {
        console.error(error)
        const e = error as Error
        return {
            success: false,
            message: e.message || "Erreur lors de la création de l'utilisateur"
        }
    }
}

export const updateUser = async (userId: string, userData: {
    name?: string;
    email?: string;
    role?: string;
    matricule?: string | null;
    password?: string;
}) => {
    try {
        const updateData: any = {
            updatedAt: new Date()
        };

        if (userData.name) updateData.name = userData.name;
        if (userData.email) updateData.email = userData.email;
        if (userData.role) updateData.role = userData.role as Role;
        if (userData.matricule !== undefined) updateData.matricule = userData.matricule;

        await db
            .update(users)
            .set(updateData)
            .where(eq(users.id, userId));

        // Handle password update separately if provided
        if (userData.password) {
            // Note: Password update through auth system would require additional implementation
            // For now, we'll just update the other fields
        }
        
        return {
            success: true,
            message: "Utilisateur modifié avec succès"
        }
    } catch (error) {
        console.error(error)
        const e = error as Error
        return {
            success: false,
            message: e.message || "Erreur lors de la modification de l'utilisateur"
        }
    }
}

export const deleteUser = async (userId: string) => {
    try {
        await db
            .delete(users)
            .where(eq(users.id, userId));
        
        return {
            success: true,
            message: "Utilisateur supprimé avec succès"
        }
    } catch (error) {
        console.error(error)
        const e = error as Error
        return {
            success: false,
            message: e.message || "Erreur lors de la suppression de l'utilisateur"
        }
    }
}