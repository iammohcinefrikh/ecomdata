import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Metadata } from "next";

import LoginForm from "./form";

export const metadata: Metadata = {
  title: "priceTracker - Se connecter"
};


export default async function Login() {
  const session = await getServerSession();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <LoginForm />    
  )
}