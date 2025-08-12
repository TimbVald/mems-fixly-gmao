"use client";

import type { User } from "@/db/types";
import { Button } from "@/components/ui/button";
import { updateUserRole } from "@/server/users";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";

interface AllUsersProps {
    users: User[];
}

export default function AllUsers({ users }: AllUsersProps) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const handleUpdateRole = async (userId: string, newRole: "ADMIN" | "TECHNICIEN" | "PERSONNEL") => {
        try {
            setIsLoading(true);
            await updateUserRole(userId, newRole);
            toast.success(`Rôle mis à jour vers ${newRole}`);
            router.refresh();
        } catch (error) {
            console.error(error);
            setIsLoading(false);
            toast.error("Erreur lors de la mise à jour du rôle");
        }
        finally {
            setIsLoading(false);
        }
    }
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-2xl font-bold">Tous les utilisateurs</h1>
            <div className="flex flex-col items-center justify-center gap-4">
                {users.map((user) => (
                    <div className="flex flex-row items-center justify-between gap-4 p-4 border rounded-lg" key={user.id}>
                        <div className="flex flex-col">
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                        <Badge variant="secondary">
                            {user.role?.charAt(0).toUpperCase() + user.role?.slice(1) || "PERSONNEL"}
                        </Badge>
                        <div className="flex flex-row items-center justify-center gap-2">
                            <Button variant="outline" size="sm" onClick={() => {
                                handleUpdateRole(user.id, "ADMIN");
                            }} disabled={isLoading || user.role === "ADMIN"}>
                                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Admin"}
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => {
                                handleUpdateRole(user.id, "TECHNICIEN");
                            }} disabled={isLoading || user.role === "TECHNICIEN"}>
                                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Technicien"}
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => {
                                handleUpdateRole(user.id, "PERSONNEL");
                            }} disabled={isLoading || user.role === "PERSONNEL"}>
                                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Personnel"}
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}