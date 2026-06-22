import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@nova-studio/database";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const unverified = await prisma.ticket.findMany({
      where: {
        status: "PENDING_VERIFICATION",
        emailVerified: false,
        createdAt: { lt: cutoff },
      },
      select: { id: true, code: true },
    });

    if (unverified.length === 0) {
      return NextResponse.json({ message: "Aucun ticket à nettoyer", deleted: 0 });
    }

    const ids = unverified.map((t) => t.id);

    // Delete related records first
    await prisma.ticketStatusLog.deleteMany({ where: { ticketId: { in: ids } } });
    await prisma.message.deleteMany({ where: { ticketId: { in: ids } } });
    await prisma.ticketFile.deleteMany({ where: { ticketId: { in: ids } } });

    const result = await prisma.ticket.deleteMany({
      where: { id: { in: ids } },
    });

    console.log(`Cron cleanup: deleted ${result.count} unverified tickets (>24h)`);

    return NextResponse.json({
      message: `${result.count} tickets non vérifiés supprimés`,
      deleted: result.count,
      codes: unverified.map((t) => t.code),
    });
  } catch (error) {
    console.error("Cron cleanup error:", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
