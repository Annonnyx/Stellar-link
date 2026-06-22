import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Découvrez nos projets et réalisations.",
};

export default function PortfolioPage() {
  return (
    <section className="py-24">
      <div className="container">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">Portfolio</h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Découvrez une sélection de nos projets récents.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="aspect-video rounded-xl bg-muted border border-border/40 flex items-center justify-center">
              <span className="text-muted-foreground text-sm">Projet {i}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
