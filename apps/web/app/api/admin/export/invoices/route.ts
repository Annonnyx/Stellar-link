import { NextResponse } from "next/server";
import { prisma } from "@nova-studio/database";

export async function GET() {
  try {
    const invoices = await prisma.invoice.findMany({
      orderBy: { createdAt: "desc" },
      include: { ticket: { select: { code: true } } },
    });

    const headers = ["N°", "Ticket", "Client", "Email", "Sous-total", "TVA", "Total", "Statut", "Émise le", "Payée le"];
    const rows = invoices.map((i) => [
      i.number,
      i.ticket?.code || "",
      i.clientName,
      i.clientEmail,
      String(i.subtotal),
      String(i.taxAmount),
      String(i.totalAmount),
      i.status,
      i.issuedAt?.toISOString() || "",
      i.paidAt?.toISOString() || "",
    ]);

    const csv = [headers.join(","), ...rows.map((r) => r.map((c) => `"${c}"`).join(","))].join("\n");

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="invoices-${new Date().toISOString().split("T")[0]}.csv"`,
      },
    });
  } catch (error) {
    console.error("Error exporting invoices:", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
