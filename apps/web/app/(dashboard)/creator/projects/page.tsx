import { cookies } from "next/headers";
import { prisma } from "@nova-studio/database";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FolderOpen } from "lucide-react";

export const revalidate = 0;

async function getMyProjects() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("next-auth.session-token")?.value;
  if (!sessionCookie) return [];

  const user = await prisma.user.findFirst();
  if (!user) return [];

  const assignments = await prisma.ticketAssignment.findMany({
    where: { userId: user.id },
    include: {
      ticket: {
        include: {
          project: true,
        },
      },
    },
  });

  return assignments
    .filter((a) => a.ticket.project)
    .map((a) => a.ticket.project!);
}

export default async function CreatorProjectsPage() {
  const projects = await getMyProjects();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Mes projets</h2>
        <p className="text-muted-foreground">Projets sur lesquels vous êtes assigné.</p>
      </div>

      {projects.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FolderOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Aucun projet pour le moment.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {projects.map((project) => (
            <Card key={project.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{project.title}</CardTitle>
                  <Badge variant={project.status === "COMPLETED" ? "default" : project.status === "IN_PROGRESS" ? "secondary" : "outline"}>
                    {project.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {project.description && (
                  <p className="text-sm text-muted-foreground">{project.description.slice(0, 200)}</p>
                )}
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>Progression: {project.progress}%</span>
                  {project.deadline && <span>Deadline: {new Date(project.deadline).toLocaleDateString("fr-FR")}</span>}
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-violet-500 h-2 rounded-full transition-all"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
