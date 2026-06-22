import type { Metadata } from "next";
import Link from "next/link";
import { SERVICES } from "@nova-studio/shared";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Film, Box, Code, Music, Palette, Languages, MessageSquare } from "lucide-react";

export const metadata: Metadata = {
  title: "Nos Services",
  description: "Découvrez tous les services proposés par Nova Studio.",
};

const iconMap: Record<string, React.ElementType> = {
  Film, Box, Code, Music, Palette, Languages, MessageSquare,
};

export default function ServicesPage() {
  return (
    <section className="py-24">
      <div className="container">
        <div className="max-w-2xl mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Nos Services</h1>
          <p className="text-lg text-muted-foreground">
            Une équipe de créateurs experts couvre tous les domaines du digital pour donner vie à vos projets.
          </p>
        </div>

        <div className="grid gap-8">
          {SERVICES.map((service) => {
            const Icon = iconMap[service.icon] || Film;
            return (
              <Card
                key={service.category}
                id={service.category.toLowerCase()}
                className="border-border/40 bg-card/50 hover:border-violet-500/30 transition-all"
              >
                <CardContent className="p-8 flex flex-col md:flex-row gap-6 items-start">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-500">
                    <Icon className="h-7 w-7" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold mb-2">{service.label}</h2>
                    <p className="text-muted-foreground mb-4">{service.description}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>
                        À partir de{" "}
                        <span className="font-semibold text-foreground">
                          {service.basePriceMin}€
                        </span>
                        /{service.unit}
                      </span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" asChild className="shrink-0">
                    <Link href={`/request?service=${service.category}`}>
                      Demander
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
