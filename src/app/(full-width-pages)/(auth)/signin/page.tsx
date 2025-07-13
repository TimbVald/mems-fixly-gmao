import SignInForm from "@/components/auth/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mem's Fixly - SignIn Page",
  description: "Ceci est la page de connexion de Mem's Fixly",
};

export default function SignIn() {
  return <SignInForm />;
}
