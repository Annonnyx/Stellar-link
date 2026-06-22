import { prisma } from "@nova-studio/database";
import { ProjectsTable } from "@/components/projects-table";

export const revalidate = 0;

async function getProjects() {
  return prisma.project.findMany({
    include: { ticket: { select: { code: true, submitterName: true } } },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
}

export default async function AdminProjectsPage() {
  const projects = await getProjects();

  return <ProjectsTable projects={projects} />;
}
