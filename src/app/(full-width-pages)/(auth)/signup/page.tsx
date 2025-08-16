import SignUpForm from "@/components/auth/SignUpForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Machine Care - SignUp Page",
  description: "Ceci est la page d'inscription de Machine Care",
  // other metadata
};

export default function SignUp() {
  return <SignUpForm />;
}
