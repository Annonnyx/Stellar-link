import { prisma } from "@nova-studio/database";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TicketStatus } from "@/components/ticket-status-badge";
import { TicketStatusChart } from "@/components/ticket-status-chart";
import { RevenueChart } from "@/components/revenue-chart";
import { Ticket, Users, FolderOpen, CreditCard, TrendingUp } from "lucide-react";

export const revalidate = 0;

async function getStats() {
  const [
    totalTickets,
    pendingTickets,
    verifiedTickets,
    totalProjects,
    activeProjects,
    totalCreators,
    totalRevenue,
    statusDistribution,
  ] = await Promise.all([
    prisma.ticket.count(),
    prisma.ticket.count({ where: { status: "PENDING_VERIFICATION" } }),
    prisma.ticket.count({ where: { status: "VERIFIED" } }),
    prisma.project.count(),
    prisma.project.count({ where: { status: { in: ["IN_PROGRESS", "IN_REVISION", "PENDING_APPROVAL"] } } }),
    prisma.creatorProfile.count(),
    prisma.invoice.aggregate({ _sum: { totalAmount: true }, where: { status: "PAID" } }),
    prisma.ticket.groupBy({ by: ["status"], _count: { status: true } }),
  ]);

  return {
    totalTickets,
    pendingTickets,
    verifiedTickets,
    totalProjects,
    activeProjects,
    totalCreators,
    totalRevenue: Number(totalRevenue._sum.totalAmount || 0),
    statusDistribution: statusDistribution.map((s) => ({ status: s.status, count: s._count.status })),
  };
}

async function getRecentTickets() {
  return prisma.ticket.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    select: {
      id: true, code: true, type: true, status: true,
      submitterName: true, submitterEmail: true,
      createdAt: true,
    },
  });
}

export default async function AdminDashboardPage() {
  const stats = await getStats();
  const recentTickets = await getRecentTickets();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">Vue d&apos;ensemble de votre agence.</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tickets totaux</CardTitle>
            <Ticket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTickets}</div>
            <p className="text-xs text-muted-foreground">{stats.pendingTickets} en attente de vérification</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projets actifs</CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeProjects}</div>
            <p className="text-xs text-muted-foreground">{stats.totalProjects} projets totaux</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Créateurs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCreators}</div>
            <p className="text-xs text-muted-foreground">Dans le réseau</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenus</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRevenue.toFixed(0)}€</div>
            <p className="text-xs text-muted-foreground">Factures payées</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TicketStatusChart data={stats.statusDistribution} />
        <RevenueChart />
      </div>

      {/* Recent tickets */}
      <div>
      <Card>
        <CardHeader>
          <CardTitle>Tickets récents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/40">
                  <th className="text-left py-2 px-4 font-medium text-muted-foreground">Code</th>
                  <th className="text-left py-2 px-4 font-medium text-muted-foreground">Type</th>
                  <th className="text-left py-2 px-4 font-medium text-muted-foreground">Nom</th>
                  <th className="text-left py-2 px-4 font-medium text-muted-foreground">Email</th>
                  <th className="text-left py-2 px-4 font-medium text-muted-foreground">Statut</th>
                  <th className="text-left py-2 px-4 font-medium text-muted-foreground">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentTickets.map((ticket) => (
                  <tr key={ticket.id} className="border-b border-border/20 hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4 font-mono text-xs">{ticket.code}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${ticket.type === "SERVICE" ? "bg-blue-500/10 text-blue-500" : ticket.type === "JOIN" ? "bg-violet-500/10 text-violet-500" : "bg-gray-500/10 text-gray-500"}`}>
                        {ticket.type === "SERVICE" ? "Service" : ticket.type === "JOIN" ? "Rejoindre" : "Contact"}
                      </span>
                    </td>
                    <td className="py-3 px-4">{ticket.submitterName}</td>
                    <td className="py-3 px-4 text-muted-foreground">{ticket.submitterEmail}</td>
                    <td className="py-3 px-4"><TicketStatus status={ticket.status} /></td>
                    <td className="py-3 px-4 text-muted-foreground text-xs">{new Date(ticket.createdAt).toLocaleDateString("fr-FR")}</td>
                  </tr>
                ))}
                {recentTickets.length === 0 && (
                  <tr><td colSpan={6} className="py-8 text-center text-muted-foreground">Aucun ticket</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}
