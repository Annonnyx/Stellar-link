import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@nova-studio/database";

export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const { status } = await req.json();
    
    if (!status) {
      return NextResponse.json({ error: "Statut requis" }, { status: 400 });
    }

    const invoice = await prisma.invoice.update({
      where: { id },
      data: { 
        status,
        paidAt: status === "PAID" ? new Date() : null,
      },
    });

    return NextResponse.json({ success: true, invoice });
  } catch (error) {
    console.error("Error updating invoice status:", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
