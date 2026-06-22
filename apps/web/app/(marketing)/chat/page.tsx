"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Send, Loader2, Paperclip, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useSocket } from "@/hooks/use-socket";

interface Message {
  id: string;
  content: string;
  senderName: string;
  senderType: "admin" | "creator" | "client" | "system";
  createdAt: string;
}

function ChatContent() {
  const searchParams = useSearchParams();
  const code = searchParams.get("code") || "";
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [userName, setUserName] = useState("Client");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { sendMessage, onMessage } = useSocket(code);

  useEffect(() => {
    if (!code) return;
    loadMessages();
  }, [code]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!code) return;
    const cleanup = onMessage((msg: Message) => {
      setMessages((prev) => {
        if (prev.some((m) => m.id === msg.id)) return prev;
        return [...prev, msg];
      });
    });
    return cleanup;
  }, [code, onMessage]);

  async function loadMessages() {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/tickets/messages?code=${code}`);
      if (!res.ok) { setError("Code de discussion invalide"); return; }
      const data = await res.json();
      setMessages(data.messages || []);
    } catch { setError("Erreur de chargement"); }
    finally { setIsLoading(false); }
  }

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const tempId = `temp-${Date.now()}`;
    const content = newMessage.trim();
    const tempMsg: Message = { id: tempId, content, senderName: userName, senderType: "client", createdAt: new Date().toISOString() };
    setMessages((prev) => [...prev, tempMsg]);
    setNewMessage("");

    try {
      const res = await fetch("/api/tickets/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ discussionCode: code, content, senderName: userName }),
      });
      const data = await res.json();
      if (res.ok && data.message) {
        sendMessage({
          discussionCode: code,
          content: data.message.content,
          senderName: data.message.senderName,
          ticketId: data.message.ticketId,
        });
        setMessages((prev) => prev.map((m) => (m.id === tempId ? { ...m, id: data.message.id } : m)));
      }
    } catch { setError("Erreur d'envoi"); }
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setNewMessage(e.target.value);
    if (!isTyping) {
      setIsTyping(true);
    }
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 2000);
  }

  if (!code) {
    return (
      <section className="py-24">
        <div className="container max-w-md mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Accéder au chat</h1>
          <p className="text-muted-foreground mb-6">Entrez votre code de discussion pour continuer la conversation.</p>
          <form onSubmit={(e) => { e.preventDefault(); const form = e.target as HTMLFormElement; const c = (form.elements.namedItem("code") as HTMLInputElement).value; if (c) window.location.href = `/chat?code=${c}`; }}>
            <Input name="code" placeholder="ABC12345" className="mb-4 text-center text-lg font-mono tracking-wider" />
            <Button variant="gradient" className="w-full">Accéder</Button>
          </form>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16">
      <div className="container max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-4">
          <Button variant="ghost" size="icon" asChild><a href="/"><ArrowLeft className="h-4 w-4" /></a></Button>
          <div>
            <h1 className="text-lg font-semibold">Discussion</h1>
            <p className="text-xs text-muted-foreground font-mono">Code: {code}</p>
          </div>
        </div>

        <Card className="border-border/40 h-[600px] flex flex-col">
          <CardContent className="p-4 flex flex-col h-full">
            {error && <div className="text-sm text-destructive mb-2">{error}</div>}

            <div className="flex-1 overflow-y-auto space-y-3 mb-4">
              {isLoading && messages.length === 0 && (
                <div className="flex items-center justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
              )}
              {messages.map((msg) => (
                <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex ${msg.senderType === "client" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] rounded-lg px-4 py-2.5 ${msg.senderType === "client" ? "bg-violet-600 text-white" : msg.senderType === "system" ? "bg-muted text-muted-foreground text-center w-full max-w-none" : "bg-muted"}`}>
                    {msg.senderType !== "client" && msg.senderType !== "system" && (
                      <p className="text-xs font-medium mb-0.5 opacity-70">{msg.senderName}</p>
                    )}
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </motion.div>
              ))}
              <div ref={bottomRef} />
            </div>

            <form onSubmit={handleSend} className="flex items-center gap-2 pt-3 border-t border-border/40">
              <Button type="button" variant="ghost" size="icon" disabled><Paperclip className="h-4 w-4" /></Button>
              <Input value={newMessage} onChange={handleInputChange} placeholder="Votre message..." className="flex-1" />
              <Button variant="gradient" size="icon" type="submit" disabled={!newMessage.trim()}><Send className="h-4 w-4" /></Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={
      <section className="py-24">
        <div className="container max-w-md mx-auto text-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mx-auto" />
        </div>
      </section>
    }>
      <ChatContent />
    </Suspense>
  );
}
