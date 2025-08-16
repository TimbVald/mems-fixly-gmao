import SignInForm from "@/components/auth/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Machine Care - SignIn Page",
  description: "Ceci est la page de connexion de Machine Care",
};

export default function SignIn() {
  return <SignInForm />;
}
