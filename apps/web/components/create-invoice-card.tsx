"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, FileText } from "lucide-react";

export function CreateInvoiceCard({ ticketId }: { ticketId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [subtotal, setSubtotal] = useState("");
  const [taxRate, setTaxRate] = useState("20");
  const [dueAt, setDueAt] = useState("");
  const [notes, setNotes] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!subtotal) return;
    setIsLoading(true);
    try {
      const res = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticketId, subtotal, taxRate, dueAt, notes }),
      });
      if (res.ok) window.location.reload();
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  if (!isOpen) {
    return (
      <Button variant="outline" onClick={() => setIsOpen(true)}>
        <FileText className="h-4 w-4 mr-2" />Créer une facture
      </Button>
    );
  }

  return (
    <Card className="border-border/40">
      <CardHeader><CardTitle>Nouvelle facture</CardTitle></CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="subtotal">Sous-total (€)</Label>
              <Input id="subtotal" type="number" step="0.01" value={subtotal} onChange={(e) => setSubtotal(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="taxRate">TVA (%)</Label>
              <Input id="taxRate" type="number" step="0.01" value={taxRate} onChange={(e) => setTaxRate(e.target.value)} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Input id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dueAt">Date d&apos;échéance</Label>
            <Input id="dueAt" type="date" value={dueAt} onChange={(e) => setDueAt(e.target.value)} />
          </div>
          <div className="flex gap-2">
            <Button type="submit" variant="gradient" disabled={isLoading}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Créer"}
            </Button>
            <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>Annuler</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
