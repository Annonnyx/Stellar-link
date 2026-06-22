import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/lib/trpc";
import { prisma } from "@nova-studio/database";

export const creatorRouter = createTRPCRouter({
  list: publicProcedure
    .input(z.object({ verified: z.boolean().optional(), limit: z.number().min(1).max(100).default(50) }).optional())
    .query(async ({ input }) => {
      return prisma.creatorProfile.findMany({
        where: input?.verified !== undefined ? { isVerified: input.verified } : undefined,
        include: { user: { select: { name: true, email: true, image: true } }, skills: { include: { skill: true } } },
        orderBy: { averageRating: "desc" },
        take: input?.limit ?? 50,
      });
    }),

  byId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      return prisma.creatorProfile.findUnique({
        where: { id: input.id },
        include: { user: { select: { name: true, email: true, image: true } }, skills: { include: { skill: true } } },
      });
    }),
});
