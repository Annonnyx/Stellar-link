import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@nova-studio/database";

export async function GET(req: NextRequest) {
  try {
    const code = req.nextUrl.searchParams.get("code");
    if (!code) {
      return NextResponse.json({ error: "Code requis" }, { status: 400 });
    }

    const ticket = await prisma.ticket.findUnique({ where: { discussionCode: code } });
    if (!ticket) {
      return NextResponse.json({ error: "Ticket introuvable" }, { status: 404 });
    }

    const messages = await prisma.message.findMany({
      where: { ticketId: ticket.id },
      orderBy: { createdAt: "asc" },
      select: { id: true, content: true, senderName: true, senderType: true, createdAt: true, fileUrl: true },
    });

    return NextResponse.json({ messages });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { discussionCode, content, senderName } = body;

    if (!discussionCode || !content || !content.trim()) {
      return NextResponse.json({ error: "Paramètres manquants" }, { status: 400 });
    }

    const ticket = await prisma.ticket.findUnique({ where: { discussionCode } });
    if (!ticket) {
      return NextResponse.json({ error: "Ticket introuvable" }, { status: 404 });
    }

    const message = await prisma.message.create({
      data: {
        ticketId: ticket.id,
        content: content.trim(),
        senderName: senderName || "Anonyme",
        senderType: "client",
        type: "TEXT",
      },
    });

    // Notify Discord bot
    try {
      await fetch(`${process.env.BOT_HTTP_URL || "http://localhost:4000"}/api/notify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": process.env.INTERNAL_API_KEY || "",
        },
        body: JSON.stringify({
          type: "CHAT_MESSAGE",
          ticketId: ticket.id,
          discussionCode,
          message: { id: message.id, content: message.content, senderName: message.senderName },
        }),
      });
    } catch (e) {
      console.error("Failed to sync with Discord:", e);
    }

    return NextResponse.json({ message });
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
