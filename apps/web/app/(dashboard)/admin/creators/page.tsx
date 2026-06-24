import { prisma } from "@nova-studio/database";
import { CreatorsTable } from "@/components/creators-table";

export const revalidate = 0;

async function getCreators() {
  const creators = await prisma.creatorProfile.findMany({
    include: { user: { select: { name: true, email: true, image: true } }, skills: { include: { skill: true } } },
    orderBy: { joinedAt: "desc" },
    take: 50,
  });

  return creators.map((c: any) => ({
    id: c.id,
    name: c.user?.name || "Inconnu",
    email: c.user?.email || "",
    skills: c.skills.map((s: any) => s.skill.name),
    experienceLevel: `${c.yearsExperience} ans`,
    rating: c.averageRating ? Number(c.averageRating) : null,
    status: c.isActive ? "ACTIVE" : "INACTIVE",
    createdAt: c.joinedAt,
  }));
}

export default async function AdminCreatorsPage() {
  const creators = await getCreators();

  return <CreatorsTable creators={creators} />;
}
