import { Server as NetServer } from "http";
import { Server as SocketIOServer } from "socket.io";

export type SocketMessage = {
  id: string;
  content: string;
  senderName: string;
  senderType: string;
  createdAt: string;
  ticketId: string;
  discussionCode: string;
};

export type TypingEvent = {
  ticketId: string;
  senderName: string;
  isTyping: boolean;
};

export const ioConfig = {
  cors: {
    origin: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
};

export function getSocketIO(server: NetServer): SocketIOServer {
  const io = new SocketIOServer(server, ioConfig);

  io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on("join_room", (discussionCode: string) => {
      socket.join(discussionCode);
      console.log(`Socket ${socket.id} joined room ${discussionCode}`);
    });

    socket.on("leave_room", (discussionCode: string) => {
      socket.leave(discussionCode);
      console.log(`Socket ${socket.id} left room ${discussionCode}`);
    });

    socket.on("send_message", (msg: SocketMessage) => {
      io.to(msg.discussionCode).emit("new_message", msg);
    });

    socket.on("typing", (event: TypingEvent) => {
      io.to(event.ticketId).emit("user_typing", event);
    });

    socket.on("disconnect", () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });

  return io;
}
