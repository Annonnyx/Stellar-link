import { NextRequest, NextResponse } from "next/server";
import { verificationEmail, ticketCreatedEmail, statusUpdateEmail, newMessageEmail } from "@nova-studio/email-templates";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    const limit = rateLimit(`email:${ip}`, 10, 60_000);
    if (!limit.success) {
      return NextResponse.json({ error: "Trop de requêtes. Réessayez plus tard." }, { status: 429 });
    }

    const body = await req.json();
    const { to, type } = body;
    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const FROM_EMAIL = process.env.EMAIL_FROM || "Nova Studio <noreply@novastudio.com>";

    if (!RESEND_API_KEY) {
      console.warn("RESEND_API_KEY not set, skipping email");
      return NextResponse.json({ sent: false, reason: "no_api_key" });
    }

    let template;
    if (type === "verification") {
      template = verificationEmail(body.code, body.name);
    } else if (type === "ticket_created") {
      template = ticketCreatedEmail(body.ticketCode, body.name, body.ticketType);
    } else if (type === "status_update") {
      template = statusUpdateEmail(body.ticketCode, body.name, body.newStatus);
    } else if (type === "new_message") {
      template = newMessageEmail(body.ticketCode, body.name, body.sender);
    } else {
      return NextResponse.json({ sent: false, error: "Unknown email type" }, { status: 400 });
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to,
        subject: template.subject,
        html: template.html,
        text: template.text,
      }),
    });

    if (!res.ok) {
      const error = await res.json();
      console.error("Resend error:", error);
      return NextResponse.json({ sent: false, error }, { status: 500 });
    }

    return NextResponse.json({ sent: true });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json({ sent: false, error: "Internal error" }, { status: 500 });
  }
}
