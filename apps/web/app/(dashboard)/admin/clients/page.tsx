import { prisma } from "@nova-studio/database";
import { ClientsTable } from "@/components/clients-table";

export const revalidate = 0;

async function getClients() {
  const tickets = await prisma.ticket.findMany({
    where: { type: "SERVICE" },
    select: {
      submitterName: true,
      submitterEmail: true,
      submitterCountry: true,
      createdAt: true,
      status: true,
      code: true,
      invoices: {
        select: { totalAmount: true, status: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const clientMap = new Map<string, {
    name: string;
    email: string;
    country: string | null;
    firstContact: Date;
    ticketCount: number;
    totalSpent: number;
    ticketCodes: string[];
  }>();

  for (const t of tickets) {
    const existing = clientMap.get(t.submitterEmail);
    const paidAmount = t.invoices
      .filter((i: { status: string }) => i.status === "PAID")
      .reduce((sum: number, i: { totalAmount: number }) => sum + Number(i.totalAmount), 0);

    if (existing) {
      existing.ticketCount++;
      existing.totalSpent += paidAmount;
      existing.ticketCodes.push(t.code);
      if (t.createdAt < existing.firstContact) existing.firstContact = t.createdAt;
    } else {
      clientMap.set(t.submitterEmail, {
        name: t.submitterName,
        email: t.submitterEmail,
        country: t.submitterCountry,
        firstContact: t.createdAt,
        ticketCount: 1,
        totalSpent: paidAmount,
        ticketCodes: [t.code],
      });
    }
  }

  return Array.from(clientMap.values());
}

export default async function AdminClientsPage() {
  const clients = await getClients();
  return <ClientsTable clients={clients} />;
}
