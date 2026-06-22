"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MessageSquare, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <section className="py-24">
        <div className="container max-w-md mx-auto text-center">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
            <h1 className="text-2xl font-bold mb-2">Message envoyé !</h1>
            <p className="text-muted-foreground">Nous vous répondrons sous 24h.</p>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24">
      <div className="container max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Contactez-nous</h1>
          <p className="text-muted-foreground">Une question ? Un projet ? Discutons-en.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <Card className="border-border/40 bg-card/50">
            <CardContent className="p-6 text-center">
              <Mail className="h-6 w-6 text-violet-500 mx-auto mb-3" />
              <h3 className="font-semibold mb-1">Email</h3>
              <p className="text-sm text-muted-foreground">contact@novastudio.com</p>
            </CardContent>
          </Card>
          <Card className="border-border/40 bg-card/50">
            <CardContent className="p-6 text-center">
              <MessageSquare className="h-6 w-6 text-violet-500 mx-auto mb-3" />
              <h3 className="font-semibold mb-1">Discord</h3>
              <p className="text-sm text-muted-foreground">discord.gg/novastudio</p>
            </CardContent>
          </Card>
          <Card className="border-border/40 bg-card/50">
            <CardContent className="p-6 text-center">
              <MapPin className="h-6 w-6 text-violet-500 mx-auto mb-3" />
              <h3 className="font-semibold mb-1">Paris, France</h3>
              <p className="text-sm text-muted-foreground">100% remote</p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-border/40">
          <CardContent className="p-8">
            <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Nom</label>
                  <Input placeholder="Votre nom" required />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Email</label>
                  <Input type="email" placeholder="vous@email.com" required />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Sujet</label>
                <Input placeholder="Sujet de votre message" required />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Message</label>
                <Textarea placeholder="Votre message..." rows={6} required />
              </div>
              <Button variant="gradient" className="w-full">Envoyer</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
