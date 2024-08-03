import Link from "next/link";
import LogoutButton from "../logoutButton";
import NavigationLinks from "../navLinks";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "priceTracker - Dashboard"
};

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-white z-50">
        <div className="container px-4 mx-auto max-w-screen-xl flex items-center gap-4">
          <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
            <span className="hidden font-bold md:inline-block text-wrap">priceTracker</span>
            <NavigationLinks />
          </nav>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full shrink-0 md:hidden">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
                <span className="sr-only">Menu de navigation</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <nav className="grid gap-6 text-lg font-medium">
                <span className="font-bold text-wrap">priceTracker</span>
                <NavigationLinks />
              </nav>
            </SheetContent>
          </Sheet>

          <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
            <div className="ml-auto">
              <LogoutButton />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto max-w-screen-xl flex flex-1 flex-col gap-4 px-4 py-8">
          <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
            <Card className="xl:col-span-2" x-chunk="dashboard-01-chunk-4">
              <CardHeader className="flex flex-row items-center">
                <div className="grid gap-2">
                  <CardTitle>Produits</CardTitle>
                  <CardDescription>Produits récents ajoutés à votre compte.</CardDescription>
                </div>
                <Button asChild size="sm" className="ml-auto gap-1">
                  <Link href="/products">Voir tout</Link>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed p-9">
                  <div className="flex flex-col items-center gap-1 text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-7">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                    </svg>
                    <p className="text-sm text-muted-foreground">Vous pouvez commencer le suivi des prix dès que vous importez un produit.</p>
                  </div>
                </div>
                {/* <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Produit</TableHead>
                      <TableHead className="text-right">Montant actuel</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>

                    <TableRow>
                      <TableCell>
                        <div className="font-medium">Liam Johnson</div>
                        <div className="hidden text-sm text-muted-foreground md:inline">liam@example.com</div>
                      </TableCell>
                      <TableCell className="text-right">$250.00</TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell>
                        <div className="font-medium">Olivia Smith</div>
                        <div className="hidden text-sm text-muted-foreground md:inline">olivia@example.com</div>
                      </TableCell>
                      <TableCell className="text-right">$150.00</TableCell>
                    </TableRow>

                  </TableBody>
                </Table> */}
              </CardContent>
            </Card>

            <Card x-chunk="dashboard-01-chunk-5">
              <CardHeader>
                <CardTitle>Mises à jour récentes</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-8">
                <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed p-9">
                  <div className="flex flex-col items-center gap-2 text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-7">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                    </svg>
                    <p className="text-sm text-muted-foreground">Vous verrez les mises à jour dès que vous aurez importé un produit.</p>
                  </div>
                </div>
                {/* <div className="flex items-center gap-4">
                  <div className="grid gap-1">
                    <p className="text-sm font-medium leading-none">Olivia Martin</p>
                    <p className="text-sm text-muted-foreground">olivia.martin@email.com</p>
                  </div>
                  <div className="ml-auto font-medium">+$1,999.00</div>
                </div> */}
              </CardContent>
            </Card>

          </div>
      </main>

    </div>
  )
}