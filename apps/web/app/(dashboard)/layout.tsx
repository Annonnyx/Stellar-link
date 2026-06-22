import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@nova-studio/database";
import { SidebarNav } from "@/components/sidebar-nav";
import { NotificationBell } from "@/components/notification-bell";

async function getUser() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("next-auth.session-token")?.value;
  if (!sessionCookie) return null;
  try {
    return await prisma.user.findFirst();
  } catch { return null; }
}

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser();
  if (!user) redirect("/");

  return (
    <div className="flex h-screen">
      <SidebarNav />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-14 border-b border-border/40 flex items-center justify-between px-6">
          <h1 className="font-semibold">Administration</h1>
          <div className="flex items-center gap-4">
            <NotificationBell />
            <div className="text-sm text-muted-foreground">{user.name || user.email}</div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
