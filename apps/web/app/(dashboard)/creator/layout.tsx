import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@nova-studio/database";
import { CreatorSidebarNav } from "@/components/creator-sidebar-nav";

async function getCreator() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("next-auth.session-token")?.value;
  if (!sessionCookie) return null;
  try {
    const user = await prisma.user.findFirst();
    if (!user) return null;
    const profile = await prisma.creatorProfile.findUnique({
      where: { userId: user.id },
      include: { user: { select: { name: true, email: true, image: true } } },
    });
    return profile;
  } catch { return null; }
}

export default async function CreatorLayout({ children }: { children: React.ReactNode }) {
  const creator = await getCreator();
  if (!creator) redirect("/");

  return (
    <div className="flex h-screen">
      <CreatorSidebarNav creatorName={creator.displayName || creator.user?.name || "Créateur"} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-14 border-b border-border/40 flex items-center justify-between px-6">
          <h1 className="font-semibold">Espace Créateur</h1>
          <div className="text-sm text-muted-foreground">{creator.displayName}</div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
