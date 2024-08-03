import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Metadata } from "next";

import RegisterForm from "./form";

export const metadata: Metadata = {
  title: "priceTracker - S'enregistrer"
};

export default async function Register() {
  const session = await getServerSession();

  if (session) {
    redirect("/dashboard");
  }
  
  return (
    <RegisterForm />
  )
}