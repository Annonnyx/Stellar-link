import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@nova-studio/database";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) {
      return NextResponse.json({ error: "Projet introuvable" }, { status: 404 });
    }

    const updateData: Record<string, unknown> = {};
    if (body.status && body.status !== project.status) {
      updateData.status = body.status;

      await prisma.projectStatusLog.create({
        data: {
          projectId: id,
          fromStatus: project.status,
          toStatus: body.status,
          changedBy: "admin",
        },
      });

      if (body.status === "COMPLETED") {
        updateData.completedDate = new Date();
        updateData.progress = 100;
      }
    }

    if (body.progress !== undefined) {
      updateData.progress = body.progress;
    }

    if (body.deadline !== undefined) {
      updateData.deadline = body.deadline ? new Date(body.deadline) : null;
    }

    if (body.description !== undefined) {
      updateData.description = body.description;
    }

    const updated = await prisma.project.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ project: updated });
  } catch (error) {
    console.error("Error updating project:", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
