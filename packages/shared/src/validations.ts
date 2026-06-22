import { z } from "zod";

// ============================================================
// ENUMS (Zod versions)
// ============================================================

export const serviceCategoryEnum = z.enum([
  "VIDEO_EDITING",
  "THREE_D",
  "DEVELOPMENT",
  "SOUND_DESIGN",
  "GRAPHIC_DESIGN",
  "TRANSLATION",
  "DISCORD_SERVER",
  "OTHER",
]);

export const experienceLevelEnum = z.enum([
  "BEGINNER",
  "INTERMEDIATE",
  "ADVANCED",
  "EXPERT",
]);

export const availabilityEnum = z.enum([
  "FULL_TIME",
  "PART_TIME",
  "OCCASIONAL",
  "WEEKEND",
]);

export const ticketStatusEnum = z.enum([
  "PENDING_VERIFICATION",
  "VERIFIED",
  "IN_REVIEW",
  "ACCEPTED",
  "ASSIGNED",
  "IN_PROGRESS",
  "PENDING_REVISION",
  "PENDING_PAYMENT",
  "COMPLETED",
  "REJECTED",
  "CANCELLED",
]);

// ============================================================
// FORMULAIRE "REJOINDRE L'AGENCE"
// ============================================================

export const joinFormStep1Schema = z.object({
  firstName: z.string().min(2, "Minimum 2 caractères").max(50),
  lastName: z.string().min(2, "Minimum 2 caractères").max(50),
  displayName: z.string().max(50).optional().or(z.literal("")),
  dateOfBirth: z.string().refine(
    (val) => {
      const date = new Date(val);
      const age = Math.floor(
        (Date.now() - date.getTime()) / (365.25 * 24 * 60 * 60 * 1000)
      );
      return age >= 16;
    },
    { message: "Vous devez avoir au moins 16 ans" }
  ),
  country: z.string().min(2, "Sélectionnez un pays"),
  city: z.string().optional().or(z.literal("")),
});

export const joinFormStep2Schema = z.object({
  skills: z.array(serviceCategoryEnum).min(1, "Sélectionnez au moins un domaine"),
  subSpecialties: z.array(z.string()).optional().default([]),
  experienceLevel: experienceLevelEnum,
  yearsExperience: z.coerce.number().min(0).max(50),
  portfolioUrls: z
    .array(z.string().url("URL invalide"))
    .min(1, "Ajoutez au moins un lien"),
  softwareTools: z.array(z.string()).optional().default([]),
  languages: z
    .array(
      z.object({
        language: z.string().min(1),
        level: z.enum(["native", "fluent", "intermediate", "basic"]),
      })
    )
    .min(1, "Ajoutez au moins une langue"),
});

export const joinFormStep3Schema = z.object({
  motivation: z
    .string()
    .min(100, "Minimum 100 caractères")
    .max(2000, "Maximum 2000 caractères"),
  availability: availabilityEnum,
  hoursPerWeek: z.coerce.number().min(5).max(40),
  hourlyRate: z.coerce.number().positive().optional().or(z.literal(0)),
  hasFreelanceExperience: z.boolean(),
  hasAgencyExperience: z.boolean(),
  howDidYouFindUs: z.string().min(1, "Sélectionnez une option"),
});

export const joinFormStep4Schema = z.object({
  email: z.string().email("Email invalide"),
  discord: z.string().min(2, "Username Discord requis"),
  phone: z.string().optional().or(z.literal("")),
  website: z.string().url("URL invalide").optional().or(z.literal("")),
  acceptTerms: z.literal(true, {
    errorMap: () => ({ message: "Vous devez accepter les CGU" }),
  }),
  acceptPrivacy: z.literal(true, {
    errorMap: () => ({
      message: "Vous devez accepter la politique de confidentialité",
    }),
  }),
});

export const joinFormSchema = joinFormStep1Schema
  .merge(joinFormStep2Schema)
  .merge(joinFormStep3Schema)
  .merge(joinFormStep4Schema);

export type JoinFormData = z.infer<typeof joinFormSchema>;
export type JoinFormStep1 = z.infer<typeof joinFormStep1Schema>;
export type JoinFormStep2 = z.infer<typeof joinFormStep2Schema>;
export type JoinFormStep3 = z.infer<typeof joinFormStep3Schema>;
export type JoinFormStep4 = z.infer<typeof joinFormStep4Schema>;

