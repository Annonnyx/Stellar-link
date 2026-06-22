import { NextResponse } from "next/server";
import { prisma } from "@nova-studio/database";

export async function GET() {
  try {
    const tickets = await prisma.ticket.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        code: true,
        type: true,
        status: true,
        submitterName: true,
        submitterEmail: true,
        submitterCountry: true,
        estimatedPriceMin: true,
        estimatedPriceMax: true,
        createdAt: true,
        closedAt: true,
      },
    });

    const headers = ["Code", "Type", "Statut", "Nom", "Email", "Pays", "Prix Min", "Prix Max", "Créé le", "Fermé le"];
    const rows = tickets.map((t) => [
      t.code,
      t.type,
      t.status,
      t.submitterName,
      t.submitterEmail,
      t.submitterCountry || "",
      t.estimatedPriceMin ? String(t.estimatedPriceMin) : "",
      t.estimatedPriceMax ? String(t.estimatedPriceMax) : "",
      t.createdAt.toISOString(),
      t.closedAt?.toISOString() || "",
    ]);

    const csv = [headers.join(","), ...rows.map((r) => r.map((c) => `"${c}"`).join(","))].join("\n");

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="tickets-${new Date().toISOString().split("T")[0]}.csv"`,
      },
    });
  } catch (error) {
    console.error("Error exporting tickets:", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
