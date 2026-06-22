"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Search } from "lucide-react";

interface Creator {
  id: string;
  name: string;
  email: string;
  skills: string[];
  experienceLevel: string;
  rating: number | null;
  status: string;
  createdAt: Date | string;
}

export function CreatorsTable({ creators: initialCreators }: { creators: Creator[] }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const filtered = initialCreators.filter((c) => {
    const matchesSearch =
      search === "" ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.skills.some((s) => s.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = statusFilter === "ALL" || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Créateurs</h2>
          <p className="text-muted-foreground">Gérez tous les créateurs de l'agence.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Tous les créateurs
          </CardTitle>
          <div className="flex gap-4 mt-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par nom, email, compétences..."
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
              <option value="ACTIVE">Actif</option>
              <option value="INACTIVE">Inactif</option>
              <option value="PENDING">En attente</option>
            </select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/40">
                  <th className="text-left py-2 px-4 font-medium text-muted-foreground">Nom</th>
                  <th className="text-left py-2 px-4 font-medium text-muted-foreground">Email</th>
                  <th className="text-left py-2 px-4 font-medium text-muted-foreground">Compétences</th>
                  <th className="text-left py-2 px-4 font-medium text-muted-foreground">Expérience</th>
                  <th className="text-left py-2 px-4 font-medium text-muted-foreground">Note</th>
                  <th className="text-left py-2 px-4 font-medium text-muted-foreground">Statut</th>
                  <th className="text-left py-2 px-4 font-medium text-muted-foreground">Date</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((creator) => (
                  <tr key={creator.id} className="border-b border-border/20 hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4 font-medium">{creator.name}</td>
                    <td className="py-3 px-4 text-muted-foreground">{creator.email}</td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {creator.skills.slice(0, 3).map((skill) => (
                          <Badge key={skill} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {creator.skills.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{creator.skills.length - 3}
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">{creator.experienceLevel}</td>
                    <td className="py-3 px-4">
                      {creator.rating ? (
                        <div className="flex items-center gap-1">
                          <span className="text-yellow-500">★</span>
                          <span>{creator.rating.toFixed(1)}</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={creator.status === "ACTIVE" ? "default" : creator.status === "PENDING" ? "secondary" : "outline"}>
                        {creator.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground text-xs">{new Date(creator.createdAt).toLocaleDateString("fr-FR")}</td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={7} className="py-8 text-center text-muted-foreground">Aucun créateur trouvé</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
