import ResetPasswordWrapper from "@/components/auth/ResetPasswordWrapper";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Machine Care - Réinitialisation du mot de passe",
  description: "Page de réinitialisation du mot de passe pour Machine Care.",
};

export default function ResetPasswordPage() {
  return <ResetPasswordWrapper />;
}