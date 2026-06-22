import { prisma } from "@nova-studio/database";
import { InvoicesTable } from "@/components/invoices-table";

export const revalidate = 0;

async function getInvoices() {
  return prisma.invoice.findMany({
    include: { ticket: { select: { code: true, submitterName: true } } },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
}

export default async function AdminInvoicesPage() {
  const invoices = await getInvoices();

  return <InvoicesTable invoices={invoices} />;
}
