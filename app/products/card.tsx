"use client";

import { useLayoutEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import ISO8601ToStringDate from "@/lib/helpers/ISO8601ToStringDateUtil";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const importProductFormSchema = z.object({
  productWebsite: z.string({ required_error: "Veuillez sélectionner un site web à partir duquel vous souhaitez importer le produit." }),
  productUrl: z.string().url({ message: "Veuillez saisir un lien valide." }).regex(/^https:\/\/www\.decathlon\.ma\/.*/, "Lien non valide, il doit commencer par https://www.decathlon.ma/")
});

export default function ProductsCard() {
  const [products, setProducts] = useState<any[]>([])
  const [isCardLoading, setIsCardLoading] = useState<boolean>(true);
  const [isCardError, setIsCardError] = useState<boolean>(false);
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

  useLayoutEffect(() => {
    if (!isDialogOpen) {
      form.reset();
      setIsDialogLoading(false);
      setIsDialogSuccess(false);
      setIsDialogError(false);
      setDialogErrorMessage("");
      setDialogSuccessMessage("");
    }
  }, [isDialogOpen, form]);

  useLayoutEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/product/");

        if (response.ok) {
          const data = await response.json();
          setProducts(data.products);
          setIsCardLoading(false);
        }

        else {
          setIsCardLoading(false);
          setIsCardError(true);
        }
      } 
      
      catch (error) {
        setIsCardLoading(false);
        setIsCardError(true);
        console.error("Failed to fetch products:", error);
      }
    };

    fetchProducts();
  }, []);

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
      const response = await fetch("/api/product/", {
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
        console.log(data);
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
    <>
      <Card>
        <CardHeader className="flex flex-row items-center">
          <div className="grid gap-2">
          <CardTitle>Produits</CardTitle>
            <CardDescription>
              Gérez et suivez vos produits et consultez l'historique de leurs prix.
            </CardDescription>
          </div>
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
        </CardHeader>
        <CardContent>
          { isCardLoading ? (
            <div className="flex flex-1 items-center justify-center p-9">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="animate-spin size-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
            </div>
          ) : ( isCardError ? (
            <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed p-9">
              <p>Error!</p>
            </div>
          ) : ( !products.length ? (
            <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed p-9">
              <div className="flex flex-col items-center gap-2 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-7">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                </svg>
                <p className="text-sm text-muted-foreground">Vous pouvez commencer le suivi des prix dès que vous importez un produit.</p>
              </div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Prix (DH)</TableHead>
                  <TableHead className="hidden md:table-cell">Importé à</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                { products.map((product) => (
                  <TableRow key={product._id}>
                    <TableCell className="font-medium">{product.productName}</TableCell>
                    <TableCell>{product.productPrice}</TableCell>
                    <TableCell className="hidden md:table-cell">{ISO8601ToStringDate(product.productUsers[0].userImportDate)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button aria-haspopup="true" size="icon" variant="ghost">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                            </svg>
                            <span className="sr-only">Basculer le menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>Historique</DropdownMenuItem>
                          <DropdownMenuItem>Supprimer</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )) }
              </TableBody>
            </Table>
          )))}
        </CardContent>
      </Card>
    </>
  )
}