import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@nova-studio/database";
import { ticketCreatedEmail, statusUpdateEmail } from "@nova-studio/email-templates";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { status, note } = await req.json();

    if (!status) {
      return NextResponse.json({ error: "Status requis" }, { status: 400 });
    }

    const ticket = await prisma.ticket.findUnique({ where: { id } });
    if (!ticket) {
      return NextResponse.json({ error: "Ticket introuvable" }, { status: 404 });
    }

    const previousStatus = ticket.status;

    await prisma.ticket.update({
      where: { id },
      data: { status },
    });

    await prisma.ticketStatusLog.create({
      data: {
        ticketId: id,
        fromStatus: previousStatus,
        toStatus: status,
        note: note || `Statut changé en ${status}`,
      },
    });

    // Send email notification
    if (ticket.emailVerified && ticket.submitterEmail) {
      const RESEND_API_KEY = process.env.RESEND_API_KEY;
      if (RESEND_API_KEY) {
        const template = statusUpdateEmail(ticket.code, ticket.submitterName, status);
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: process.env.EMAIL_FROM || "Nova Studio <noreply@novastudio.com>",
            to: ticket.submitterEmail,
            subject: template.subject,
            html: template.html,
            text: template.text,
          }),
        });
      }
    }

    return NextResponse.json({ success: true, ticket: { id, status: status } });
  } catch (error) {
    console.error("Error updating ticket status:", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
