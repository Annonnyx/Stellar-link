"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import {
  joinFormStep1Schema,
  joinFormStep2Schema,
  joinFormStep3Schema,
  joinFormStep4Schema,
  type JoinFormStep1,
  type JoinFormStep2,
  type JoinFormStep3,
  type JoinFormStep4,
  type JoinFormData,
  SERVICE_CATEGORY_LABELS,
  AVAILABILITY_LABELS,
  EXPERIENCE_LABELS,
} from "@nova-studio/shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const STEPS = ["Identité", "Compétences", "Profil", "Contact"];

export default function JoinPage() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<Partial<JoinFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ticketId, setTicketId] = useState<string | null>(null);

  const step1Form = useForm<JoinFormStep1>({
    resolver: zodResolver(joinFormStep1Schema),
    defaultValues: { firstName: "", lastName: "", displayName: "", dateOfBirth: "", country: "", city: "" },
  });

  const step2Form = useForm<JoinFormStep2>({
    resolver: zodResolver(joinFormStep2Schema),
    defaultValues: { skills: [], subSpecialties: [], experienceLevel: "INTERMEDIATE", yearsExperience: 0, portfolioUrls: [], softwareTools: [], languages: [{ language: "Français", level: "native" }] },
  });

  const step3Form = useForm<JoinFormStep3>({
    resolver: zodResolver(joinFormStep3Schema),
    defaultValues: { motivation: "", availability: "OCCASIONAL", hoursPerWeek: 10, hourlyRate: 0, hasFreelanceExperience: false, hasAgencyExperience: false, howDidYouFindUs: "" },
  });

  const step4Form = useForm<JoinFormStep4>({
    resolver: zodResolver(joinFormStep4Schema),
    defaultValues: { email: "", discord: "", phone: "", website: "", acceptTerms: false as never, acceptPrivacy: false as never },
  });

  const forms = [step1Form, step2Form, step3Form, step4Form];

  async function handleNext() {
    const currentForm = forms[step];
    const valid = await currentForm.trigger();
    if (!valid) return;
    const data = currentForm.getValues();
    setFormData((prev: Partial<JoinFormData>) => ({ ...prev, ...data }));
    if (step < STEPS.length - 1) { setStep(step + 1); } 
    else { await handleSubmit({ ...formData, ...data } as JoinFormData); }
  }

  async function handleSubmit(data: JoinFormData) {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/tickets/join", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      const result = await res.json();
      setTicketId(result.ticketId);
    } catch { /* handled by UI */ } finally { setIsSubmitting(false); }
  }

  if (ticketId) {
    return (
      <section className="py-24">
        <div className="container max-w-md mx-auto text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-violet-500/10 text-violet-500 mx-auto mb-6">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Candidature envoyée !</h1>
          <p className="text-muted-foreground mb-6">Un email de vérification a été envoyé. Vérifiez votre boîte mail.</p>
          <Button variant="gradient" asChild><a href={`/verify/${ticketId}`}>Vérifier mon email</a></Button>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24">
      <div className="container max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Rejoindre l&apos;Agence</h1>
          <p className="text-muted-foreground">Rejoignez le réseau de créateurs Nova Studio et accédez à des projets passionnants.</p>
        </div>

        <div className="flex items-center gap-2 mb-8">
          {STEPS.map((label, i) => (
            <div key={label} className="flex items-center gap-2 flex-1">
              <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium transition-colors ${i <= step ? "bg-violet-600 text-white" : "bg-muted text-muted-foreground"}`}>{i + 1}</div>
              <span className={`text-sm hidden sm:block ${i <= step ? "text-foreground" : "text-muted-foreground"}`}>{label}</span>
              {i < STEPS.length - 1 && <div className={`flex-1 h-px ${i < step ? "bg-violet-600" : "bg-border"}`} />}
            </div>
          ))}
        </div>

        <Card className="border-border/40">
          <CardContent className="p-8">
            <AnimatePresence mode="wait">
              <motion.div key={step} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }}>
                {step === 0 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-1.5 block">Prénom *</label>
                        <Input {...step1Form.register("firstName")} placeholder="Jean" />
                        {step1Form.formState.errors.firstName && <p className="text-sm text-destructive mt-1">{step1Form.formState.errors.firstName.message}</p>}
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1.5 block">Nom *</label>
                        <Input {...step1Form.register("lastName")} placeholder="Dupont" />
                        {step1Form.formState.errors.lastName && <p className="text-sm text-destructive mt-1">{step1Form.formState.errors.lastName.message}</p>}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">Nom d&apos;affichage</label>
                      <Input {...step1Form.register("displayName")} placeholder="Surnom ou nom d&apos;artiste" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">Date de naissance *</label>
                      <Input {...step1Form.register("dateOfBirth")} type="date" />
                      {step1Form.formState.errors.dateOfBirth && <p className="text-sm text-destructive mt-1">{step1Form.formState.errors.dateOfBirth.message}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-1.5 block">Pays *</label>
                        <Input {...step1Form.register("country")} placeholder="France" />
                        {step1Form.formState.errors.country && <p className="text-sm text-destructive mt-1">{step1Form.formState.errors.country.message}</p>}
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1.5 block">Ville</label>
                        <Input {...step1Form.register("city")} placeholder="Paris" />
                      </div>
                    </div>
                  </div>
                )}

                {step === 1 && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">Domaines d&apos;expertise *</label>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(SERVICE_CATEGORY_LABELS).filter(([k]) => k !== "OTHER").map(([value, label]) => {
                          const current = step2Form.watch("skills") || [];
                          const isSelected = current.includes(value as never);
                          return (
                            <Badge key={value} variant={isSelected ? "default" : "outline"} className="cursor-pointer"
                              onClick={() => { const updated = isSelected ? current.filter((v: string) => v !== value) : [...current, value]; step2Form.setValue("skills", updated as never, { shouldValidate: true }); }}>
                              {label}
                            </Badge>
                          );
                        })}
                      </div>
                      {step2Form.formState.errors.skills && <p className="text-sm text-destructive mt-1">{step2Form.formState.errors.skills.message}</p>}
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">Niveau d&apos;expérience *</label>
                      <select {...step2Form.register("experienceLevel")} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm">
                        {Object.entries(EXPERIENCE_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">Années d&apos;expérience *</label>
                      <Input {...step2Form.register("yearsExperience")} type="number" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">Liens portfolio *</label>
                      <Input {...step2Form.register("portfolioUrls.0")} placeholder="https://portfolio.com" />
                      {step2Form.formState.errors.portfolioUrls && <p className="text-sm text-destructive mt-1">{step2Form.formState.errors.portfolioUrls.message}</p>}
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">Motivation *</label>
                      <Textarea {...step3Form.register("motivation")} placeholder="Pourquoi voulez-vous rejoindre Nova Studio ?" rows={6} />
                      {step3Form.formState.errors.motivation && <p className="text-sm text-destructive mt-1">{step3Form.formState.errors.motivation.message}</p>}
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">Disponibilité *</label>
                      <select {...step3Form.register("availability")} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm">
                        {Object.entries(AVAILABILITY_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">Heures par semaine *</label>
                      <Input {...step3Form.register("hoursPerWeek")} type="number" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">Taux horaire (€)</label>
                      <Input {...step3Form.register("hourlyRate")} type="number" placeholder="Optionnel" />
                    </div>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm"><input type="checkbox" {...step3Form.register("hasFreelanceExperience")} className="rounded" /> Expérience freelance</label>
                      <label className="flex items-center gap-2 text-sm"><input type="checkbox" {...step3Form.register("hasAgencyExperience")} className="rounded" /> Expérience en agence</label>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">Email *</label>
                      <Input {...step4Form.register("email")} type="email" placeholder="vous@email.com" />
                      {step4Form.formState.errors.email && <p className="text-sm text-destructive mt-1">{step4Form.formState.errors.email.message}</p>}
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">Discord *</label>
                      <Input {...step4Form.register("discord")} placeholder="username" />
                      {step4Form.formState.errors.discord && <p className="text-sm text-destructive mt-1">{step4Form.formState.errors.discord.message}</p>}
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">Téléphone</label>
                      <Input {...step4Form.register("phone")} placeholder="+33..." />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">Site web</label>
                      <Input {...step4Form.register("website")} placeholder="https://" />
                    </div>
                    <div className="space-y-3 pt-4">
                      <label className="flex items-start gap-2 text-sm">
                        <input type="checkbox" {...step4Form.register("acceptTerms")} className="rounded mt-0.5" />
                        <span>J&apos;accepte les <a href="/legal/terms" className="text-violet-500 underline">CGU</a></span>
                      </label>
                      {step4Form.formState.errors.acceptTerms && <p className="text-sm text-destructive">{step4Form.formState.errors.acceptTerms.message}</p>}
                      <label className="flex items-start gap-2 text-sm">
                        <input type="checkbox" {...step4Form.register("acceptPrivacy")} className="rounded mt-0.5" />
                        <span>J&apos;accepte la <a href="/legal/privacy" className="text-violet-500 underline">politique de confidentialité</a></span>
                      </label>
                      {step4Form.formState.errors.acceptPrivacy && <p className="text-sm text-destructive">{step4Form.formState.errors.acceptPrivacy.message}</p>}
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="flex items-center justify-between mt-8 pt-6 border-t border-border/40">
              {step > 0 ? <Button variant="ghost" onClick={() => setStep(step - 1)}><ArrowLeft className="h-4 w-4" />Précédent</Button> : <div />}
              <Button variant="gradient" onClick={handleNext} disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : step === STEPS.length - 1 ? "Envoyer la candidature" : <>{"Suivant"}<ArrowRight className="h-4 w-4" /></>}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
