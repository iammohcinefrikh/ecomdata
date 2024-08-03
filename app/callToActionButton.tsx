"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

export default function CallToActionButton() {
  const router = useRouter();

  return (
    <Button className="mt-6" onClick={() => {router.push("/register");}}>Commencer le suivi</Button>
  )
}