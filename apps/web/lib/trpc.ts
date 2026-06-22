import { initTRPC, TRPCError } from "@trpc/server";
import { cache } from "react";
import SuperJSON from "superjson";
import { auth } from "@/lib/auth";
import { prisma } from "@nova-studio/database";

export const createTRPCContext = cache(async () => {
  const session = await auth();
  return { session, prisma };
});

const t = initTRPC.context<typeof createTRPCContext>().create({ transformer: SuperJSON });

const isAuthenticated = t.middleware(async ({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Non authentifié" });
  }
  return next({ ctx: { ...ctx, user: ctx.session.user } });
});

const isAdmin = t.middleware(async ({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Non authentifié" });
  }
  const user = await ctx.prisma.user.findUnique({ where: { id: ctx.session.user.id } });
  if (!user || user.role !== "ADMIN") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Accès admin requis" });
  }
  return next({ ctx: { ...ctx, user: ctx.session.user } });
});

const isCreator = t.middleware(async ({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Non authentifié" });
  }
  const profile = await ctx.prisma.creatorProfile.findUnique({
    where: { userId: ctx.session.user.id },
  });
  if (!profile) {
    throw new TRPCError({ code: "FORBIDDEN", message: "Accès créateur requis" });
  }
  return next({ ctx: { ...ctx, user: ctx.session.user, creatorProfile: profile } });
});

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthenticated);
export const adminProcedure = t.procedure.use(isAuthenticated).use(isAdmin);
export const creatorProcedure = t.procedure.use(isAuthenticated).use(isCreator);
