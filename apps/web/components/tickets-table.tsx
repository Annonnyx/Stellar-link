"use client";

import { useState } from "react";
import Link from "next/link";
import { TicketStatus } from "@/components/ticket-status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Ticket, Search, Download, ChevronLeft, ChevronRight } from "lucide-react";

const PER_PAGE = 20;

interface Ticket {
  id: string;
  code: string;
  type: string;
  status: string;
  submitterName: string;
  submitterEmail: string;
  discussionCode: string | null;
  createdAt: Date | string;
}

export function TicketsTable({ tickets: initialTickets }: { tickets: Ticket[] }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [page, setPage] = useState(1);

  const filtered = initialTickets.filter((t) => {
    const matchesSearch =
      search === "" ||
      t.code.toLowerCase().includes(search.toLowerCase()) ||
      t.submitterName.toLowerCase().includes(search.toLowerCase()) ||
      t.submitterEmail.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Tickets</h2>
          <p className="text-muted-foreground">Gérez toutes les demandes et candidatures.</p>
        </div>
        <Button variant="outline" size="sm" asChild>
          <a href="/api/admin/export/tickets" download>
            <Download className="h-4 w-4 mr-2" />Exporter CSV
          </a>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Ticket className="h-5 w-5" />
            Tous les tickets
          </CardTitle>
          <div className="flex gap-4 mt-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par code, nom, email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="ALL">Tous les statuts</option>
              <option value="PENDING_VERIFICATION">En attente</option>
              <option value="VERIFIED">Vérifié</option>
              <option value="IN_PROGRESS">En cours</option>
              <option value="COMPLETED">Terminé</option>
              <option value="CANCELLED">Annulé</option>
            </select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/40">
                  <th className="text-left py-2 px-4 font-medium text-muted-foreground">Code</th>
                  <th className="text-left py-2 px-4 font-medium text-muted-foreground">Type</th>
                  <th className="text-left py-2 px-4 font-medium text-muted-foreground">Nom</th>
                  <th className="text-left py-2 px-4 font-medium text-muted-foreground">Email</th>
                  <th className="text-left py-2 px-4 font-medium text-muted-foreground">Statut</th>
                  <th className="text-left py-2 px-4 font-medium text-muted-foreground">Code discussion</th>
                  <th className="text-left py-2 px-4 font-medium text-muted-foreground">Date</th>
                  <th className="text-left py-2 px-4 font-medium text-muted-foreground">Action</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((ticket) => (
                  <tr key={ticket.id} className="border-b border-border/20 hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4 font-mono text-xs">{ticket.code}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${ticket.type === "SERVICE" ? "bg-blue-500/10 text-blue-500" : ticket.type === "JOIN" ? "bg-violet-500/10 text-violet-500" : "bg-gray-500/10 text-gray-500"}`}>
                        {ticket.type === "SERVICE" ? "Service" : ticket.type === "JOIN" ? "Rejoindre" : "Contact"}
                      </span>
                    </td>
                    <td className="py-3 px-4">{ticket.submitterName}</td>
                    <td className="py-3 px-4 text-muted-foreground">{ticket.submitterEmail}</td>
                    <td className="py-3 px-4"><TicketStatus status={ticket.status} /></td>
                    <td className="py-3 px-4 font-mono text-xs">{ticket.discussionCode || "—"}</td>
                    <td className="py-3 px-4 text-muted-foreground text-xs">{new Date(ticket.createdAt).toLocaleDateString("fr-FR")}</td>
                    <td className="py-3 px-4">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/tickets/${ticket.id}`}>Voir</Link>
                      </Button>
                    </td>
                  </tr>
                ))}
                {paginated.length === 0 && (
                  <tr><td colSpan={8} className="py-8 text-center text-muted-foreground">Aucun ticket trouvé</td></tr>
                )}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 border-t border-border/40 mt-4">
              <p className="text-sm text-muted-foreground">{filtered.length} résultats · Page {page}/{totalPages}</p>
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
