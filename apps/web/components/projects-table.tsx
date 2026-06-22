"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FolderOpen, Search } from "lucide-react";

interface Project {
  id: string;
  title: string;
  description: string | null;
  status: string;
  createdAt: Date | string;
  ticket?: {
    code: string;
    submitterName: string;
  };
}

export function ProjectsTable({ projects: initialProjects }: { projects: Project[] }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const filtered = initialProjects.filter((p) => {
    const matchesSearch =
      search === "" ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Projets</h2>
          <p className="text-muted-foreground">Gérez tous les projets de l'agence.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderOpen className="h-5 w-5" />
            Tous les projets
          </CardTitle>
          <div className="flex gap-4 mt-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par titre, description..."
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
              <option value="DRAFT">Brouillon</option>
              <option value="IN_PROGRESS">En cours</option>
              <option value="ON_HOLD">En pause</option>
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
                  <th className="text-left py-2 px-4 font-medium text-muted-foreground">Titre</th>
                  <th className="text-left py-2 px-4 font-medium text-muted-foreground">Ticket</th>
                  <th className="text-left py-2 px-4 font-medium text-muted-foreground">Statut</th>
                  <th className="text-left py-2 px-4 font-medium text-muted-foreground">Date</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((project) => (
                  <tr key={project.id} className="border-b border-border/20 hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4 font-medium"><Link href={`/admin/projects/${project.id}`} className="hover:text-violet-400 transition-colors">{project.title}</Link></td>
                    <td className="py-3 px-4 text-muted-foreground">{project.ticket?.code || "—"}</td>
                    <td className="py-3 px-4">
                      <Badge variant={project.status === "COMPLETED" ? "default" : project.status === "IN_PROGRESS" ? "secondary" : "outline"}>
                        {project.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground text-xs">{new Date(project.createdAt).toLocaleDateString("fr-FR")}</td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={4} className="py-8 text-center text-muted-foreground">Aucun projet trouvé</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
