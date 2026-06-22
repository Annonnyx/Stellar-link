import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import { TRPCProvider } from "@/components/trpc-provider";

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://novastudio.fr";

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: "Nova Studio — Agence Créative",
    template: "%s | Nova Studio",
  },
  description:
    "L'agence créative qui connecte les meilleurs talents aux projets qui comptent. Montage vidéo, 3D, développement, sound design, graphisme et plus.",
  keywords: [
    "agence créative",
    "freelance",
    "montage vidéo",
    "3D",
    "développement",
    "sound design",
    "graphisme",
    "traduction",
  ],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "Nova Studio",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="dark" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <TRPCProvider>
          {children}
          <Toaster richColors position="bottom-right" />
        </TRPCProvider>
      </body>
    </html>
  );
}
