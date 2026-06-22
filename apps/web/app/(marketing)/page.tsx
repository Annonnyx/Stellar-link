"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Film,
  Box,
  Code,
  Music,
  Palette,
  Languages,
  MessageSquare,
  CheckCircle2,
  Send,
  PenTool,
  Truck,
  Star,
  Users,
  Zap,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const services = [
  { icon: Film, label: "Montage Vidéo", desc: "Montage, color grading et post-production" },
  { icon: Box, label: "3D", desc: "Modélisation, animation et rendu 3D" },
  { icon: Code, label: "Développement", desc: "Web, mobile, bots et apps sur mesure" },
  { icon: Music, label: "Sound Design", desc: "Création sonore, mixage et mastering" },
  { icon: Palette, label: "Graphisme", desc: "Identité visuelle et UI/UX design" },
  { icon: Languages, label: "Traduction", desc: "Traduction et localisation 20+ langues" },
  { icon: MessageSquare, label: "Serveur Discord", desc: "Serveurs Discord professionnels" },
];

const steps = [
  { icon: Send, title: "Décrivez", desc: "Remplissez le formulaire avec les détails de votre projet." },
  { icon: PenTool, title: "On estime", desc: "Recevez une estimation instantanée et discutez avec nous." },
  { icon: Zap, title: "On crée", desc: "Nos créateurs donnent vie à votre vision." },
  { icon: Truck, title: "Livré", desc: "Recevez vos fichiers et validez le résultat final." },
];

const stats = [
  { value: "150+", label: "Projets réalisés" },
  { value: "40+", label: "Créateurs actifs" },
  { value: "98%", label: "Clients satisfaits" },
  { value: "24h", label: "Temps de réponse" },
];

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.08 } },
};

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-violet-500/10 blur-[120px]" />
          <div className="absolute top-1/3 left-1/3 h-[300px] w-[400px] rounded-full bg-blue-500/10 blur-[100px]" />
        </div>

        <div className="container py-24 md:py-32 lg:py-40">
          <motion.div
            className="mx-auto max-w-3xl text-center"
            initial="initial"
            animate="animate"
            variants={stagger}
          >
            <motion.div variants={fadeInUp}>
              <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-muted/50 px-4 py-1.5 text-sm text-muted-foreground mb-6">
                <Star className="h-3.5 w-3.5 text-violet-500" />
                Agence créative nouvelle génération
              </span>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
            >
              Votre vision.
              <br />
              <span className="text-gradient">Notre expertise.</span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
            >
              L&apos;agence créative qui connecte les meilleurs talents aux projets qui comptent. Montage, 3D, dev, sound design et plus.
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Button variant="gradient" size="xl" asChild>
                <Link href="/request">
                  Demander un Service
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="xl" asChild>
                <Link href="/join">Rejoindre l&apos;Agence</Link>
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={fadeInUp}
              className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8"
            >
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-gradient">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Services */}
      <section className="py-24 border-t border-border/40">
        <div className="container">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Nos Services
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Une équipe de créateurs experts dans tous les domaines du digital.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
          >
            {services.map((service) => (
              <motion.div key={service.label} variants={fadeInUp}>
                <Card className="group relative overflow-hidden border-border/40 bg-card/50 hover:bg-card hover:border-violet-500/30 transition-all duration-300 cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-violet-500/10 text-violet-500 mb-4 group-hover:bg-violet-500/20 transition-colors">
                      <service.icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-semibold mb-2">{service.label}</h3>
                    <p className="text-sm text-muted-foreground">{service.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 border-t border-border/40 bg-muted/30">
        <div className="container">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Comment ça marche ?
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Un processus simple et transparent, de la demande à la livraison.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
          >
            {steps.map((step, i) => (
              <motion.div key={step.title} variants={fadeInUp} className="text-center">
                <div className="relative mx-auto mb-6">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/20 to-blue-500/20 border border-violet-500/20 mx-auto">
                    <step.icon className="h-7 w-7 text-violet-400" />
                  </div>
                  <div className="absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-violet-600 text-white text-xs font-bold">
                    {i + 1}
                  </div>
                </div>
                <h3 className="font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Why choose us */}
      <section className="py-24 border-t border-border/40">
        <div className="container">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Pourquoi Nova Studio ?
            </h2>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
          >
            {[
              {
                icon: Users,
                title: "Talents vérifiés",
                desc: "Chaque créateur est sélectionné et évalué avant de rejoindre notre réseau.",
              },
              {
                icon: Shield,
                title: "Projet sécurisé",
                desc: "Contrats, copyright et facturation gérés par notre équipe. Zéro stress.",
              },
              {
                icon: Zap,
                title: "Livraison rapide",
                desc: "Des délais respectés grâce à une gestion de projet rigoureuse.",
              },
            ].map((item) => (
              <motion.div key={item.title} variants={fadeInUp}>
                <Card className="border-border/40 bg-card/50 h-full">
                  <CardContent className="p-8">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-violet-500/10 text-violet-500 mb-4">
                      <item.icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                    <p className="text-muted-foreground">{item.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 border-t border-border/40">
        <div className="container">
          <motion.div
            className="relative rounded-3xl overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 to-blue-600/20" />
            <div className="absolute inset-0 bg-card/80 backdrop-blur-xl" />
            <div className="relative px-8 py-16 md:py-20 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Prêt à donner vie à votre projet ?
              </h2>
              <p className="text-muted-foreground max-w-lg mx-auto mb-8">
                Décrivez votre projet et recevez une estimation instantanée. Notre équipe vous recontacte sous 24h.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button variant="gradient" size="xl" asChild>
                  <Link href="/request">
                    Demander un Service
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="xl" asChild>
                  <Link href="/join">
                    Rejoindre notre équipe
                    <CheckCircle2 className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
