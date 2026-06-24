import { cookies } from "next/headers";
import { prisma } from "@nova-studio/database";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wallet, TrendingUp } from "lucide-react";

export const revalidate = 0;

async function getEarnings() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("next-auth.session-token")?.value;
  if (!sessionCookie) return { invoices: [], total: 0, pending: 0 };

  const user = await prisma.user.findFirst();
  if (!user) return { invoices: [], total: 0, pending: 0 };

  const assignments = await prisma.ticketAssignment.findMany({
    where: { userId: user.id },
    select: { ticketId: true },
  });

  const ticketIds = assignments.map((a: any) => a.ticketId);

  const invoices = await prisma.invoice.findMany({
    where: { ticketId: { in: ticketIds } },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      number: true,
      totalAmount: true,
      status: true,
      createdAt: true,
      clientName: true,
    },
  });

  const total = invoices
    .filter((i: any) => i.status === "PAID")
    .reduce((sum: number, i: any) => sum + Number(i.totalAmount), 0);

  const pending = invoices
    .filter((i: any) => i.status === "SENT")
    .reduce((sum: number, i: any) => sum + Number(i.totalAmount), 0);

  return { invoices, total, pending };
}

export default async function CreatorEarningsPage() {
  const { invoices, total, pending } = await getEarnings();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Revenus</h2>
        <p className="text-muted-foreground">Historique de vos paiements.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total perçu</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{total.toFixed(0)}€</div>
            <p className="text-xs text-muted-foreground">Factures payées</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En attente</CardTitle>
            <Wallet className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pending.toFixed(0)}€</div>
            <p className="text-xs text-muted-foreground">Factures envoyées</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Historique</CardTitle></CardHeader>
        <CardContent>
          {invoices.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">Aucune facture associée.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/40">
                    <th className="text-left py-2 px-4 font-medium text-muted-foreground">N°</th>
                    <th className="text-left py-2 px-4 font-medium text-muted-foreground">Client</th>
                    <th className="text-left py-2 px-4 font-medium text-muted-foreground">Montant</th>
                    <th className="text-left py-2 px-4 font-medium text-muted-foreground">Statut</th>
                    <th className="text-left py-2 px-4 font-medium text-muted-foreground">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((inv: any) => (
                    <tr key={inv.id} className="border-b border-border/20">
                      <td className="py-3 px-4 font-mono text-xs">{inv.number}</td>
                      <td className="py-3 px-4">{inv.clientName}</td>
                      <td className="py-3 px-4 font-medium">{Number(inv.totalAmount).toFixed(2)}€</td>
                      <td className="py-3 px-4">
                        <Badge variant={inv.status === "PAID" ? "default" : inv.status === "SENT" ? "secondary" : "outline"}>
                          {inv.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground text-xs">
                        {new Date(inv.createdAt).toLocaleDateString("fr-FR")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
