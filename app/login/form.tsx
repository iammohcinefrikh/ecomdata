"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const loginFormSchema = z.object({
  userEmail: z.string()
    .min(1, { message: "L'adresse email est requise." })
    .email({ message: "Veuillez saisir une adresse email valide." }),
  userPassword: z.string()
    .min(8, { message: "Veuillez saisir un mot de passe valide." })
    .max(32, { message: "Le mot de passe est trop long." })
});


export default function LoginForm() {
  const router = useRouter();

  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      userEmail: "",
      userPassword: ""
    }
  });

  const onSubmit = async (values: z.infer<typeof loginFormSchema>) => {
    const response = await signIn("credentials", {
      userEmail: values.userEmail,
      userPassword: values.userPassword,
      redirect: false
    });

    if (!response?.error) {
      router.push("/dashboard");
      router.refresh();
    }
  }

  return (
    <div className="flex h-screen items-center justify-center">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Se connecter</CardTitle>
          <CardDescription>Saisissez vos identifiants ci-dessous pour vous connecter à votre compte</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
              <FormField control={form.control} name="userEmail" render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="john.doe@example.com" {...field} />
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
              <Button type="submit" className="w-full">Se connecter</Button>
            </form>
          </Form>
          <div className="mt-4 text-center text-sm">
            Vous n&apos;avez pas de compte?{" "}
            <Link href="/register" className="underline">S'enregistrer</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}