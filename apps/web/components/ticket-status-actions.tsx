"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const statusOptions = [
  { value: "PENDING_VERIFICATION", label: "En attente de vérification" },
  { value: "PENDING_ADMIN_REVIEW", label: "En attente d'examen" },
  { value: "ASSIGNED", label: "Assigné" },
  { value: "IN_PROGRESS", label: "En cours" },
  { value: "PENDING_APPROVAL", label: "En attente d'approbation" },
  { value: "COMPLETED", label: "Terminé" },
  { value: "CANCELLED", label: "Annulé" },
];

export function TicketStatusActions({ ticketId, currentStatus }: { ticketId: string; currentStatus: string }) {
  const [isLoading, setIsLoading] = useState(false);

  async function updateStatus(newStatus: string) {
    if (newStatus === currentStatus) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/tickets/${ticketId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) window.location.reload();
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      {statusOptions.map((opt) => (
        <Button
          key={opt.value}
          variant={opt.value === currentStatus ? "default" : "outline"}
          size="sm"
          disabled={isLoading || opt.value === currentStatus}
          onClick={() => updateStatus(opt.value)}
        >
          {isLoading && opt.value !== currentStatus ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : null}
          {opt.label}
        </Button>
      ))}
    </div>
  );
}
