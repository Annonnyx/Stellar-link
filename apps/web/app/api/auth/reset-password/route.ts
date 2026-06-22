import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@nova-studio/database";
import { randomBytes, createHash } from "crypto";

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email requis" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json({ success: true });
    }

    const token = randomBytes(32).toString("hex");
    const hashedToken = hashToken(token);
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1h

    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token: hashedToken,
        expires,
      },
    });

    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/reset-password/confirm?token=${token}&email=${encodeURIComponent(email)}`;

    if (process.env.RESEND_API_KEY) {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: process.env.EMAIL_FROM || "Nova Studio <noreply@novastudio.com>",
          to: email,
          subject: "Réinitialisation de votre mot de passe — Nova Studio",
          html: `
            <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
              <h2>Réinitialisation du mot de passe</h2>
              <p>Bonjour ${user.name || ""},</p>
              <p>Vous avez demandé la réinitialisation de votre mot de passe. Cliquez sur le lien ci-dessous :</p>
              <p><a href="${resetUrl}" style="display:inline-block;padding:12px 24px;background:#7c3aed;color:#fff;text-decoration:none;border-radius:8px;">Réinitialiser mon mot de passe</a></p>
              <p style="color:#888;font-size:12px;">Ce lien expire dans 1 heure. Si vous n'avez pas fait cette demande, ignorez cet email.</p>
            </div>
          `,
        }),
      });
    } else {
      console.log("Reset password link:", resetUrl);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error sending reset email:", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
