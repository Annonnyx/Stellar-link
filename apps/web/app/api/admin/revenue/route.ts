import { NextResponse } from "next/server";
import { prisma } from "@nova-studio/database";

export async function GET() {
  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const invoices = await prisma.invoice.findMany({
      where: { status: "PAID", paidAt: { gte: sixMonthsAgo } },
      select: { totalAmount: true, paidAt: true },
      orderBy: { paidAt: "asc" },
    });

    const grouped = new Map<string, number>();

    for (const inv of invoices) {
      if (!inv.paidAt) continue;
      const key = `${inv.paidAt.getFullYear()}-${String(inv.paidAt.getMonth() + 1).padStart(2, "0")}`;
      grouped.set(key, (grouped.get(key) || 0) + Number(inv.totalAmount));
    }

    const data = Array.from(grouped.entries())
      .map(([label, revenue]) => ({ label, revenue }))
      .sort((a, b) => a.label.localeCompare(b.label));

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Error fetching revenue data:", error);
    return NextResponse.json({ data: [] });
  }
}
