import { notFound } from "next/navigation";
import { prisma } from "@nova-studio/database";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Briefcase, Calendar, ArrowLeft } from "lucide-react";
import Link from "next/link";

export const revalidate = 0;

async function getCreator(id: string) {
  try {
    return await prisma.creatorProfile.findUnique({
      where: { id },
      include: {
        user: { select: { name: true, email: true, image: true } },
        skills: { include: { skill: true } },
      },
    });
  } catch { return null; }
}

export default async function CreatorDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const creator = await getCreator(id);
  if (!creator) return notFound();

  return (
    <section className="py-24">
      <div className="container max-w-3xl mx-auto">
        <Button variant="ghost" size="sm" className="mb-6" asChild>
          <Link href="/creators"><ArrowLeft className="h-4 w-4 mr-2" />Retour aux créateurs</Link>
        </Button>

        <Card className="border-border/40 mb-6">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-white font-bold text-2xl shrink-0">
                {creator.user?.name?.charAt(0).toUpperCase() || "N"}
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold">{creator.user?.name || "Créateur"}</h1>
                <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />{creator.averageRating ? Number(creator.averageRating).toFixed(1) : "N/A"}</span>
                  <span className="flex items-center gap-1"><Briefcase className="h-3.5 w-3.5" />{creator.completedProjects} projets</span>
                  <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{creator.yearsExperience} ans d&apos;expérience</span>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <h3 className="font-medium mb-2">Bio</h3>
                <p className="text-muted-foreground text-sm">{creator.bio || "Aucune bio renseignée."}</p>
              </div>

              <div>
                <h3 className="font-medium mb-2">Compétences</h3>
                <div className="flex flex-wrap gap-2">
                  {creator.skills.map((s: any) => (
                    <Badge key={s.id} variant="secondary">{s.skill?.name}</Badge>
                  ))}
                  {creator.skills.length === 0 && <span className="text-sm text-muted-foreground">Aucune compétence listée.</span>}
                </div>
              </div>

              {creator.hourlyRate && (
                <div>
                  <h3 className="font-medium mb-1">Taux horaire</h3>
                  <p className="text-lg font-semibold">{String(creator.hourlyRate)}€/h</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

      </div>
    </section>
  );
}
