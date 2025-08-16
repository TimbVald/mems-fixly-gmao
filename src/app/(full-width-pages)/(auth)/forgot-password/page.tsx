import ForgotPassword from "@/components/auth/ForgotPassword";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Machine Care - Mot de passe oublié",
  description: "Page de demande de réinitialisation du mot de passe pour Machine Care.",
};

export default function ForgotPasswordPage() {
  return <ForgotPassword />;
}