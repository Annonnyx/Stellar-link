import { createTRPCRouter, publicProcedure } from "@/lib/trpc";
import { ticketRouter } from "./ticket";
import { creatorRouter } from "./creator";
import { projectRouter } from "./project";
import { invoiceRouter } from "./invoice";
import { adminRouter } from "./admin";
import { notificationRouter } from "./notification";

export const appRouter = createTRPCRouter({
  health: publicProcedure.query(() => {
    return { status: "ok" };
  }),
  ticket: ticketRouter,
  creator: creatorRouter,
  project: projectRouter,
  invoice: invoiceRouter,
  admin: adminRouter,
  notification: notificationRouter,
});

export type AppRouter = typeof appRouter;
