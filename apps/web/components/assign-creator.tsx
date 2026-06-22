"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Users, Loader2, Plus, X } from "lucide-react";

interface AssignedCreator {
  id: string;
  creatorId: string;
  selfAssigned: boolean;
  creator: {
    displayName: string;
    id: string;
    user: { name: string | null; email: string };
  };
}

interface AvailableCreator {
  id: string;
  userId: string;
  displayName: string;
  availability: string;
  user: { name: string | null; email: string };
}

export function AssignCreator({ ticketId, assignments }: {
  ticketId: string;
  assignments: AssignedCreator[];
}) {
  const [currentAssignments, setCurrentAssignments] = useState(assignments);
  const [creators, setCreators] = useState<AvailableCreator[]>([]);
  const [showPicker, setShowPicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (showPicker && creators.length === 0) {
      fetch("/api/admin/creators")
        .then((r) => r.json())
        .then((d) => setCreators(d.creators || []))
        .catch(() => toast.error("Erreur de chargement des créateurs"));
    }
  }, [showPicker, creators.length]);

  async function assign(creator: AvailableCreator) {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/assign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticketId, userId: creator.userId, creatorId: creator.id }),
      });
      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error || "Erreur");
        return;
      }
      const data = await res.json();
      setCurrentAssignments([...currentAssignments, {
        id: data.assignment.id,
        creatorId: creator.id,
        selfAssigned: false,
        creator: { displayName: creator.displayName, id: creator.id, user: creator.user },
      }]);
      toast.success(`${creator.displayName} assigné !`);
      setShowPicker(false);
    } catch {
      toast.error("Erreur d'assignation");
    } finally {
      setIsLoading(false);
    }
  }

  async function unassign(assignmentId: string) {
    try {
      const res = await fetch("/api/admin/assign", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assignmentId }),
      });
      if (!res.ok) throw new Error();
      setCurrentAssignments(currentAssignments.filter((a) => a.id !== assignmentId));
      toast.success("Créateur retiré");
    } catch {
      toast.error("Erreur");
    }
  }

  const assignedIds = currentAssignments.map((a) => a.creatorId);
  const available = creators.filter((c) => !assignedIds.includes(c.id));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Créateurs assignés
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {currentAssignments.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aucun créateur assigné</p>
        ) : (
          <div className="space-y-2">
            {currentAssignments.map((a) => (
              <div key={a.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-violet-500/20 flex items-center justify-center text-xs font-medium">
                    {a.creator.displayName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{a.creator.displayName}</p>
                    <p className="text-xs text-muted-foreground">{a.creator.user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {a.selfAssigned && <Badge variant="outline" className="text-xs">Auto</Badge>}
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => unassign(a.id)}>
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {showPicker ? (
          <div className="border border-border/40 rounded-lg p-3 space-y-2">
            <p className="text-sm font-medium">Sélectionner un créateur :</p>
            {available.length === 0 ? (
              <p className="text-xs text-muted-foreground">Aucun créateur disponible</p>
            ) : (
              <div className="max-h-48 overflow-y-auto space-y-1">
                {available.map((c) => (
                  <button
                    key={c.id}
                    className="w-full flex items-center justify-between p-2 rounded-md hover:bg-muted/50 transition-colors text-left"
                    onClick={() => assign(c)}
                    disabled={isLoading}
                  >
                    <div>
                      <p className="text-sm">{c.displayName}</p>
                      <p className="text-xs text-muted-foreground">{c.availability} · {c.user.email}</p>
                    </div>
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4 text-muted-foreground" />}
                  </button>
                ))}
              </div>
            )}
            <Button variant="ghost" size="sm" onClick={() => setShowPicker(false)}>Annuler</Button>
          </div>
        ) : (
          <Button variant="outline" size="sm" onClick={() => setShowPicker(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Assigner un créateur
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
