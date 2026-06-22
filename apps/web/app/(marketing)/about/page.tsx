import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "À propos",
  description: "Découvrez Nova Studio, l'agence créative nouvelle génération.",
};

export default function AboutPage() {
  return (
    <section className="py-24">
      <div className="container max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">À propos de Nova Studio</h1>
        <div className="prose prose-invert max-w-none">
          <p className="text-lg text-muted-foreground mb-6">
            Nova Studio est une agence créative nouvelle génération qui connecte les meilleurs talents
            aux projets qui comptent. Notre mission est de rendre l&apos;excellence créative accessible à tous.
          </p>
          <h2 className="text-2xl font-semibold mt-12 mb-4">Notre vision</h2>
          <p className="text-muted-foreground mb-6">
            Nous croyons que chaque projet mérite l&apos;excellence. Que vous soyez une startup en phase de
            lancement ou une entreprise établie, nous mettons à votre disposition un réseau de créateurs
            experts pour donner vie à vos idées.
          </p>
          <h2 className="text-2xl font-semibold mt-12 mb-4">Notre équipe</h2>
          <p className="text-muted-foreground mb-6">
            Notre réseau compte plus de 40 créateurs actifs dans tous les domaines du digital :
            montage vidéo, 3D, développement, sound design, graphisme et plus encore.
          </p>
          <h2 className="text-2xl font-semibold mt-12 mb-4">Nos valeurs</h2>
          <ul className="space-y-2 text-muted-foreground">
            <li><strong>Excellence</strong> — Nous ne concédons jamais sur la qualité.</li>
            <li><strong>Transparence</strong> — Prix clairs, processus transparents.</li>
            <li><strong>Collaboration</strong> — Vous faites partie de l&apos;équipe.</li>
            <li><strong>Innovation</strong> — Toujours à la pointe des tendances.</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
