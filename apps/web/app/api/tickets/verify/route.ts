import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@nova-studio/database";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    const limit = rateLimit(`verify:${ip}`, 10, 60_000);
    if (!limit.success) {
      return NextResponse.json({ error: "Trop de requêtes. Réessayez plus tard." }, { status: 429 });
    }

    const { ticketId, code } = await req.json();

    if (!ticketId || !code) {
      return NextResponse.json({ error: "Paramètres manquants" }, { status: 400 });
    }

    const ticket = await prisma.ticket.findUnique({ where: { id: ticketId } });
    if (!ticket) {
      return NextResponse.json({ error: "Ticket introuvable" }, { status: 404 });
    }

    if (ticket.emailVerified) {
      return NextResponse.json({ error: "Déjà vérifié", discussionCode: ticket.discussionCode }, { status: 400 });
    }

    if (ticket.verificationAttempts >= 5) {
      return NextResponse.json({ error: "Trop de tentatives. Demandez un nouveau code." }, { status: 403 });
    }

    if (ticket.verificationExpires && new Date() > ticket.verificationExpires) {
      return NextResponse.json({ error: "Code expiré" }, { status: 400 });
    }

    if (ticket.verificationCode !== code) {
      await prisma.ticket.update({
        where: { id: ticketId },
        data: { verificationAttempts: { increment: 1 } },
      });
      return NextResponse.json({ error: "Code invalide" }, { status: 400 });
    }

    // Generate discussion code
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let discussionCode = "";
    for (let i = 0; i < 8; i++) {
      discussionCode += chars[Math.floor(Math.random() * chars.length)];
    }

    const updated = await prisma.ticket.update({
      where: { id: ticketId },
      data: {
        emailVerified: true,
        status: "VERIFIED",
        discussionCode,
      },
    });

    // Create a status log
    await prisma.ticketStatusLog.create({
      data: {
        ticketId,
        fromStatus: ticket.status,
        toStatus: "VERIFIED",
        note: "Email vérifié par l'utilisateur",
      },
    });

    // Notify bot of verification
    try {
      await fetch(`${process.env.BOT_HTTP_URL || "http://localhost:4000"}/api/notify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": process.env.INTERNAL_API_KEY || "",
        },
        body: JSON.stringify({
          type: "TICKET_VERIFIED",
          ticketId,
          ticketCode: ticket.code,
          discussionCode,
        }),
      });
    } catch (e) {
      console.error("Failed to notify Discord bot:", e);
    }

    return NextResponse.json({
      success: true,
      discussionCode: updated.discussionCode,
      ticketId: updated.id,
    });
  } catch (error) {
    console.error("Error verifying ticket:", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
