import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: "Mentions légales de Nova Studio",
};

export default function MentionsPage() {
  return (
    <section className="py-24">
      <div className="container max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Mentions légales</h1>
        <div className="prose prose-invert max-w-none">
          <h2 className="text-xl font-semibold mt-8 mb-4">Éditeur</h2>
          <p className="text-muted-foreground mb-4">Nova Studio — Agence créative</p>
          <h2 className="text-xl font-semibold mt-8 mb-4">Hébergement</h2>
          <p className="text-muted-foreground mb-4">Hébergement cloud</p>
          <h2 className="text-xl font-semibold mt-8 mb-4">Contact</h2>
          <p className="text-muted-foreground mb-4">Email : contact@novastudio.com</p>
        </div>
      </div>
    </section>
  );
}
