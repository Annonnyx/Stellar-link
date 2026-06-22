"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Settings } from "lucide-react";

const PROJECT_STATUSES = [
  { value: "DRAFT", label: "Brouillon" },
  { value: "PENDING_APPROVAL", label: "En attente d'approbation" },
  { value: "IN_PROGRESS", label: "En cours" },
  { value: "IN_REVISION", label: "En révision" },
  { value: "COMPLETED", label: "Terminé" },
  { value: "CANCELLED", label: "Annulé" },
];

export function ProjectActions({ projectId, currentStatus, currentProgress }: {
  projectId: string;
  currentStatus: string;
  currentProgress: number;
}) {
  const [status, setStatus] = useState(currentStatus);
  const [progress, setProgress] = useState(currentProgress);
  const [isSaving, setIsSaving] = useState(false);

  async function handleSave() {
    setIsSaving(true);
    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, progress }),
      });
      if (!res.ok) throw new Error();
      toast.success("Projet mis à jour !");
    } catch {
      toast.error("Erreur lors de la mise à jour");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Gestion du projet
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="status">Statut</Label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors"
          >
            {PROJECT_STATUSES.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="progress">Progression ({progress}%)</Label>
          <Input
            id="progress"
            type="range"
            min={0}
            max={100}
            value={progress}
            onChange={(e) => setProgress(parseInt(e.target.value))}
            className="cursor-pointer"
          />
        </div>
        <Button onClick={handleSave} disabled={isSaving} className="w-full">
          {isSaving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
          Sauvegarder
        </Button>
      </CardContent>
    </Card>
  );
}
