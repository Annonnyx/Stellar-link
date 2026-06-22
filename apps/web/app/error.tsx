"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      <h2 className="text-2xl font-bold">Quelque chose s&apos;est mal passé</h2>
      <p className="text-muted-foreground">{error.message || "Une erreur inattendue s'est produite."}</p>
      <Button variant="gradient" onClick={() => reset()}>
        Réessayer
      </Button>
    </div>
  );
}
