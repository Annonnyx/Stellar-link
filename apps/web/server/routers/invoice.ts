import { z } from "zod";
import { createTRPCRouter, adminProcedure, publicProcedure } from "@/lib/trpc";
import { prisma } from "@nova-studio/database";

export const invoiceRouter = createTRPCRouter({
  list: adminProcedure
    .input(
      z.object({
        status: z.string().optional(),
        page: z.number().min(1).default(1),
        perPage: z.number().min(1).max(100).default(20),
      }).optional()
    )
    .query(async ({ input }) => {
      const page = input?.page ?? 1;
      const perPage = input?.perPage ?? 20;

      const where: Record<string, unknown> = {};
      if (input?.status) where.status = input.status;

      const [invoices, total] = await Promise.all([
        prisma.invoice.findMany({
          where,
          include: { ticket: { select: { code: true } } },
          orderBy: { createdAt: "desc" },
          skip: (page - 1) * perPage,
          take: perPage,
        }),
        prisma.invoice.count({ where }),
      ]);

      return { invoices, total, pages: Math.ceil(total / perPage) };
    }),

  create: adminProcedure
    .input(z.object({
      ticketId: z.string().optional(),
      projectId: z.string().optional(),
      clientName: z.string(),
      clientEmail: z.string().email(),
      clientAddress: z.string().optional(),
      items: z.array(z.object({
        description: z.string(),
        quantity: z.number(),
        unitPrice: z.number(),
      })),
      taxRate: z.number().default(0),
      dueAt: z.string().optional(),
      notes: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const subtotal = input.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
      const taxAmount = subtotal * (input.taxRate / 100);
      const totalAmount = subtotal + taxAmount;

      const count = await prisma.invoice.count();
      const number = `NS-INV-${String(count + 1).padStart(4, "0")}`;

      const invoice = await prisma.invoice.create({
        data: {
          number,
          ticketId: input.ticketId || null,
          projectId: input.projectId || null,
          clientName: input.clientName,
          clientEmail: input.clientEmail,
          clientAddress: input.clientAddress,
          subtotal,
          taxRate: input.taxRate,
          taxAmount,
          totalAmount,
          currency: "EUR",
          dueAt: input.dueAt ? new Date(input.dueAt) : null,
          notes: input.notes,
          items: {
            create: input.items.map((item, idx) => ({
              description: item.description,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              totalPrice: item.quantity * item.unitPrice,
              order: idx,
            })),
          },
        },
      });

      return invoice;
    }),

  send: adminProcedure
    .input(z.object({ invoiceId: z.string() }))
    .mutation(async ({ input }) => {
      return prisma.invoice.update({
        where: { id: input.invoiceId },
        data: { status: "SENT", issuedAt: new Date() },
      });
    }),

  cancel: adminProcedure
    .input(z.object({ invoiceId: z.string() }))
    .mutation(async ({ input }) => {
      return prisma.invoice.update({
        where: { id: input.invoiceId },
        data: { status: "CANCELLED" },
      });
    }),

  getPaymentLink: publicProcedure
    .input(z.object({ invoiceId: z.string() }))
    .query(async ({ input }) => {
      const invoice = await prisma.invoice.findUnique({ where: { id: input.invoiceId } });
      return { paymentUrl: invoice?.stripePaymentUrl || null };
    }),
});
