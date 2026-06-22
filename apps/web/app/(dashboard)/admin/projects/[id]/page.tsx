import { notFound } from "next/navigation";
import { prisma } from "@nova-studio/database";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, DollarSign, Target } from "lucide-react";
import { ProjectActions } from "@/components/project-actions";
import Link from "next/link";

export const revalidate = 0;

async function getProject(id: string) {
  return prisma.project.findUnique({
    where: { id },
    include: {
      ticket: { select: { id: true, code: true, submitterName: true, submitterEmail: true } },
      deliverables: { orderBy: { createdAt: "desc" } },
      milestones: { orderBy: { order: "asc" } },
      invoices: { select: { id: true, number: true, status: true, totalAmount: true } },
      statusLogs: { orderBy: { createdAt: "desc" } },
    },
  });
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await getProject(id);
  if (!project) return notFound();

  const statusColors: Record<string, string> = {
    DRAFT: "bg-gray-500/10 text-gray-400",
    PENDING_APPROVAL: "bg-yellow-500/10 text-yellow-500",
    IN_PROGRESS: "bg-blue-500/10 text-blue-500",
    IN_REVISION: "bg-orange-500/10 text-orange-400",
    COMPLETED: "bg-green-500/10 text-green-500",
    CANCELLED: "bg-red-500/10 text-red-400",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/projects"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <div className="flex-1">
          <h2 className="text-2xl font-bold">{project.title}</h2>
          <p className="text-sm text-muted-foreground">
            Ticket: <Link href={`/admin/tickets/${project.ticket.id}`} className="text-violet-400 hover:underline">{project.ticket.code}</Link>
            {" · "}{project.ticket.submitterName}
          </p>
        </div>
        <Badge className={statusColors[project.status] || ""}>{project.status}</Badge>
      </div>

      {/* Stats row */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <Target className="h-4 w-4" />Progression
            </div>
            <div className="text-2xl font-bold">{project.progress}%</div>
            <div className="w-full bg-muted rounded-full h-2 mt-2">
              <div className="bg-violet-500 h-2 rounded-full transition-all" style={{ width: `${project.progress}%` }} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <DollarSign className="h-4 w-4" />Prix convenu
            </div>
            <div className="text-2xl font-bold">{project.agreedPrice ? `${Number(project.agreedPrice)}€` : "—"}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <Calendar className="h-4 w-4" />Deadline
            </div>
            <div className="text-2xl font-bold">{project.deadline ? new Date(project.deadline).toLocaleDateString("fr-FR") : "—"}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground mb-1">Livrables</div>
            <div className="text-2xl font-bold">{project.deliverables.length}</div>
            <p className="text-xs text-muted-foreground">{project.deliverables.filter((d) => d.isApproved).length} approuvés</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Description & actions */}
        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Description</CardTitle></CardHeader>
            <CardContent>
              <p className="text-sm whitespace-pre-wrap">{project.description || "Aucune description."}</p>
            </CardContent>
          </Card>

          <ProjectActions projectId={project.id} currentStatus={project.status} currentProgress={project.progress} />
        </div>

        {/* Milestones & deliverables */}
        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Milestones ({project.milestones.length})</CardTitle></CardHeader>
            <CardContent>
              {project.milestones.length === 0 ? (
                <p className="text-sm text-muted-foreground">Aucun milestone défini.</p>
              ) : (
                <div className="space-y-3">
                  {project.milestones.map((m) => (
                    <div key={m.id} className="flex items-center gap-3">
                      <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${m.completed ? "border-green-500 bg-green-500/20" : "border-border"}`}>
                        {m.completed && <span className="text-green-500 text-xs">✓</span>}
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm ${m.completed ? "line-through text-muted-foreground" : ""}`}>{m.title}</p>
                        {m.dueDate && <p className="text-xs text-muted-foreground">{new Date(m.dueDate).toLocaleDateString("fr-FR")}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Livrables ({project.deliverables.length})</CardTitle></CardHeader>
            <CardContent>
              {project.deliverables.length === 0 ? (
                <p className="text-sm text-muted-foreground">Aucun livrable uploadé.</p>
              ) : (
                <div className="space-y-2">
                  {project.deliverables.map((d) => (
                    <div key={d.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/30 text-sm">
                      <div>
                        <p className="font-medium">{d.fileName}</p>
                        <p className="text-xs text-muted-foreground">v{d.version} · {(d.fileSize / 1024).toFixed(0)} KB</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {d.isApproved ? (
                          <Badge className="bg-green-500/10 text-green-500">Approuvé</Badge>
                        ) : (
                          <Badge variant="outline">En attente</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Invoices */}
          {project.invoices.length > 0 && (
            <Card>
              <CardHeader><CardTitle>Factures</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {project.invoices.map((inv) => (
                    <div key={inv.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/30 text-sm">
                      <span className="font-mono">{inv.number}</span>
                      <div className="flex items-center gap-2">
                        <span>{Number(inv.totalAmount)}€</span>
                        <Badge variant={inv.status === "PAID" ? "default" : "outline"}>{inv.status}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Status history */}
      <Card>
        <CardHeader><CardTitle>Historique des statuts</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {project.statusLogs.map((log) => (
              <div key={log.id} className="flex items-start gap-3 text-sm">
                <div className="mt-1 h-2 w-2 rounded-full bg-violet-500 shrink-0" />
                <div>
                  <p>{log.toStatus} {log.fromStatus ? `(depuis ${log.fromStatus})` : ""}</p>
                  {log.note && <p className="text-muted-foreground text-xs">{log.note}</p>}
                  <p className="text-xs text-muted-foreground">{new Date(log.createdAt).toLocaleString("fr-FR")}</p>
                </div>
              </div>
            ))}
            {project.statusLogs.length === 0 && <p className="text-muted-foreground text-sm">Aucun historique</p>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
