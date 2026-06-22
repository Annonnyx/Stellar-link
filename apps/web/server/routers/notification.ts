import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/lib/trpc";
import { prisma } from "@nova-studio/database";

export const notificationRouter = createTRPCRouter({
  list: protectedProcedure
    .input(z.object({
      unreadOnly: z.boolean().default(false),
      cursor: z.string().optional(),
      limit: z.number().default(20),
    }).optional())
    .query(async ({ ctx, input }) => {
      const where: Record<string, unknown> = { userId: ctx.user.id };
      if (input?.unreadOnly) where.isRead = false;

      const notifications = await prisma.notification.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: (input?.limit ?? 20) + 1,
        ...(input?.cursor ? { cursor: { id: input.cursor }, skip: 1 } : {}),
      });

      let nextCursor: string | undefined;
      if (notifications.length > (input?.limit ?? 20)) {
        const next = notifications.pop();
        nextCursor = next?.id;
      }

      return { notifications, nextCursor };
    }),

  markAsRead: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      return prisma.notification.update({
        where: { id: input.id },
        data: { isRead: true, readAt: new Date() },
      });
    }),

  markAllAsRead: protectedProcedure
    .mutation(async ({ ctx }) => {
      await prisma.notification.updateMany({
        where: { userId: ctx.user.id, isRead: false },
        data: { isRead: true, readAt: new Date() },
      });
      return { success: true };
    }),

  unreadCount: protectedProcedure
    .query(async ({ ctx }) => {
      const count = await prisma.notification.count({
        where: { userId: ctx.user.id, isRead: false },
      });
      return { count };
    }),
});
