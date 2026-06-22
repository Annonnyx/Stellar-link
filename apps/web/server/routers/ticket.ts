import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/lib/trpc";
import { prisma } from "@nova-studio/database";

export const ticketRouter = createTRPCRouter({
  list: publicProcedure
    .input(z.object({ status: z.string().optional(), limit: z.number().min(1).max(100).default(50) }).optional())
    .query(async ({ input }) => {
      return prisma.ticket.findMany({
        where: input?.status ? { status: input.status as any } : undefined,
        orderBy: { createdAt: "desc" },
        take: input?.limit ?? 50,
        select: {
          id: true, code: true, type: true, status: true,
          submitterName: true, submitterEmail: true,
          discussionCode: true, createdAt: true,
        },
      });
    }),

  byId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      return prisma.ticket.findUnique({
        where: { id: input.id },
        include: {
          statusLogs: { orderBy: { createdAt: "desc" } },
          messages: { orderBy: { createdAt: "asc" } },
          invoices: true,
          project: true,
        },
      });
    }),

  stats: publicProcedure.query(async () => {
    const [total, pending, inProgress, completed, cancelled] = await Promise.all([
      prisma.ticket.count(),
      prisma.ticket.count({ where: { status: "PENDING_VERIFICATION" } }),
      prisma.ticket.count({ where: { status: "IN_PROGRESS" } }),
      prisma.ticket.count({ where: { status: "COMPLETED" } }),
      prisma.ticket.count({ where: { status: "CANCELLED" } }),
    ]);
    return { total, pending, inProgress, completed, cancelled };
  }),
});
