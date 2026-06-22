import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description: "Politique de confidentialité de Nova Studio",
};

export default function PrivacyPage() {
  return (
    <section className="py-24">
      <div className="container max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Politique de confidentialité</h1>
        <div className="prose prose-invert max-w-none">
          <p className="text-muted-foreground mb-6">Dernière mise à jour : {new Date().toLocaleDateString("fr-FR")}</p>
          <h2 className="text-xl font-semibold mt-8 mb-4">1. Données collectées</h2>
          <p className="text-muted-foreground mb-4">Nous collectons les informations nécessaires à la fourniture de nos services : nom, email, informations de projet.</p>
          <h2 className="text-xl font-semibold mt-8 mb-4">2. Utilisation</h2>
          <p className="text-muted-foreground mb-4">Vos données sont utilisées uniquement pour gérer vos projets et communiquer avec vous.</p>
          <h2 className="text-xl font-semibold mt-8 mb-4">3. Conservation</h2>
          <p className="text-muted-foreground mb-4">Les données sont conservées pendant la durée nécessaire à la réalisation des services.</p>
        </div>
      </div>
    </section>
  );
}
