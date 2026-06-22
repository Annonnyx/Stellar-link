import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conditions générales d'utilisation",
  description: "CGU de Nova Studio",
};

export default function TermsPage() {
  return (
    <section className="py-24">
      <div className="container max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Conditions générales d&apos;utilisation</h1>
        <div className="prose prose-invert max-w-none">
          <p className="text-muted-foreground mb-6">Dernière mise à jour : {new Date().toLocaleDateString("fr-FR")}</p>
          <h2 className="text-xl font-semibold mt-8 mb-4">1. Présentation</h2>
          <p className="text-muted-foreground mb-4">Nova Studio est une agence créative qui met en relation des clients avec des créateurs freelances.</p>
          <h2 className="text-xl font-semibold mt-8 mb-4">2. Services</h2>
          <p className="text-muted-foreground mb-4">Nous proposons des services de montage vidéo, 3D, développement, sound design, graphisme et traduction.</p>
          <h2 className="text-xl font-semibold mt-8 mb-4">3. Obligations</h2>
          <p className="text-muted-foreground mb-4">Les utilisateurs s&apos;engagent à fournir des informations exactes et à respecter les délais convenus.</p>
          <h2 className="text-xl font-semibold mt-8 mb-4">4. Paiement</h2>
          <p className="text-muted-foreground mb-4">Les paiements sont sécurisés via Stripe. Les factures sont émises automatiquement.</p>
        </div>
      </div>
    </section>
  );
}
