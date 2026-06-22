import { prisma } from "@nova-studio/database";
import { TicketsTable } from "@/components/tickets-table";

export const revalidate = 0;

async function getTickets() {
  return prisma.ticket.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true, code: true, type: true, status: true,
      submitterName: true, submitterEmail: true,
      discussionCode: true, createdAt: true,
    },
  });
}

export default async function AdminTicketsPage() {
  const tickets = await getTickets();

  return <TicketsTable tickets={tickets} />;
}
