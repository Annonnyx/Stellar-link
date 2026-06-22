import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-[calc(100vh-200px)] flex-col items-center justify-center text-center px-4">
      <h1 className="text-6xl font-bold text-gradient mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-2">Page introuvable</h2>
      <p className="text-muted-foreground mb-8 max-w-sm">
        La page que vous recherchez n&apos;existe pas ou a été déplacée.
      </p>
      <Button variant="gradient" asChild>
        <Link href="/">Retour à l&apos;accueil</Link>
      </Button>
    </div>
  );
}
