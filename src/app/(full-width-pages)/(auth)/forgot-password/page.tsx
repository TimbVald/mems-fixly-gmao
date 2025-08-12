import ForgotPassword from "@/components/auth/ForgotPassword";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mem's Fixly - Mot de passe oublié",
  description: "Page de demande de réinitialisation du mot de passe pour Mem's Fixly.",
};

export default function ForgotPasswordPage() {
  return <ForgotPassword />;
} 