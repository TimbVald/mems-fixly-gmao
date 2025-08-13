import SignUpForm from "@/components/auth/SignUpForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mem's Fixly - SignUp Page",
  description: "Ceci est la page d'inscription de Mem's Fixly",
  // other metadata
};

export default function SignUp() {
  return <SignUpForm />;
}