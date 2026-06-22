"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Search, ChevronLeft, ChevronRight } from "lucide-react";

const PER_PAGE = 20;

interface Client {
  name: string;
  email: string;
  country: string | null;
  firstContact: Date | string;
  ticketCount: number;
  totalSpent: number;
  ticketCodes: string[];
}

export function ClientsTable({ clients }: { clients: Client[] }) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filtered = clients.filter((c) =>
    search === "" ||
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Clients</h2>
        <p className="text-muted-foreground">Tous les clients ayant soumis une demande de service.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Liste des clients ({clients.length})
          </CardTitle>
          <div className="relative max-w-sm mt-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher par nom, email..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/40">
                  <th className="text-left py-2 px-4 font-medium text-muted-foreground">Nom</th>
                  <th className="text-left py-2 px-4 font-medium text-muted-foreground">Email</th>
                  <th className="text-left py-2 px-4 font-medium text-muted-foreground">Pays</th>
                  <th className="text-left py-2 px-4 font-medium text-muted-foreground">Tickets</th>
                  <th className="text-left py-2 px-4 font-medium text-muted-foreground">Dépensé</th>
                  <th className="text-left py-2 px-4 font-medium text-muted-foreground">1er contact</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((client) => (
                  <tr key={client.email} className="border-b border-border/20 hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4 font-medium">{client.name}</td>
                    <td className="py-3 px-4 text-muted-foreground">{client.email}</td>
                    <td className="py-3 px-4">{client.country || "—"}</td>
                    <td className="py-3 px-4">
                      <Badge variant="secondary">{client.ticketCount}</Badge>
                    </td>
                    <td className="py-3 px-4 font-medium">{client.totalSpent > 0 ? `${client.totalSpent.toFixed(0)}€` : "—"}</td>
                    <td className="py-3 px-4 text-muted-foreground text-xs">{new Date(client.firstContact).toLocaleDateString("fr-FR")}</td>
                  </tr>
                ))}
                {paginated.length === 0 && (
                  <tr><td colSpan={6} className="py-8 text-center text-muted-foreground">Aucun client trouvé</td></tr>
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
