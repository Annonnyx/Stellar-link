import { z } from "zod";
import { createTRPCRouter, adminProcedure } from "@/lib/trpc";
import { prisma } from "@nova-studio/database";

export const adminRouter = createTRPCRouter({
  dashboardStats: adminProcedure.query(async () => {
    const [
      openTickets, activeProjects, activeCreators,
      monthlyRevenue, unreadMessages, statusDistribution,
    ] = await Promise.all([
      prisma.ticket.count({ where: { status: { notIn: ["COMPLETED", "CANCELLED", "REJECTED"] } } }),
      prisma.project.count({ where: { status: { in: ["IN_PROGRESS", "IN_REVISION", "PENDING_APPROVAL"] } } }),
      prisma.creatorProfile.count({ where: { isActive: true } }),
      prisma.invoice.aggregate({
        _sum: { totalAmount: true },
        where: {
          status: "PAID",
          paidAt: { gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) },
        },
      }),
      prisma.message.count({ where: { isRead: false } }),
      prisma.ticket.groupBy({ by: ["status"], _count: { status: true } }),
    ]);

    return {
      openTickets,
      activeProjects,
      activeCreators,
      monthlyRevenue: Number(monthlyRevenue._sum.totalAmount || 0),
      unreadMessages,
      statusDistribution: statusDistribution.map((s) => ({ status: s.status, count: s._count.status })),
    };
  }),

  revenueChart: adminProcedure
    .input(z.object({
      period: z.enum(["week", "month", "quarter", "year"]).default("month"),
    }).optional())
    .query(async ({ input }) => {
      const period = input?.period ?? "month";
      const now = new Date();
      let startDate: Date;

      switch (period) {
        case "week":
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case "month":
          startDate = new Date(now.getFullYear(), now.getMonth() - 6, 1);
          break;
        case "quarter":
          startDate = new Date(now.getFullYear(), now.getMonth() - 12, 1);
          break;
        case "year":
          startDate = new Date(now.getFullYear() - 2, 0, 1);
          break;
      }

      const invoices = await prisma.invoice.findMany({
        where: { status: "PAID", paidAt: { gte: startDate } },
        select: { totalAmount: true, paidAt: true },
        orderBy: { paidAt: "asc" },
      });

      const dataPoints: { label: string; revenue: number }[] = [];
      const grouped = new Map<string, number>();

      for (const inv of invoices) {
        if (!inv.paidAt) continue;
        const key = `${inv.paidAt.getFullYear()}-${String(inv.paidAt.getMonth() + 1).padStart(2, "0")}`;
        grouped.set(key, (grouped.get(key) || 0) + Number(inv.totalAmount));
      }

      for (const [label, revenue] of grouped) {
        dataPoints.push({ label, revenue });
      }

      return dataPoints;
    }),

  recentActivity: adminProcedure
    .input(z.object({ limit: z.number().default(20) }).optional())
    .query(async ({ input }) => {
      return prisma.ticket.findMany({
        orderBy: { createdAt: "desc" },
        take: input?.limit ?? 20,
        select: {
          id: true, code: true, type: true, status: true,
          submitterName: true, createdAt: true,
        },
      });
    }),

  getSettings: adminProcedure.query(async () => {
    const settings = await prisma.setting.findMany();
    const mapped: Record<string, unknown> = {};
    for (const s of settings) mapped[s.key] = s.value;
    return mapped;
  }),

  updateSettings: adminProcedure
    .input(z.record(z.unknown()))
    .mutation(async ({ input }) => {
      for (const [key, value] of Object.entries(input)) {
        await prisma.setting.upsert({
          where: { key },
          create: { key, value: value as any },
          update: { value: value as any },
        });
      }
      return { success: true };
    }),
});
