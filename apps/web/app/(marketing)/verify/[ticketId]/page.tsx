"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Loader2, MessageSquare, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function VerifyPage() {
  const { ticketId } = useParams<{ ticketId: string }>();
  const router = useRouter();
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState("");
  const [verified, setVerified] = useState(false);
  const [discussionCode, setDiscussionCode] = useState("");

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    setError("");
    if (value && index < 5) {
      const next = document.getElementById(`otp-${index + 1}`) as HTMLInputElement;
      next?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      const prev = document.getElementById(`otp-${index - 1}`) as HTMLInputElement;
      prev?.focus();
    }
  };

  async function handleVerify() {
    const fullCode = code.join("");
    if (fullCode.length !== 6) { setError("Code incomplet"); return; }
    setIsVerifying(true);
    setError("");
    try {
      const res = await fetch("/api/tickets/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticketId, code: fullCode }),
      });
      const data = await res.json();
      if (res.ok) {
        setVerified(true);
        setDiscussionCode(data.discussionCode);
      } else {
        setError(data.error || "Code invalide");
      }
    } catch { setError("Erreur de vérification"); } finally { setIsVerifying(false); }
  }

  if (verified) {
    return (
      <section className="py-24">
        <div className="container max-w-md mx-auto text-center">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 200 }}>
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 mx-auto mb-6">
              <MessageSquare className="h-8 w-8" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Email vérifié !</h1>
            <p className="text-muted-foreground mb-6">Voici votre code de discussion pour accéder au chat.</p>
            <Card className="border-violet-500/30 bg-violet-500/5 mb-6">
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground mb-2">Code de discussion</p>
                <p className="text-3xl font-mono font-bold text-gradient">{discussionCode}</p>
              </CardContent>
            </Card>
            <Button variant="gradient" onClick={() => router.push(`/chat?code=${discussionCode}`)}>Accéder au chat</Button>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24">
      <div className="container max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-violet-500/10 text-violet-500 mx-auto mb-6">
            <Mail className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Vérifiez votre email</h1>
          <p className="text-muted-foreground">Un code à 6 chiffres a été envoyé à votre adresse email.</p>
        </div>

        <Card className="border-border/40">
          <CardContent className="p-8">
            <div className="flex justify-center gap-2 mb-6">
              {code.map((digit, i) => (
                <input key={i} id={`otp-${i}`} type="text" maxLength={1} value={digit}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  className="h-12 w-12 rounded-lg border border-input bg-background text-center text-2xl font-bold focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none transition-all"
                />
              ))}
            </div>

            {error && (
              <div className="flex items-center gap-2 text-sm text-destructive mb-4 justify-center">
                <AlertCircle className="h-4 w-4" />{error}
              </div>
            )}

            <Button variant="gradient" className="w-full" onClick={handleVerify} disabled={isVerifying}>
              {isVerifying ? <Loader2 className="h-4 w-4 animate-spin" /> : "Vérifier"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
