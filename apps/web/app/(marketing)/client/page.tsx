"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Ticket, MessageSquare, FolderOpen, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TicketStatus } from "@/components/ticket-status-badge";

export default function ClientSpacePage() {
  const [code, setCode] = useState("");
  const [ticket, setTicket] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLookup() {
    if (!code.trim()) return;
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/tickets/lookup?code=${encodeURIComponent(code.trim())}`);
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Ticket introuvable"); setTicket(null); }
      else { setTicket(data.ticket); }
    } catch { setError("Erreur de recherche"); }
    finally { setIsLoading(false); }
  }

  return (
    <section className="py-24">
      <div className="container max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Espace Client</h1>
          <p className="text-muted-foreground">Suivez votre demande avec votre code de discussion.</p>
        </div>

        <Card className="border-border/40 mb-6">
          <CardContent className="p-6">
            <div className="flex gap-2">
              <Input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Code de discussion (ex: ABC12345)" className="font-mono" />
              <Button variant="gradient" onClick={handleLookup} disabled={isLoading || !code.trim()}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Rechercher"}
              </Button>
            </div>
            {error && <p className="text-sm text-destructive mt-2">{error}</p>}
          </CardContent>
        </Card>

        {ticket && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <Card className="border-border/40">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Ticket className="h-5 w-5 text-violet-500" />
                  {ticket.code}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between"><span className="text-muted-foreground">Statut</span><TicketStatus status={ticket.status} /></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Nom</span><span>{ticket.submitterName}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Email</span><span>{ticket.submitterEmail}</span></div>
                {ticket.estimatedPriceMin && (
                  <div className="flex justify-between"><span className="text-muted-foreground">Estimation</span><span>{ticket.estimatedPriceMin}€ - {ticket.estimatedPriceMax}€</span></div>
                )}
                <div className="pt-3 border-t border-border/40">
                  <Button variant="outline" className="w-full" asChild>
                    <a href={`/chat?code=${ticket.discussionCode}`}>
                      <MessageSquare className="h-4 w-4 mr-2" />Accéder au chat
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {ticket.project && (
              <Card className="border-border/40">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <FolderOpen className="h-5 w-5 text-violet-500" />
                    Projet associé
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div>
                      <p className="font-medium">{ticket.project.title}</p>
                      <p className="text-sm text-muted-foreground">{ticket.project.description || "Sans description"}</p>
                    </div>
                    <Badge variant={ticket.project.status === "COMPLETED" ? "default" : "secondary"}>
                      {ticket.project.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            )}

            {ticket.invoices && ticket.invoices.length > 0 && (
              <Card className="border-border/40">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <FileText className="h-5 w-5 text-violet-500" />
                    Factures
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {ticket.invoices.map((invoice: any) => (
                    <div key={invoice.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div>
                        <p className="font-medium">{invoice.number}</p>
                        <p className="text-sm text-muted-foreground">Total: {invoice.totalAmount}€</p>
                      </div>
                      <Badge variant={invoice.status === "PAID" ? "default" : invoice.status === "SENT" ? "secondary" : "outline"}>
                        {invoice.status}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </motion.div>
        )}
      </div>
    </section>
  );
}
