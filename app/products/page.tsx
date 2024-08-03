import { Metadata } from "next";

import LogoutButton from "../logoutButton";
import NavigationLinks from "../navLinks";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import ProductsCard from "./card";

export const metadata: Metadata = {
  title: "priceTracker - Produits"
};

export default async function ProductsPage() {
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
              <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
                <span className="sr-only">Toggle navigation menu</span>
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
        <ProductsCard />
      </main>
    </div>
  )
}