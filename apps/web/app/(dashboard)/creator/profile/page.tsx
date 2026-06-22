"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { User, Loader2 } from "lucide-react";

interface Profile {
  id: string;
  displayName: string;
  bio: string;
  country: string;
  city: string;
  availability: string;
  hoursPerWeek: number;
  portfolioUrls: string[];
  softwareTools: string[];
}

export default function CreatorProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetch("/api/creator/profile")
      .then((res) => res.json())
      .then((data) => setProfile(data.profile))
      .catch(() => toast.error("Erreur de chargement"))
      .finally(() => setIsLoading(false));
  }, []);

  async function handleSave() {
    if (!profile) return;
    setIsSaving(true);
    try {
      const res = await fetch("/api/creator/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      if (!res.ok) throw new Error();
      toast.success("Profil mis à jour !");
    } catch {
      toast.error("Erreur lors de la sauvegarde");
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!profile) {
    return <p className="text-muted-foreground text-center py-12">Profil introuvable</p>;
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Mon profil</h2>
        <p className="text-muted-foreground">Modifiez vos informations et préférences.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Informations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="displayName">Nom d&apos;affichage</Label>
            <Input
              id="displayName"
              value={profile.displayName}
              onChange={(e) => setProfile({ ...profile, displayName: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio">Biographie</Label>
            <Textarea
              id="bio"
              value={profile.bio || ""}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              rows={4}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="country">Pays</Label>
              <Input
                id="country"
                value={profile.country || ""}
                onChange={(e) => setProfile({ ...profile, country: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">Ville</Label>
              <Input
                id="city"
                value={profile.city || ""}
                onChange={(e) => setProfile({ ...profile, city: e.target.value })}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="availability">Disponibilité</Label>
              <select
                id="availability"
                value={profile.availability}
                onChange={(e) => setProfile({ ...profile, availability: e.target.value })}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors"
              >
                <option value="FULL_TIME">Temps plein</option>
                <option value="PART_TIME">Mi-temps</option>
                <option value="OCCASIONAL">Occasionnel</option>
                <option value="WEEKEND">Week-end</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="hoursPerWeek">Heures/semaine</Label>
              <Input
                id="hoursPerWeek"
                type="number"
                value={profile.hoursPerWeek}
                onChange={(e) => setProfile({ ...profile, hoursPerWeek: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>

          {profile.softwareTools.length > 0 && (
            <div className="space-y-2">
              <Label>Outils</Label>
              <div className="flex flex-wrap gap-1">
                {profile.softwareTools.map((tool) => (
                  <Badge key={tool} variant="secondary">{tool}</Badge>
                ))}
              </div>
            </div>
          )}

          <Button onClick={handleSave} disabled={isSaving} className="w-full">
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Sauvegarder
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
