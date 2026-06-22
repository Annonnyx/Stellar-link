"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard error:", error);
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="max-w-md">
        <CardContent className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Erreur Dashboard</h2>
          <p className="text-muted-foreground mb-6">{error.message || "Une erreur inattendue s'est produite."}</p>
          <Button variant="gradient" onClick={() => reset()}>
            Réessayer
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
