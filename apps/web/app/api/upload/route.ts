import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@nova-studio/database";
import { rateLimit } from "@/lib/rate-limit";
import { uploadFile, generateFileKey } from "@/lib/storage";

const ALLOWED_TYPES = [
  "image/jpeg", "image/png", "image/gif", "image/webp",
  "application/pdf",
  "video/mp4", "video/webm", "video/quicktime",
  "audio/mpeg", "audio/wav", "audio/ogg",
  "application/zip", "application/x-zip-compressed",
];

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    const limit = rateLimit(`upload:${ip}`, 20, 60_000);
    if (!limit.success) {
      return NextResponse.json({ error: "Trop de requêtes" }, { status: 429 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const ticketId = formData.get("ticketId") as string | null;

    if (!file || !ticketId) {
      return NextResponse.json({ error: "Fichier ou ticket manquant" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: "Type de fichier non autorisé" }, { status: 400 });
    }

    if (file.size > 50 * 1024 * 1024) {
      return NextResponse.json({ error: "Fichier trop volumineux (max 50MB)" }, { status: 413 });
    }

    const ticket = await prisma.ticket.findUnique({ where: { id: ticketId } });
    if (!ticket) {
      return NextResponse.json({ error: "Ticket introuvable" }, { status: 404 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const key = generateFileKey(file.name);
    const fileUrl = await uploadFile(buffer, key, file.type);

    const ticketFile = await prisma.ticketFile.create({
      data: {
        ticketId,
        fileUrl,
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type,
      },
    });

    return NextResponse.json({
      success: true,
      file: {
        id: ticketFile.id,
        url: fileUrl,
        name: file.name,
        size: file.size,
      },
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Erreur d'upload" }, { status: 500 });
  }
}
