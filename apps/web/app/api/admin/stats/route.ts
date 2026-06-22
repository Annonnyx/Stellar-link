import { NextResponse } from "next/server";
import { prisma } from "@nova-studio/database";

export const revalidate = 0;

export async function GET() {
  try {
    const [
      totalTickets,
      pendingTickets,
      inProgressTickets,
      completedTickets,
      totalCreators,
      activeCreators,
      totalProjects,
      totalInvoices,
      paidInvoices,
      recentTickets,
    ] = await Promise.all([
      prisma.ticket.count(),
      prisma.ticket.count({ where: { status: "PENDING_VERIFICATION" } }),
      prisma.ticket.count({ where: { status: "IN_PROGRESS" } }),
      prisma.ticket.count({ where: { status: "COMPLETED" } }),
      prisma.creatorProfile.count(),
      prisma.creatorProfile.count({ where: { isActive: true } }),
      prisma.project.count(),
      prisma.invoice.count(),
      prisma.invoice.count({ where: { status: "PAID" } }),
      prisma.ticket.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          code: true,
          type: true,
          status: true,
          submitterName: true,
          createdAt: true,
        },
      }),
    ]);

    return NextResponse.json({
      tickets: {
        total: totalTickets,
        pending: pendingTickets,
        inProgress: inProgressTickets,
        completed: completedTickets,
      },
      creators: {
        total: totalCreators,
        active: activeCreators,
      },
      projects: totalProjects,
      invoices: {
        total: totalInvoices,
        paid: paidInvoices,
      },
      recentTickets,
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
