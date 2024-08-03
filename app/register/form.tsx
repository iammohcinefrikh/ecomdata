"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const registerFormSchema = z.object({
  userFirstName: z.string()
    .min(1, { message: "Veuillez saisir un prénom valide." })
    .max(16, { message: "Le prénom est trop long." }),
  userLastName: z.string()
    .min(1, { message: "Veuillez saisir un nom valide." })
    .max(16, { message: "Le nom est trop long." }),
  userEmail: z.string()
    .min(1, { message: "L'adresse email est requise." })
    .email({ message: "Veuillez saisir une adresse email valide." }),
  userPassword: z.string()
    .min(8, { message: "Veuillez saisir un mot de passe valide." })
    .max(32, { message: "Le mot de passe est trop long." })
});

export default function RegisterForm() {
  const router = useRouter();

  const form = useForm<z.infer<typeof registerFormSchema>>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      userFirstName: "",
      userLastName: "",
      userEmail: "",
      userPassword: ""
    }
  });

  const onSubmit = async (values: z.infer<typeof registerFormSchema>) => {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userFirstName: values.userFirstName,
        userLastName: values.userLastName,
        userEmail: values.userEmail,
        userPassword: values.userPassword
      })
    });

    if (response.ok) {
      router.push("/login");
    }
  }

  return (
    <div className="flex h-screen items-center justify-center">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-xl">S'enregistrer</CardTitle>
          <CardDescription>Saisissez vos informations pour créer un compte</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="userFirstName" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prénom</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="John" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="userLastName" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
              </div>
              <FormField control={form.control} name="userEmail" render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="john.doe@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="userPassword" render={({ field }) => (
                <FormItem>
                  <FormLabel>Mot de passe</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <Button type="submit" className="w-full">Créer un compte</Button>
            </form>
          </Form>
          <div className="mt-4 text-center text-sm">
            Vous avez déjà un compte?{" "}
            <Link href="/login" className="underline">Se connecter</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}