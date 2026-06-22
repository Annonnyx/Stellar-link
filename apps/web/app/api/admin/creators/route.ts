import { NextResponse } from "next/server";
import { prisma } from "@nova-studio/database";

export async function GET() {
  try {
    const creators = await prisma.creatorProfile.findMany({
      where: { isActive: true },
      include: { user: { select: { name: true, email: true } } },
      orderBy: { displayName: "asc" },
    });

    return NextResponse.json({ creators });
  } catch (error) {
    console.error("Error fetching creators:", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
