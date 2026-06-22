"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ListChecks, Loader2 } from "lucide-react";

interface Task {
  id: string;
  code: string;
  submitterName: string;
  estimatedPriceMin: number | null;
  estimatedPriceMax: number | null;
  createdAt: Date | string;
  formData: Record<string, unknown> | null;
}

export function AvailableTasks({ tasks: initialTasks, creatorId, creatorUserId }: {
  tasks: Task[];
  creatorId: string;
  creatorUserId: string;
}) {
  const [tasks, setTasks] = useState(initialTasks);
  const [accepting, setAccepting] = useState<string | null>(null);

  async function acceptTask(ticketId: string) {
    setAccepting(ticketId);
    try {
      const res = await fetch("/api/tickets/accept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticketId, creatorId, userId: creatorUserId }),
      });
      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error || "Erreur");
        return;
      }
      toast.success("Tâche acceptée !");
      setTasks(tasks.filter((t) => t.id !== ticketId));
    } catch {
      toast.error("Erreur lors de l'acceptation");
    } finally {
      setAccepting(null);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Tâches disponibles</h2>
        <p className="text-muted-foreground">Tâches en attente d'un créateur. Acceptez celles qui correspondent à vos compétences.</p>
      </div>

      {tasks.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <ListChecks className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Aucune tâche disponible pour le moment.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {tasks.map((task) => {
            const serviceTypes = task.formData && typeof task.formData === "object" && "serviceTypes" in task.formData
              ? (task.formData.serviceTypes as string[])
              : [];
            const description = task.formData && typeof task.formData === "object" && "description" in task.formData
              ? String(task.formData.description).slice(0, 150)
              : null;

            return (
              <Card key={task.id} className="flex flex-col">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{task.submitterName}</CardTitle>
                    <Badge variant="outline" className="font-mono text-xs">{task.code}</Badge>
                  </div>
                  {serviceTypes.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {serviceTypes.map((s: string) => (
                        <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>
                      ))}
                    </div>
                  )}
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-between gap-4">
                  {description && (
                    <p className="text-sm text-muted-foreground">{description}...</p>
                  )}
                  <div className="flex items-center justify-between">
                    <div className="text-sm">
                      {task.estimatedPriceMin && task.estimatedPriceMax ? (
                        <span className="font-medium">{task.estimatedPriceMin}€ — {task.estimatedPriceMax}€</span>
                      ) : (
                        <span className="text-muted-foreground">Prix à définir</span>
                      )}
                    </div>
                    <Button
                      size="sm"
                      variant="gradient"
                      onClick={() => acceptTask(task.id)}
                      disabled={accepting === task.id}
                    >
                      {accepting === task.id ? <Loader2 className="h-4 w-4 animate-spin" /> : "Accepter"}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {new Date(task.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
