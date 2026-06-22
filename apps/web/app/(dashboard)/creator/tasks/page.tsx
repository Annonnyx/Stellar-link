import { cookies } from "next/headers";
import { prisma } from "@nova-studio/database";
import { AvailableTasks } from "@/components/available-tasks";

export const revalidate = 0;

async function getCurrentCreator() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("next-auth.session-token")?.value;
  if (!sessionCookie) return null;
  const user = await prisma.user.findFirst();
  if (!user) return null;
  return prisma.creatorProfile.findUnique({
    where: { userId: user.id },
    include: { skills: { include: { skill: true } } },
  });
}

async function getAvailableTasks() {
  return prisma.ticket.findMany({
    where: {
      status: { in: ["VERIFIED", "IN_REVIEW"] },
      type: "SERVICE",
      assignments: { none: {} },
    },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      code: true,
      type: true,
      status: true,
      submitterName: true,
      estimatedPriceMin: true,
      estimatedPriceMax: true,
      createdAt: true,
      formData: true,
    },
    take: 50,
  });
}

export default async function CreatorTasksPage() {
  const creator = await getCurrentCreator();
  if (!creator) return <p>Erreur de chargement</p>;

  const tasks = await getAvailableTasks();

  return (
    <AvailableTasks
      tasks={tasks.map((t) => ({
        id: t.id,
        code: t.code,
        submitterName: t.submitterName,
        estimatedPriceMin: t.estimatedPriceMin ? Number(t.estimatedPriceMin) : null,
        estimatedPriceMax: t.estimatedPriceMax ? Number(t.estimatedPriceMax) : null,
        createdAt: t.createdAt,
        formData: t.formData as Record<string, unknown> | null,
      }))}
      creatorId={creator.id}
      creatorUserId={creator.userId}
    />
  );
}
