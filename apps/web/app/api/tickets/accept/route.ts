import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@nova-studio/database";

export async function POST(req: NextRequest) {
  try {
    const { ticketId, creatorId, userId } = await req.json();

    if (!ticketId || !creatorId || !userId) {
      return NextResponse.json({ error: "Paramètres manquants" }, { status: 400 });
    }

    const ticket = await prisma.ticket.findUnique({ where: { id: ticketId } });
    if (!ticket) {
      return NextResponse.json({ error: "Ticket introuvable" }, { status: 404 });
    }

    const existing = await prisma.ticketAssignment.findUnique({
      where: { ticketId_userId: { ticketId, userId } },
    });
    if (existing) {
      return NextResponse.json({ error: "Vous êtes déjà assigné à ce ticket" }, { status: 400 });
    }

    const assignment = await prisma.ticketAssignment.create({
      data: {
        ticketId,
        userId,
        creatorId,
        selfAssigned: true,
      },
    });

    await prisma.ticket.update({
      where: { id: ticketId },
      data: { status: "ASSIGNED" },
    });

    await prisma.ticketStatusLog.create({
      data: {
        ticketId,
        fromStatus: ticket.status,
        toStatus: "ASSIGNED",
        changedBy: userId,
        note: "Créateur a accepté la tâche",
      },
    });

    return NextResponse.json({ success: true, assignment });
  } catch (error) {
    console.error("Error accepting task:", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