// ============================================================
// FORMULAIRE "DEMANDER UN SERVICE"
// ============================================================

export const serviceFormStep1Schema = z.object({
  clientName: z.string().min(2, "Minimum 2 caractères"),
  email: z.string().email("Email invalide"),
  discord: z.string().optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  country: z.string().min(2, "Sélectionnez un pays"),
});

export const serviceFormStep2Schema = z.object({
  serviceTypes: z
    .array(serviceCategoryEnum)
    .min(1, "Sélectionnez au moins un service"),
  projectTitle: z.string().min(3, "Minimum 3 caractères").max(100),
  description: z
    .string()
    .min(50, "Minimum 50 caractères")
    .max(5000, "Maximum 5000 caractères"),
  referenceUrls: z.array(z.string().url()).optional().default([]),
  deadline: z.string().optional().or(z.literal("")),
});

export const serviceFormStep3Schema = z.object({
  volume: z.enum(["small", "medium", "large", "very_large"]),
  complexity: z.enum(["simple", "medium", "complex", "very_complex"]),
  urgency: z.enum(["standard", "fast", "urgent", "express"]),
  isModification: z.boolean(),
  revisionsCount: z.enum(["1", "2", "3", "unlimited"]),
  isCommercial: z.boolean(),
  exclusiveRights: z.boolean(),
});

export const serviceFormStep4Schema = z.object({
  maxBudget: z.coerce.number().positive().optional().or(z.literal(0)),
  additionalComments: z.string().optional().or(z.literal("")),
  acceptTerms: z.literal(true, {
    errorMap: () => ({ message: "Vous devez accepter les CGU" }),
  }),
  acceptEstimate: z.literal(true, {
    errorMap: () => ({
      message: "Vous devez accepter que l'estimation est indicative",
    }),
  }),
});

export const serviceFormSchema = serviceFormStep1Schema
  .merge(serviceFormStep2Schema)
  .merge(serviceFormStep3Schema)
  .merge(serviceFormStep4Schema);

export type ServiceFormData = z.infer<typeof serviceFormSchema>;
export type ServiceFormStep1 = z.infer<typeof serviceFormStep1Schema>;
export type ServiceFormStep2 = z.infer<typeof serviceFormStep2Schema>;
export type ServiceFormStep3 = z.infer<typeof serviceFormStep3Schema>;
export type ServiceFormStep4 = z.infer<typeof serviceFormStep4Schema>;

// ============================================================
// CONTACT FORM
// ============================================================

export const contactFormSchema = z.object({
  name: z.string().min(2, "Minimum 2 caractères"),
  email: z.string().email("Email invalide"),
  message: z
    .string()
    .min(10, "Minimum 10 caractères")
    .max(2000, "Maximum 2000 caractères"),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

// ============================================================
// VÉRIFICATION EMAIL
// ============================================================

export const verifyEmailSchema = z.object({
  ticketId: z.string(),
  code: z.string().length(6, "Le code doit contenir 6 chiffres"),
});

export type VerifyEmailData = z.infer<typeof verifyEmailSchema>;

// ============================================================
// CHAT
// ============================================================

export const sendMessageSchema = z.object({
  discussionCode: z.string().optional(),
  ticketId: z.string().optional(),
  projectId: z.string().optional(),
  content: z.string().min(1, "Le message ne peut pas être vide").max(4000),
  type: z.enum(["TEXT", "FILE", "IMAGE"]).default("TEXT"),
  fileUrl: z.string().url().optional(),
  fileName: z.string().optional(),
});

export type SendMessageData = z.infer<typeof sendMessageSchema>;

// ============================================================
// PRICING PARAMS
// ============================================================

export const pricingParamsSchema = z.object({
  serviceTypes: z.array(serviceCategoryEnum).min(1),
  volume: z.enum(["small", "medium", "large", "very_large"]),
  complexity: z.enum(["simple", "medium", "complex", "very_complex"]),
  urgency: z.enum(["standard", "fast", "urgent", "express"]),
  isModification: z.boolean(),
  revisionsCount: z.enum(["1", "2", "3", "unlimited"]),
  isCommercial: z.boolean(),
  exclusiveRights: z.boolean(),
});
