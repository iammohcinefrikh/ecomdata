"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavigationLinks() {
  const pathname = usePathname();

  return (
    <>
      <Link href="/dashboard"  className={`${pathname === "/dashboard" ? "text-foreground" : "text-muted-foreground"}  transition-colors hover:text-foreground`} >Dashboard</Link>
      <Link href="/products" className={`${pathname === "/products" ? "text-foreground" : "text-muted-foreground"}  transition-colors hover:text-foreground`}>Produits</Link>
      <Link href="/profile" className={`${pathname === "/profile" ? "text-foreground" : "text-muted-foreground"}  transition-colors hover:text-foreground`}>Profile</Link>
    </>
  )
}