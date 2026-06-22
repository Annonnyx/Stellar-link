import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@nova-studio/database";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { ticketId, subtotal, taxRate, dueAt, notes } = body;

    if (!ticketId || !subtotal) {
      return NextResponse.json({ error: "ticketId et subtotal requis" }, { status: 400 });
    }

    const ticket = await prisma.ticket.findUnique({ where: { id: ticketId } });
    if (!ticket) {
      return NextResponse.json({ error: "Ticket introuvable" }, { status: 404 });
    }

    const invoiceCount = await prisma.invoice.count();
    const invoiceNumber = `INV-${new Date().getFullYear()}-${String(invoiceCount + 1).padStart(4, "0")}`;

    const sub = parseFloat(subtotal);
    const tax = taxRate ? parseFloat(taxRate) : 0;
    const taxAmount = sub * (tax / 100);
    const total = sub + taxAmount;

    const invoice = await prisma.invoice.create({
      data: {
        ticketId,
        number: invoiceNumber,
        clientName: ticket.submitterName,
        clientEmail: ticket.submitterEmail,
        subtotal: sub,
        taxRate: tax,
        taxAmount,
        totalAmount: total,
        notes: notes || "",
        dueAt: dueAt ? new Date(dueAt) : undefined,
        status: "DRAFT",
      },
    });

    return NextResponse.json({ success: true, invoice });
  } catch (error) {
    console.error("Error creating invoice:", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
