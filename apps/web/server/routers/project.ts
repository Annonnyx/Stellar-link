import { z } from "zod";
import { createTRPCRouter, protectedProcedure, adminProcedure } from "@/lib/trpc";
import { prisma } from "@nova-studio/database";

export const projectRouter = createTRPCRouter({
  list: protectedProcedure
    .input(
      z.object({
        status: z.string().optional(),
        search: z.string().optional(),
        page: z.number().min(1).default(1),
        perPage: z.number().min(1).max(100).default(20),
      }).optional()
    )
    .query(async ({ input }) => {
      const page = input?.page ?? 1;
      const perPage = input?.perPage ?? 20;

      const where: Record<string, unknown> = {};
      if (input?.status) where.status = input.status;
      if (input?.search) {
        where.title = { contains: input.search, mode: "insensitive" };
      }

      const [projects, total] = await Promise.all([
        prisma.project.findMany({
          where,
          include: { ticket: { select: { code: true, submitterName: true } } },
          orderBy: { createdAt: "desc" },
          skip: (page - 1) * perPage,
          take: perPage,
        }),
        prisma.project.count({ where }),
      ]);

      return { projects, total, pages: Math.ceil(total / perPage) };
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      return prisma.project.findUnique({
        where: { id: input.id },
        include: {
          ticket: { select: { id: true, code: true, submitterName: true, submitterEmail: true } },
          deliverables: { orderBy: { createdAt: "desc" } },
          milestones: { orderBy: { order: "asc" } },
          invoices: true,
          statusLogs: { orderBy: { createdAt: "desc" } },
        },
      });
    }),

  update: adminProcedure
    .input(z.object({
      id: z.string(),
      title: z.string().optional(),
      status: z.string().optional(),
      progress: z.number().min(0).max(100).optional(),
      deadline: z.string().optional(),
      description: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      const updateData: Record<string, unknown> = {};
      if (data.title) updateData.title = data.title;
      if (data.description !== undefined) updateData.description = data.description;
      if (data.progress !== undefined) updateData.progress = data.progress;
      if (data.deadline) updateData.deadline = new Date(data.deadline);
      if (data.status) updateData.status = data.status;

      return prisma.project.update({ where: { id }, data: updateData });
    }),

  addMilestone: adminProcedure
    .input(z.object({
      projectId: z.string(),
      title: z.string(),
      description: z.string().optional(),
      dueDate: z.string().optional(),
      order: z.number().default(0),
    }))
    .mutation(async ({ input }) => {
      return prisma.milestone.create({
        data: {
          projectId: input.projectId,
          title: input.title,
          description: input.description,
          dueDate: input.dueDate ? new Date(input.dueDate) : null,
          order: input.order,
        },
      });
    }),

  completeMilestone: protectedProcedure
    .input(z.object({ milestoneId: z.string() }))
    .mutation(async ({ input }) => {
      return prisma.milestone.update({
        where: { id: input.milestoneId },
        data: { completed: true, completedAt: new Date() },
      });
    }),

  stats: adminProcedure.query(async () => {
    const [total, inProgress, completed, draft] = await Promise.all([
      prisma.project.count(),
      prisma.project.count({ where: { status: "IN_PROGRESS" } }),
      prisma.project.count({ where: { status: "COMPLETED" } }),
      prisma.project.count({ where: { status: "DRAFT" } }),
    ]);
    return { total, inProgress, completed, draft };
  }),
});
