import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@nova-studio/database";

async function getCurrentUser() {
  try {
    return await prisma.user.findFirst();
  } catch { return null; }
}

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ notifications: [], unreadCount: 0 });

    const [notifications, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        take: 20,
      }),
      prisma.notification.count({
        where: { userId: user.id, isRead: false },
      }),
    ]);

    return NextResponse.json({ notifications, unreadCount });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json({ notifications: [], unreadCount: 0 });
  }
}

// Mark single as read
export async function PATCH(req: NextRequest) {
  try {
    const { id } = await req.json();
    await prisma.notification.update({
      where: { id },
      data: { isRead: true, readAt: new Date() },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error marking notification:", error);
    return NextResponse.json({ error: "Erreur" }, { status: 500 });
  }
}

// Mark all as read
export async function PUT() {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

    await prisma.notification.updateMany({
      where: { userId: user.id, isRead: false },
      data: { isRead: true, readAt: new Date() },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error marking all notifications:", error);
    return NextResponse.json({ error: "Erreur" }, { status: 500 });
  }
}
