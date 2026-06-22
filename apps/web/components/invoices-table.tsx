"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, ChevronLeft, ChevronRight } from "lucide-react";

const PER_PAGE = 20;

interface Invoice {
  id: string;
  number: string;
  totalAmount: number | string | { toNumber: () => number };
  status: string;
  stripeInvoiceId: string | null;
  createdAt: Date | string;
  ticket: {
    code: string;
    submitterName: string;
  } | null;
}

export function InvoicesTable({ invoices: initialInvoices }: { invoices: Invoice[] }) {
  const [invoices, setInvoices] = useState(initialInvoices);
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(invoices.length / PER_PAGE);
  const paginated = invoices.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  async function updateStatus(id: string, status: string) {
    try {
      await fetch(`/api/invoices/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      setInvoices(invoices.map((inv) => inv.id === id ? { ...inv, status } : inv));
    } catch (error) {
      console.error("Error updating invoice status:", error);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Factures</h2>
          <p className="text-muted-foreground">Gestion des factures et paiements.</p>
        </div>
        <Button variant="outline" size="sm" asChild>
          <a href="/api/admin/export/invoices" download>
            <Download className="h-4 w-4 mr-2" />Exporter CSV
          </a>
        </Button>
      </div>

      <Card>
        <CardHeader><CardTitle>Liste des factures</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/40">
                  <th className="text-left py-2 px-4 font-medium text-muted-foreground">N°</th>
                  <th className="text-left py-2 px-4 font-medium text-muted-foreground">Ticket</th>
                  <th className="text-left py-2 px-4 font-medium text-muted-foreground">Montant</th>
                  <th className="text-left py-2 px-4 font-medium text-muted-foreground">Statut</th>
                  <th className="text-left py-2 px-4 font-medium text-muted-foreground">Stripe</th>
                  <th className="text-left py-2 px-4 font-medium text-muted-foreground">Date</th>
                  <th className="text-left py-2 px-4 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((invoice) => (
                  <tr key={invoice.id} className="border-b border-border/20 hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4 font-medium">{invoice.number}</td>
                    <td className="py-3 px-4 text-muted-foreground">{invoice.ticket?.code || "—"}</td>
                    <td className="py-3 px-4">
                      {invoice.totalAmount
                        ? `${typeof invoice.totalAmount === "object" && "toNumber" in invoice.totalAmount
                            ? invoice.totalAmount.toNumber().toFixed(2)
                            : Number(invoice.totalAmount).toFixed(2)}€`
                        : "—"}
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={invoice.status === "PAID" ? "default" : invoice.status === "SENT" ? "secondary" : "outline"}>
                        {invoice.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground text-xs">{invoice.stripeInvoiceId || "—"}</td>
                    <td className="py-3 px-4 text-muted-foreground text-xs">{new Date(invoice.createdAt).toLocaleDateString("fr-FR")}</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        {invoice.status === "DRAFT" && (
                          <Button variant="ghost" size="sm" onClick={() => updateStatus(invoice.id, "SENT")}>
                            Envoyer
                          </Button>
                        )}
                        {invoice.status === "SENT" && (
                          <Button variant="ghost" size="sm" onClick={() => updateStatus(invoice.id, "PAID")}>
                            Marquer payée
                          </Button>
                        )}
                        {invoice.status === "OVERDUE" && (
                          <Button variant="ghost" size="sm" onClick={() => updateStatus(invoice.id, "PAID")}>
                            Marquer payée
                          </Button>
                        )}
                        <Button variant="ghost" size="sm" onClick={() => window.print()}>
                          Télécharger
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {paginated.length === 0 && (
                  <tr><td colSpan={7} className="py-8 text-center text-muted-foreground">Aucune facture</td></tr>
                )}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 border-t border-border/40 mt-4">
              <p className="text-sm text-muted-foreground">{invoices.length} résultats · Page {page}/{totalPages}</p>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
