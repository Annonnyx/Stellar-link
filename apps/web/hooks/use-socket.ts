"use client";

import { useEffect, useRef, useCallback } from "react";
import { io, Socket } from "socket.io-client";

export function useSocket(room: string | null) {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!room) return;

    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001", {
      transports: ["websocket", "polling"],
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      socket.emit("join_room", room);
    });

    return () => {
      socket.emit("leave_room", room);
      socket.disconnect();
      socketRef.current = null;
    };
  }, [room]);

  const sendMessage = useCallback(
    (data: { discussionCode: string; content: string; senderName: string; ticketId: string }) => {
      socketRef.current?.emit("send_message", data);
    },
    []
  );

  const onMessage = useCallback((handler: (msg: any) => void) => {
    socketRef.current?.on("new_message", handler);
    return () => {
      socketRef.current?.off("new_message", handler);
    };
  }, []);

  const onTyping = useCallback((handler: (event: any) => void) => {
    socketRef.current?.on("user_typing", handler);
    return () => {
      socketRef.current?.off("user_typing", handler);
    };
  }, []);

  const emitTyping = useCallback(
    (event: { ticketId: string; senderName: string; isTyping: boolean }) => {
      socketRef.current?.emit("typing", event);
    },
    []
  );

  return { sendMessage, onMessage, onTyping, emitTyping };
}
