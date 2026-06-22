import { notFound } from "next/navigation";
import { prisma } from "@nova-studio/database";
import { TicketStatus } from "@/components/ticket-status-badge";
import { TicketStatusActions } from "@/components/ticket-status-actions";
import { CreateProjectCard } from "@/components/create-project-dialog";
import { CreateInvoiceCard } from "@/components/create-invoice-card";
import { AssignCreator } from "@/components/assign-creator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export const revalidate = 0;

async function getTicket(id: string) {
  return prisma.ticket.findUnique({
    where: { id },
    include: {
      statusLogs: { orderBy: { createdAt: "desc" } },
      messages: { orderBy: { createdAt: "asc" } },
      assignments: { include: { creator: { include: { user: true } } } },
    },
  });
}

export default async function TicketDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ticket = await getTicket(id);
  if (!ticket) return notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/tickets"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <div>
          <h2 className="text-2xl font-bold">{ticket.code}</h2>
          <p className="text-sm text-muted-foreground">{ticket.type === "SERVICE" ? "Demande de service" : ticket.type === "JOIN" ? "Candidature" : "Contact"}</p>
        </div>
        <div className="ml-auto">
          <TicketStatus status={ticket.status} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Informations</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between"><span className="text-muted-foreground">Nom</span><span>{ticket.submitterName}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Email</span><span>{ticket.submitterEmail}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Discord</span><span>{ticket.submitterDiscord || "—"}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Téléphone</span><span>{ticket.submitterPhone || "—"}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Pays</span><span>{ticket.submitterCountry || "—"}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Code discussion</span><span className="font-mono">{ticket.discussionCode || "—"}</span></div>
            {ticket.estimatedPriceMin && (
              <div className="flex justify-between"><span className="text-muted-foreground">Estimation</span><span>{String(ticket.estimatedPriceMin)}€ - {String(ticket.estimatedPriceMax)}€</span></div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Historique des statuts</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {ticket.statusLogs.map((log: { id: string; toStatus: string; fromStatus: string | null; note: string | null; createdAt: Date }) => (
                <div key={log.id} className="flex items-start gap-3 text-sm">
                  <div className="mt-1 h-2 w-2 rounded-full bg-violet-500 shrink-0" />
                  <div>
                    <p><TicketStatus status={log.toStatus} /> <span className="text-muted-foreground">{log.fromStatus !== log.toStatus ? `(depuis ${log.fromStatus})` : ""}</span></p>
                    {log.note && <p className="text-muted-foreground text-xs">{log.note}</p>}
                    <p className="text-xs text-muted-foreground">{new Date(log.createdAt).toLocaleString("fr-FR")}</p>
                  </div>
                </div>
              ))}
              {ticket.statusLogs.length === 0 && <p className="text-muted-foreground text-sm">Aucun historique</p>}
            </div>
          </CardContent>
        </Card>
      </div>

      <AssignCreator
        ticketId={ticket.id}
        assignments={ticket.assignments.map((a: any) => ({
          id: a.id,
          creatorId: a.creatorId,
          selfAssigned: a.selfAssigned,
          creator: {
            displayName: a.creator.displayName,
            id: a.creator.id,
            user: { name: a.creator.user?.name, email: a.creator.user?.email },
          },
        }))}
      />

      <Card>
        <CardHeader><CardTitle>Actions</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <TicketStatusActions ticketId={ticket.id} currentStatus={ticket.status} />
          <div className="pt-2 border-t border-border/40 flex flex-wrap gap-2">
            <CreateProjectCard ticketId={ticket.id} />
            <CreateInvoiceCard ticketId={ticket.id} />
          </div>
        </CardContent>
      </Card>

      {ticket.messages.length > 0 && (
        <Card>
          <CardHeader><CardTitle>Messages ({ticket.messages.length})</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {ticket.messages.map((msg: { id: string; content: string; senderName: string; senderType: string; createdAt: Date }) => (
                <div key={msg.id} className={`rounded-lg p-3 text-sm ${msg.senderType === "client" ? "bg-violet-500/10" : "bg-muted"}`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium">{msg.senderName}</span>
                    <span className="text-xs text-muted-foreground">{new Date(msg.createdAt).toLocaleString("fr-FR")}</span>
                  </div>
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
