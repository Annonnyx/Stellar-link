"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Ticket, Users, UserCircle, FolderOpen, CreditCard, Settings, LogOut, Sparkles } from "lucide-react";

const sidebarItems = [
  { icon: LayoutDashboard, href: "/admin", label: "Dashboard" },
  { icon: Ticket, href: "/admin/tickets", label: "Tickets" },
  { icon: UserCircle, href: "/admin/clients", label: "Clients" },
  { icon: Users, href: "/admin/creators", label: "Créateurs" },
  { icon: FolderOpen, href: "/admin/projects", label: "Projets" },
  { icon: CreditCard, href: "/admin/invoices", label: "Factures" },
  { icon: Settings, href: "/admin/settings", label: "Paramètres" },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-border/40 bg-card flex flex-col">
      <div className="p-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-blue-500">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <span>Nova<span className="text-gradient">Studio</span></span>
        </Link>
      </div>
      <nav className="flex-1 px-3 space-y-1">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
          return (
            <Link key={item.href} href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${isActive ? "bg-violet-500/10 text-violet-400 font-medium" : "text-muted-foreground hover:bg-accent hover:text-foreground"}`}>
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-3 border-t border-border/40">
        <a href="/api/auth/signout"
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-accent transition-colors">
          <LogOut className="h-4 w-4" />
          Déconnexion
        </a>
      </div>
    </aside>
  );
}
