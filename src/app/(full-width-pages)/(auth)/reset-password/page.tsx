import ResetPassword from "@/components/auth/ResetPassword";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mem's Fixly - Réinitialisation du mot de passe",
  description: "Page de réinitialisation du mot de passe pour Mem's Fixly.",
};

export default function ResetPasswordPage() {
  return <ResetPassword />;
} 