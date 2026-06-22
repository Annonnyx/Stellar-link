"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import {
  serviceFormStep1Schema,
  serviceFormStep2Schema,
  serviceFormStep3Schema,
  serviceFormStep4Schema,
  type ServiceFormStep1,
  type ServiceFormStep2,
  type ServiceFormStep3,
  type ServiceFormStep4,
  type ServiceFormData,
  SERVICE_CATEGORY_LABELS,
  VOLUME_LABELS,
  COMPLEXITY_LABELS,
  URGENCY_LABELS,
  REVISION_LABELS,
} from "@nova-studio/shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { calculateEstimate } from "@/lib/pricing";
import { formatCurrency } from "@/lib/utils";
import type { PricingParams, ServiceCategory } from "@nova-studio/shared";

const STEPS = ["Client", "Projet", "Estimation", "Budget"];

export default function RequestPage() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<Partial<ServiceFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ticketId, setTicketId] = useState<string | null>(null);

  const step1Form = useForm<ServiceFormStep1>({
    resolver: zodResolver(serviceFormStep1Schema),
    defaultValues: { clientName: "", email: "", discord: "", phone: "", country: "" },
  });

  const step2Form = useForm<ServiceFormStep2>({
    resolver: zodResolver(serviceFormStep2Schema),
    defaultValues: { serviceTypes: [], projectTitle: "", description: "", referenceUrls: [], deadline: "" },
  });

  const step3Form = useForm<ServiceFormStep3>({
    resolver: zodResolver(serviceFormStep3Schema),
    defaultValues: {
      volume: "medium",
      complexity: "medium",
      urgency: "standard",
      isModification: false,
      revisionsCount: "2",
      isCommercial: false,
      exclusiveRights: false,
    },
  });

  const step4Form = useForm<ServiceFormStep4>({
    resolver: zodResolver(serviceFormStep4Schema),
    defaultValues: { maxBudget: 0, additionalComments: "", acceptTerms: false as never, acceptEstimate: false as never },
  });

  const forms = [step1Form, step2Form, step3Form, step4Form];

  // Live price estimation
  const step3Values = step3Form.watch();
  const serviceTypes = step2Form.watch("serviceTypes") || [];
  const estimate =
    serviceTypes.length > 0
      ? calculateEstimate({
          serviceTypes: serviceTypes as ServiceCategory[],
          ...step3Values,
        } as PricingParams)
      : null;

  async function handleNext() {
    const currentForm = forms[step];
    const valid = await currentForm.trigger();
    if (!valid) return;

    const data = currentForm.getValues();
    setFormData((prev) => ({ ...prev, ...data }));

    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      await handleSubmit({ ...formData, ...data } as ServiceFormData);
    }
  }

  async function handleSubmit(data: ServiceFormData) {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/tickets/service", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          estimatedPriceMin: estimate?.min,
          estimatedPriceMax: estimate?.max,
        }),
      });
      const result = await res.json();
      setTicketId(result.ticketId);
    } catch {
      // Error handled by UI
    } finally {
      setIsSubmitting(false);
    }
  }

  // After submit → show verification screen
  if (ticketId) {
    return (
      <section className="py-24">
        <div className="container max-w-md mx-auto text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-violet-500/10 text-violet-500 mx-auto mb-6">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Demande envoyée !</h1>
          <p className="text-muted-foreground mb-6">
            Un email de vérification a été envoyé à votre adresse. Vérifiez votre boîte mail pour continuer.
          </p>
          <Button variant="gradient" asChild>
            <a href={`/verify/${ticketId}`}>Vérifier mon email</a>
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24">
      <div className="container max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Demander un Service</h1>
          <p className="text-muted-foreground">
            Décrivez votre projet, on s&apos;occupe du reste.
          </p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-8">
          {STEPS.map((label, i) => (
            <div key={label} className="flex items-center gap-2 flex-1">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium transition-colors ${
                  i <= step
                    ? "bg-violet-600 text-white"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {i + 1}
              </div>
              <span
                className={`text-sm hidden sm:block ${
                  i <= step ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {label}
              </span>
              {i < STEPS.length - 1 && (
                <div
                  className={`flex-1 h-px ${
                    i < step ? "bg-violet-600" : "bg-border"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Form steps */}
        <Card className="border-border/40">
          <CardContent className="p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                {step === 0 && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">
                        Nom complet / Entreprise *
                      </label>
                      <Input
                        {...step1Form.register("clientName")}
                        placeholder="Votre nom ou celui de votre entreprise"
                      />
                      {step1Form.formState.errors.clientName && (
                        <p className="text-sm text-destructive mt-1">
                          {step1Form.formState.errors.clientName.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">
                        Email professionnel *
                      </label>
                      <Input
                        {...step1Form.register("email")}
                        type="email"
                        placeholder="contact@entreprise.com"
                      />
                      {step1Form.formState.errors.email && (
                        <p className="text-sm text-destructive mt-1">
                          {step1Form.formState.errors.email.message}
                        </p>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-1.5 block">
                          Discord
                        </label>
                        <Input
                          {...step1Form.register("discord")}
                          placeholder="username"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1.5 block">
                          Téléphone
                        </label>
                        <Input
                          {...step1Form.register("phone")}
                          placeholder="+33..."
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">
                        Pays *
                      </label>
                      <Input
                        {...step1Form.register("country")}
                        placeholder="France"
                      />
                      {step1Form.formState.errors.country && (
                        <p className="text-sm text-destructive mt-1">
                          {step1Form.formState.errors.country.message}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {step === 1 && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">
                        Type de service *
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(SERVICE_CATEGORY_LABELS)
                          .filter(([k]) => k !== "OTHER")
                          .map(([value, label]) => {
                            const current = step2Form.watch("serviceTypes") || [];
                            const isSelected = current.includes(value as never);
                            return (
                              <Badge
                                key={value}
                                variant={isSelected ? "default" : "outline"}
                                className="cursor-pointer"
                                onClick={() => {
                                  const updated = isSelected
                                    ? current.filter((v: string) => v !== value)
                                    : [...current, value];
                                  step2Form.setValue("serviceTypes", updated as never, {
                                    shouldValidate: true,
                                  });
                                }}
                              >
                                {label}
                              </Badge>
                            );
                          })}
                      </div>
                      {step2Form.formState.errors.serviceTypes && (
                        <p className="text-sm text-destructive mt-1">
                          {step2Form.formState.errors.serviceTypes.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">
                        Titre du projet *
                      </label>
                      <Input
                        {...step2Form.register("projectTitle")}
                        placeholder="Ex: Vidéo promotionnelle startup"
                      />
                      {step2Form.formState.errors.projectTitle && (
                        <p className="text-sm text-destructive mt-1">
                          {step2Form.formState.errors.projectTitle.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">
                        Description détaillée *
                      </label>
                      <Textarea
                        {...step2Form.register("description")}
                        placeholder="Décrivez votre projet en détail..."
                        rows={6}
                      />
                      {step2Form.formState.errors.description && (
                        <p className="text-sm text-destructive mt-1">
                          {step2Form.formState.errors.description.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">
                        Deadline souhaitée
                      </label>
                      <Input {...step2Form.register("deadline")} type="date" />
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-6">
                    <h3 className="font-semibold">Paramètres d&apos;estimation</h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-1.5 block">Volume *</label>
                        <select
                          {...step3Form.register("volume")}
                          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                        >
                          {Object.entries(VOLUME_LABELS).map(([v, l]) => (
                            <option key={v} value={v}>{l}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1.5 block">Complexité *</label>
                        <select
                          {...step3Form.register("complexity")}
                          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                        >
                          {Object.entries(COMPLEXITY_LABELS).map(([v, l]) => (
                            <option key={v} value={v}>{l}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1.5 block">Urgence *</label>
                        <select
                          {...step3Form.register("urgency")}
                          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                        >
                          {Object.entries(URGENCY_LABELS).map(([v, l]) => (
                            <option key={v} value={v}>{l}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1.5 block">Révisions *</label>
                        <select
                          {...step3Form.register("revisionsCount")}
                          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                        >
                          {Object.entries(REVISION_LABELS).map(([v, l]) => (
                            <option key={v} value={v}>{l}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          {...step3Form.register("isModification")}
                          className="rounded"
                        />
                        Modification d&apos;une production existante
                      </label>
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          {...step3Form.register("isCommercial")}
                          className="rounded"
                        />
                        Usage commercial
                      </label>
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          {...step3Form.register("exclusiveRights")}
                          className="rounded"
                        />
                        Droits exclusifs
                      </label>
                    </div>

                    {/* Price estimation */}
                    {estimate && (
                      <Card className="border-violet-500/30 bg-violet-500/5">
                        <CardContent className="p-6">
                          <h4 className="font-semibold mb-2">Estimation</h4>
                          <div className="text-3xl font-bold text-gradient mb-3">
                            {formatCurrency(estimate.min)} — {formatCurrency(estimate.max)}
                          </div>
                          <div className="space-y-1 text-sm text-muted-foreground">
                            {estimate.breakdown.map((item, i) => (
                              <div key={i} className="flex justify-between">
                                <span>{item.label}</span>
                                <span>{item.value}</span>
                              </div>
                            ))}
                          </div>
                          <p className="text-xs text-muted-foreground mt-3 italic">
                            {estimate.note}
                          </p>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">
                        Budget maximum (€)
                      </label>
                      <Input
                        {...step4Form.register("maxBudget")}
                        type="number"
                        placeholder="Optionnel"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">
                        Commentaires additionnels
                      </label>
                      <Textarea
                        {...step4Form.register("additionalComments")}
                        placeholder="Informations supplémentaires..."
                        rows={4}
                      />
                    </div>

                    {estimate && (
                      <div className="rounded-lg border border-border/40 p-4 bg-muted/30">
                        <p className="text-sm font-medium mb-1">Récapitulatif</p>
                        <p className="text-2xl font-bold text-gradient">
                          {formatCurrency(estimate.min)} — {formatCurrency(estimate.max)}
                        </p>
                      </div>
                    )}

                    <div className="space-y-3 pt-4">
                      <label className="flex items-start gap-2 text-sm">
                        <input
                          type="checkbox"
                          {...step4Form.register("acceptTerms")}
                          className="rounded mt-0.5"
                        />
                        <span>
                          J&apos;accepte les{" "}
                          <a href="/legal/terms" className="text-violet-500 underline">
                            conditions générales d&apos;utilisation
                          </a>
                        </span>
                      </label>
                      {step4Form.formState.errors.acceptTerms && (
                        <p className="text-sm text-destructive">
                          {step4Form.formState.errors.acceptTerms.message}
                        </p>
                      )}
                      <label className="flex items-start gap-2 text-sm">
                        <input
                          type="checkbox"
                          {...step4Form.register("acceptEstimate")}
                          className="rounded mt-0.5"
                        />
                        <span>
                          Je comprends que l&apos;estimation est indicative et que le prix final peut différer
                        </span>
                      </label>
                      {step4Form.formState.errors.acceptEstimate && (
                        <p className="text-sm text-destructive">
                          {step4Form.formState.errors.acceptEstimate.message}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-border/40">
              {step > 0 ? (
                <Button variant="ghost" onClick={() => setStep(step - 1)}>
                  <ArrowLeft className="h-4 w-4" />
                  Précédent
                </Button>
              ) : (
                <div />
              )}
              <Button
                variant="gradient"
                onClick={handleNext}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : step === STEPS.length - 1 ? (
                  "Envoyer la demande"
                ) : (
                  <>
                    Suivant
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
