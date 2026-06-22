import { prisma } from "@nova-studio/database";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

export const revalidate = 0;

async function getCreators() {
  try {
    return await prisma.creatorProfile.findMany({
      where: { isVerified: true },
      include: { user: { select: { name: true, image: true } }, skills: { include: { skill: true } } },
      orderBy: { averageRating: "desc" },
      take: 50,
    });
  } catch {
    return [];
  }
}

export default async function CreatorsPage() {
  const creators = await getCreators();

  return (
    <section className="py-24">
      <div className="container">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Nos Créateurs</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">Découvrez les talents de notre réseau.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {creators.map((creator: any) => (
            <a key={creator.id} href={`/creators/${creator.id}`} className="block">
            <Card className="border-border/40 overflow-hidden hover:border-violet-500/30 transition-colors cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-white font-bold text-lg">
                    {creator.user?.name?.charAt(0).toUpperCase() || "N"}
                  </div>
                  <div>
                    <h3 className="font-semibold">{creator.user?.name || "Créateur"}</h3>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span>{creator.averageRating ? Number(creator.averageRating).toFixed(1) : "N/A"}</span>
                      <span>· {creator.completedProjects} projets</span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{creator.bio || "Aucune bio"}</p>
                <div className="flex flex-wrap gap-1.5">
                  {creator.skills.slice(0, 4).map((s: any) => (
                    <Badge key={s.id} variant="secondary" className="text-xs">{s.skill?.name}</Badge>
                  ))}
                </div>
                {creator.hourlyRate && (
                  <p className="mt-3 text-sm font-medium">{creator.hourlyRate}€/h</p>
                )}
              </CardContent>
            </Card>
            </a>
          ))}
          {creators.length === 0 && (
            <div className="col-span-full text-center text-muted-foreground py-12">Aucun créateur vérifié pour le moment.</div>
          )}
        </div>
      </div>
    </section>
  );
}
