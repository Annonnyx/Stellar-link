import Link from "next/link";
import { Sparkles } from "lucide-react";

const footerLinks = {
  Services: [
    { href: "/services#video", label: "Montage Vidéo" },
    { href: "/services#3d", label: "3D" },
    { href: "/services#dev", label: "Développement" },
    { href: "/services#sound", label: "Sound Design" },
    { href: "/services#design", label: "Graphisme" },
    { href: "/services#translation", label: "Traduction" },
  ],
  Agence: [
    { href: "/about", label: "À propos" },
    { href: "/creators", label: "Créateurs" },
    { href: "/portfolio", label: "Portfolio" },
    { href: "/join", label: "Rejoindre l'équipe" },
    { href: "/contact", label: "Contact" },
  ],
  Légal: [
    { href: "/legal/terms", label: "CGU" },
    { href: "/legal/privacy", label: "Confidentialité" },
    { href: "/legal/mentions", label: "Mentions légales" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 font-bold text-lg mb-4">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-blue-500">
                <Sparkles className="h-3.5 w-3.5 text-white" />
              </div>
              <span>
                Nova<span className="text-gradient">Studio</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-[200px]">
              L&apos;agence créative qui connecte les meilleurs talents aux projets qui comptent.
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="font-semibold text-sm mb-3">{title}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Nova Studio. Tous droits réservés.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://discord.gg/novastudio"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Discord
            </a>
            <a
              href="https://twitter.com/novastudio"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Twitter
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
