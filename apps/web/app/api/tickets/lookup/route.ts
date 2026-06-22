import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@nova-studio/database";

export async function GET(req: NextRequest) {
  try {
    const code = req.nextUrl.searchParams.get("code");
    if (!code) {
      return NextResponse.json({ error: "Code requis" }, { status: 400 });
    }

    const ticket = await prisma.ticket.findUnique({
      where: { discussionCode: code },
      select: {
        id: true,
        code: true,
        type: true,
        status: true,
        submitterName: true,
        submitterEmail: true,
        discussionCode: true,
        estimatedPriceMin: true,
        estimatedPriceMax: true,
        createdAt: true,
        project: {
          select: {
            id: true,
            title: true,
            description: true,
            status: true,
          },
        },
        invoices: {
          select: {
            id: true,
            number: true,
            totalAmount: true,
            status: true,
          },
        },
      },
    });

    if (!ticket) {
      return NextResponse.json({ error: "Ticket introuvable" }, { status: 404 });
    }

    return NextResponse.json({ ticket });
  } catch (error) {
    console.error("Error looking up ticket:", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
