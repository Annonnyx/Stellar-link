import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@nova-studio/database";

export async function POST(req: NextRequest) {
  try {
    const { ticketId, userId, creatorId } = await req.json();

    if (!ticketId || !userId || !creatorId) {
      return NextResponse.json({ error: "Paramètres manquants" }, { status: 400 });
    }

    const existing = await prisma.ticketAssignment.findUnique({
      where: { ticketId_userId: { ticketId, userId } },
    });
    if (existing) {
      return NextResponse.json({ error: "Déjà assigné" }, { status: 400 });
    }

    const assignment = await prisma.ticketAssignment.create({
      data: { ticketId, userId, creatorId, selfAssigned: false, assignedBy: "admin" },
    });

    const ticket = await prisma.ticket.findUnique({ where: { id: ticketId } });
    if (ticket && !["ASSIGNED", "IN_PROGRESS", "COMPLETED"].includes(ticket.status)) {
      await prisma.ticket.update({ where: { id: ticketId }, data: { status: "ASSIGNED" } });
      await prisma.ticketStatusLog.create({
        data: {
          ticketId,
          fromStatus: ticket.status,
          toStatus: "ASSIGNED",
          changedBy: "admin",
          note: "Créateur assigné par l'admin",
        },
      });
    }

    return NextResponse.json({ success: true, assignment });
  } catch (error) {
    console.error("Error assigning creator:", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { assignmentId } = await req.json();
    if (!assignmentId) {
      return NextResponse.json({ error: "ID manquant" }, { status: 400 });
    }

    await prisma.ticketAssignment.delete({ where: { id: assignmentId } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error unassigning creator:", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
