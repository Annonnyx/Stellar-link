import { NextResponse } from "next/server";
import type { Socket as NetSocket } from "net";
import type { Server as NetServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import { prisma } from "@nova-studio/database";

// Global declaration to persist Socket.io server across hot reloads
declare global {
  // eslint-disable-next-line no-var
  var socketIOServer: SocketIOServer | undefined;
}

export const dynamic = "force-dynamic";

export async function GET() {
  if (global.socketIOServer) {
    return NextResponse.json({ success: true, status: "already-running" });
  }

  // Create a minimal HTTP server for Socket.io
  const { createServer } = await import("http");
  const httpServer = createServer();

  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    socket.on("join_room", (discussionCode: string) => {
      socket.join(discussionCode);
    });

    socket.on("leave_room", (discussionCode: string) => {
      socket.leave(discussionCode);
    });

    socket.on("send_message", async (data: { discussionCode: string; content: string; senderName: string; ticketId: string }) => {
      try {
        const message = await prisma.message.create({
          data: {
            ticketId: data.ticketId,
            content: data.content.trim(),
            senderName: data.senderName || "Anonyme",
            senderType: "client",
            type: "TEXT",
          },
        });

        const payload = {
          id: message.id,
          content: message.content,
          senderName: message.senderName,
          senderType: message.senderType,
          createdAt: message.createdAt.toISOString(),
          ticketId: message.ticketId,
          discussionCode: data.discussionCode,
        };

        io.to(data.discussionCode).emit("new_message", payload);
      } catch (e) {
        console.error("Socket message error:", e);
      }
    });

    socket.on("typing", (event: { ticketId: string; senderName: string; isTyping: boolean }) => {
      socket.to(event.ticketId).emit("user_typing", event);
    });

    socket.on("disconnect", () => {});
  });

  const port = process.env.SOCKET_PORT ? parseInt(process.env.SOCKET_PORT) : 3001;
  httpServer.listen(port);
  global.socketIOServer = io;

  return NextResponse.json({ success: true, status: "started", port });
}
