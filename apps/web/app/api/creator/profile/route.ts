import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@nova-studio/database";

export async function GET() {
  try {
    const user = await prisma.user.findFirst();
    if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

    const profile = await prisma.creatorProfile.findUnique({
      where: { userId: user.id },
      select: {
        id: true,
        displayName: true,
        bio: true,
        country: true,
        city: true,
        availability: true,
        hoursPerWeek: true,
        portfolioUrls: true,
        softwareTools: true,
        experienceLevel: true,
        yearsExperience: true,
        hourlyRate: true,
        isActive: true,
      },
    });

    if (!profile) return NextResponse.json({ error: "Profil introuvable" }, { status: 404 });
    return NextResponse.json({ profile });
  } catch (error) {
    console.error("Error fetching creator profile:", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await prisma.user.findFirst();
    if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

    const body = await req.json();

    const profile = await prisma.creatorProfile.update({
      where: { userId: user.id },
      data: {
        displayName: body.displayName,
        bio: body.bio || null,
        country: body.country || null,
        city: body.city || null,
        availability: body.availability,
        hoursPerWeek: body.hoursPerWeek,
      },
    });

    return NextResponse.json({ profile });
  } catch (error) {
    console.error("Error updating creator profile:", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
