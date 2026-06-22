import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@nova-studio/database";

export async function GET(req: NextRequest) {
  // Verify cron secret
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const results = {
    remindersSent: 0,
    closedTickets: 0,
    staleProjects: 0,
  };

  try {
    // 1. Send reminders for unverified tickets older than 1 hour
    const unverifiedTickets = await prisma.ticket.findMany({
      where: {
        status: "PENDING_VERIFICATION",
        createdAt: { lt: new Date(Date.now() - 60 * 60 * 1000) },
        emailVerified: false,
      },
    });

    for (const ticket of unverifiedTickets) {
      if (ticket.verificationAttempts > 0) continue; // Skip if user already tried
      // In production: send reminder email via Resend
      results.remindersSent++;
    }

    // 2. Auto-close tickets pending for more than 7 days
    const staleTickets = await prisma.ticket.findMany({
      where: {
        status: "PENDING_VERIFICATION",
        createdAt: { lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        emailVerified: false,
      },
    });

    for (const ticket of staleTickets) {
      await prisma.ticket.update({
        where: { id: ticket.id },
        data: { status: "CANCELLED" },
      });
      await prisma.ticketStatusLog.create({
        data: {
          ticketId: ticket.id,
          fromStatus: ticket.status,
          toStatus: "CANCELLED",
          note: "Auto-fermé après 7 jours sans vérification",
        },
      });
      results.closedTickets++;
    }

    // 3. Flag stale projects (no activity in 14 days)
    const staleProjects = await prisma.project.findMany({
      where: {
        status: { in: ["IN_PROGRESS", "PENDING_APPROVAL"] },
        updatedAt: { lt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000) },
      },
    });

    results.staleProjects = staleProjects.length;

    return NextResponse.json({ success: true, results });
  } catch (error) {
    console.error("Cron error:", error);
    return NextResponse.json({ error: "Cron failed" }, { status: 500 });
  }
}
