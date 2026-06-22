"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function AdminSettingsPage() {
  const [isSaving, setIsSaving] = useState(false);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    try {
      const formData = new FormData(e.target as HTMLFormElement);
      const data = Object.fromEntries(formData);
      
      await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      toast.success("Paramètres enregistrés");
    } catch (error) {
      toast.error("Erreur lors de l'enregistrement");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Paramètres</h2>
        <p className="text-muted-foreground">Configuration de l&apos;agence.</p>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Général</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="agencyName">Nom de l&apos;agence</Label>
              <Input id="agencyName" name="agencyName" defaultValue="Nova Studio" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactEmail">Email de contact</Label>
              <Input id="contactEmail" name="contactEmail" defaultValue="contact@novastudio.fr" type="email" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="discordWebhook">Webhook Discord notifications</Label>
              <Input id="discordWebhook" name="discordWebhook" defaultValue="" placeholder="https://discord.com/api/webhooks/..." />
            </div>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Tarification</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="serviceFee">Frais de service (%)</Label>
              <Input id="serviceFee" name="serviceFee" defaultValue="15" type="number" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="minEstimate">Estimation minimum (€)</Label>
              <Input id="minEstimate" name="minEstimate" defaultValue="300" type="number" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="urgencyMultiplier">Multiplicateur urgence</Label>
              <Input id="urgencyMultiplier" name="urgencyMultiplier" defaultValue="1.5" type="number" step="0.1" />
            </div>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
