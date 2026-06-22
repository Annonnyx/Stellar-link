import { cookies } from "next/headers";
import { prisma } from "@nova-studio/database";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ListChecks, FolderOpen, Wallet, Star } from "lucide-react";
import Link from "next/link";

export const revalidate = 0;

async function getCreatorData() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("next-auth.session-token")?.value;
  if (!sessionCookie) return null;

  const user = await prisma.user.findFirst();
  if (!user) return null;

  const profile = await prisma.creatorProfile.findUnique({
    where: { userId: user.id },
    include: {
      assignedTickets: {
        include: {
          ticket: {
            select: { id: true, code: true, type: true, status: true, submitterName: true, createdAt: true },
          },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!profile) return null;

  const availableTasks = await prisma.ticket.count({
    where: {
      status: { in: ["VERIFIED", "IN_REVIEW"] },
      type: "SERVICE",
      assignments: { none: {} },
    },
  });

  return { profile, availableTasks };
}

export default async function CreatorDashboardPage() {
  const data = await getCreatorData();
  if (!data) return <p>Erreur de chargement</p>;

  const { profile, availableTasks } = data;
  const activeTasks = profile.assignedTickets.filter(
    (a) => !["COMPLETED", "CANCELLED", "REJECTED"].includes(a.ticket.status)
  );
  const completedTasks = profile.assignedTickets.filter(
    (a) => a.ticket.status === "COMPLETED"
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Bonjour, {profile.displayName}</h2>
        <p className="text-muted-foreground">Voici un aperçu de votre activité.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tâches disponibles</CardTitle>
            <ListChecks className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{availableTasks}</div>
            <Link href="/creator/tasks" className="text-xs text-violet-400 hover:underline">Voir les tâches</Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tâches en cours</CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeTasks.length}</div>
            <p className="text-xs text-muted-foreground">{completedTasks.length} terminées</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projets complétés</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profile.completedProjects}</div>
            <p className="text-xs text-muted-foreground">
              Note: {profile.averageRating ? `${Number(profile.averageRating).toFixed(1)}/5` : "N/A"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Disponibilité</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profile.hoursPerWeek}h/sem</div>
            <p className="text-xs text-muted-foreground">{profile.availability}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tâches actives</CardTitle>
        </CardHeader>
        <CardContent>
          {activeTasks.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">
              Aucune tâche en cours.{" "}
              <Link href="/creator/tasks" className="text-violet-400 hover:underline">Voir les tâches disponibles</Link>
            </p>
          ) : (
            <div className="space-y-3">
              {activeTasks.map((a) => (
                <div key={a.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div>
                    <p className="text-sm font-medium">{a.ticket.submitterName}</p>
                    <p className="text-xs text-muted-foreground font-mono">{a.ticket.code}</p>
                  </div>
                  <Badge variant="secondary">{a.ticket.status}</Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
