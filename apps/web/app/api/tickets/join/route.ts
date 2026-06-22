import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@nova-studio/database";
import { joinFormSchema } from "@nova-studio/shared";
import { generateCode, generateVerificationCode } from "@/lib/utils";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    const limit = rateLimit(`join:${ip}`, 5, 60_000);
    if (!limit.success) {
      return NextResponse.json({ error: "Trop de requêtes. Réessayez plus tard." }, { status: 429 });
    }

    const body = await req.json();
    const parsed = joinFormSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Données invalides" }, { status: 400 });
    }

    const data = parsed.data;
    const code = generateCode("NS-J-");
    const verificationCode = generateVerificationCode();

    const ticket = await prisma.ticket.create({
      data: {
        code,
        type: "JOIN",
        status: "PENDING_VERIFICATION",
        submitterName: `${data.firstName} ${data.lastName}`,
        submitterEmail: data.email,
        submitterDiscord: data.discord,
        submitterPhone: data.phone || null,
        submitterCountry: data.country,
        verificationCode,
        verificationExpires: new Date(Date.now() + 60 * 60 * 1000),
        formData: data,
      },
    });

    // Send verification email
    try {
      await fetch(`${req.nextUrl.origin}/api/email/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: data.email,
          type: "verification",
          code: verificationCode,
          ticketCode: code,
        }),
      });
    } catch (e) {
      console.error("Failed to send verification email:", e);
    }

    // Notify Discord bot
    try {
      await fetch(`${process.env.BOT_HTTP_URL || "http://localhost:4000"}/api/notify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": process.env.INTERNAL_API_KEY || "",
        },
        body: JSON.stringify({
          type: "TICKET_CREATED",
          ticketType: "JOIN",
          ticketId: ticket.id,
          ticketCode: ticket.code,
          data: {
            name: `${data.firstName} ${data.lastName}`,
            email: data.email,
            skills: data.skills,
            experience: data.experienceLevel,
            motivation: data.motivation,
          },
        }),
      });
    } catch (e) {
      console.error("Failed to notify Discord bot:", e);
    }

    return NextResponse.json({ ticketId: ticket.id, code: ticket.code }, { status: 201 });
  } catch (error) {
    console.error("Error creating join ticket:", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
