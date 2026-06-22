import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@nova-studio/database";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { ticketId, name, description, deadline, budget, categories } = body;

    if (!ticketId || !name) {
      return NextResponse.json({ error: "ticketId et name requis" }, { status: 400 });
    }

    const ticket = await prisma.ticket.findUnique({ where: { id: ticketId } });
    if (!ticket) {
      return NextResponse.json({ error: "Ticket introuvable" }, { status: 404 });
    }

    const project = await prisma.project.create({
      data: {
        title: name,
        description,
        ticketId,
        deadline: deadline ? new Date(deadline) : undefined,
        agreedPrice: budget ? parseFloat(budget) : undefined,
        categories: categories || [],
        status: "DRAFT",
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
        note: `Projet créé : ${name}`,
      },
    });

    return NextResponse.json({ success: true, project });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
