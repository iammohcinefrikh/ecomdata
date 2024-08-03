"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const importProductFormSchema = z.object({
  productWebsite: z.string({ required_error: "Veuillez sélectionner un site web à partir duquel vous souhaitez importer le produit." }),
  productUrl: z.string().url({ message: "Veuillez saisir un lien valide." }).regex(/^https:\/\/www\.decathlon\.ma\/.*/, "Lien non valide, il doit commencer par https://www.decathlon.ma/")
});

export default function ImportProductForm() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDialogLoading, setIsDialogLoading] = useState(false);
  const [isDialogSuccess, setIsDialogSuccess] = useState(false);
  const [isDialogError, setIsDialogError] = useState(false);
  const [dialogErrorMessage, setDialogErrorMessage] = useState("");
  const [dialogSuccessMessage, setDialogSuccessMessage] = useState("");

  const form = useForm<z.infer<typeof importProductFormSchema>>({
    resolver: zodResolver(importProductFormSchema),
    defaultValues: {
      productUrl: ""
    }
  });

  useEffect(() => {
    if (!isDialogOpen) {
      form.reset();
      setIsDialogLoading(false);
      setIsDialogSuccess(false);
      setIsDialogError(false);
      setDialogErrorMessage("");
      setDialogSuccessMessage("");
    }
  }, [isDialogOpen, form]);

  const handleOpenChange = (open: boolean) => {
    if (!isDialogLoading) {
      setIsDialogOpen(open);
    }
  };

  const onSubmit = async (values: z.infer<typeof importProductFormSchema>) => {
    setIsDialogLoading(true);
    setIsDialogSuccess(false);
    setIsDialogError(false);

    try {
      const response = await fetch("/api/product/import", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          productUrl: values.productUrl,
          productWebsite: values.productWebsite
        })
      });

      if (response.ok) {
        const data = await response.json();
        setDialogSuccessMessage(data.message);
        setIsDialogSuccess(true);
      }
      
      else {
        const errorData = await response.json();
        setDialogErrorMessage(errorData.message || "Une erreur inconnue s'est produite.");
        setIsDialogError(true);
      }
    } 
    
    catch (error) {
      console.error("Fetch Error:", error);
      setDialogErrorMessage("An unexpected error occurred.");
      setIsDialogError(true);
    } 
    
    finally {
      setIsDialogLoading(false);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm" className="ml-auto gap-2">Importer</Button>
      </DialogTrigger>
      <DialogContent showCloseIcon={false}>
        {!isDialogLoading && !isDialogSuccess && !isDialogError ? (
          <>
            <DialogHeader>
              <DialogTitle>Importer un produit</DialogTitle>
              <DialogDescription>Remplissez le formulaire suivant pour importer le produit de votre choix.</DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 mt-4">
                <FormField control={form.control} name="productWebsite" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Site web</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un site web" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="decathlon">Decathlon</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="productUrl" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lien</FormLabel>
                    <FormControl>
                      <Input type="url" placeholder="https://example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" onClick={(e) => { e.preventDefault(); setIsDialogOpen(false); }}>Annuler</Button>
                  <Button type="submit" className="w-full">Importer</Button>
                </div>
              </form>
            </Form>
          </>
        ) : isDialogLoading ? (
          <div className="flex flex-col items-center gap-2 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="animate-spin size-7">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
            <p className="text-sm text-muted-foreground">Veuillez patienter pendant que nous importons le produit.</p>
          </div>
        ) : isDialogSuccess ? (
          <>
            <div className="flex flex-1 items-center justify-center rounded-lg border-2 border-green-600 bg-green-50 p-9">
              <div className="flex flex-col items-center gap-2 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8 stroke-green-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                <p className="text-base font-medium text-green-600">Succès: {dialogSuccessMessage}</p>
              </div>
            </div>
            <Button onClick={(e) => { e.preventDefault(); setIsDialogOpen(false); }}>Fermer</Button>
          </>
        ) : isDialogError ? (
          <>
            <div className="flex flex-1 items-center justify-center rounded-lg border-2 border-rose-600 bg-rose-50 p-9">
              <div className="flex flex-col items-center gap-2 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8 stroke-rose-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                <p className="text-base font-medium text-rose-600">Erreur: {dialogErrorMessage}</p>
              </div>
            </div>
            <Button onClick={(e) => { e.preventDefault(); setIsDialogOpen(false); }}>Fermer</Button>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}