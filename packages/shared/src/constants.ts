import { ServiceCategory } from "./types";
import type { ServiceInfo } from "./types";

// ============================================================
// SERVICES
// ============================================================

export const SERVICES: ServiceInfo[] = [
  {
    category: ServiceCategory.VIDEO_EDITING,
    label: "Montage Vidéo",
    description: "Montage professionnel, color grading, motion design et post-production vidéo.",
    icon: "Film",
    basePriceMin: 50,
    basePriceMax: 200,
    unit: "jour",
  },
  {
    category: ServiceCategory.THREE_D,
    label: "3D",
    description: "Modélisation, animation, rendu 3D et effets visuels.",
    icon: "Box",
    basePriceMin: 80,
    basePriceMax: 300,
    unit: "jour",
  },
  {
    category: ServiceCategory.DEVELOPMENT,
    label: "Développement",
    description: "Développement web, mobile, bots et applications sur mesure.",
    icon: "Code",
    basePriceMin: 100,
    basePriceMax: 350,
    unit: "jour",
  },
  {
    category: ServiceCategory.SOUND_DESIGN,
    label: "Sound Design",
    description: "Création sonore, composition musicale, mixage et mastering.",
    icon: "Music",
    basePriceMin: 60,
    basePriceMax: 250,
    unit: "jour",
  },
  {
    category: ServiceCategory.GRAPHIC_DESIGN,
    label: "Graphisme",
    description: "Identité visuelle, illustrations, UI/UX design et supports graphiques.",
    icon: "Palette",
    basePriceMin: 50,
    basePriceMax: 200,
    unit: "jour",
  },
  {
    category: ServiceCategory.TRANSLATION,
    label: "Traduction",
    description: "Traduction professionnelle et localisation dans plus de 20 langues.",
    icon: "Languages",
    basePriceMin: 0.08,
    basePriceMax: 0.15,
    unit: "mot",
  },
  {
    category: ServiceCategory.DISCORD_SERVER,
    label: "Serveur Discord",
    description: "Création et configuration complète de serveurs Discord professionnels.",
    icon: "MessageSquare",
    basePriceMin: 100,
    basePriceMax: 500,
    unit: "forfait",
  },
];

export const SERVICE_CATEGORY_LABELS: Record<ServiceCategory, string> = {
  [ServiceCategory.VIDEO_EDITING]: "Montage Vidéo",
  [ServiceCategory.THREE_D]: "3D",
  [ServiceCategory.DEVELOPMENT]: "Développement",
  [ServiceCategory.SOUND_DESIGN]: "Sound Design",
  [ServiceCategory.GRAPHIC_DESIGN]: "Graphisme",
  [ServiceCategory.TRANSLATION]: "Traduction",
  [ServiceCategory.DISCORD_SERVER]: "Serveur Discord",
  [ServiceCategory.OTHER]: "Autre",
};

// ============================================================
// PRICING MULTIPLIERS
// ============================================================

export const VOLUME_DAYS: Record<string, { min: number; max: number }> = {
  small: { min: 0.5, max: 1 },
  medium: { min: 1, max: 3 },
  large: { min: 3, max: 7 },
  very_large: { min: 7, max: 15 },
};

export const COMPLEXITY_MULTIPLIER: Record<string, number> = {
  simple: 1.0,
  medium: 1.3,
  complex: 1.7,
  very_complex: 2.2,
};

export const URGENCY_MULTIPLIER: Record<string, number> = {
  standard: 1.0,
  fast: 1.2,
  urgent: 1.5,
  express: 2.0,
};

export const REVISION_MULTIPLIER: Record<string, number> = {
  "1": 1.0,
  "2": 1.1,
  "3": 1.2,
  unlimited: 1.4,
};

export const EXCLUSIVE_RIGHTS_MULTIPLIER = 1.3;
export const COMMERCIAL_MULTIPLIER = 1.15;
export const MODIFICATION_DISCOUNT = 0.7;

// ============================================================
// TICKET
// ============================================================

export const TICKET_CODE_PREFIX = {
  JOIN: "NS-J-",
  SERVICE: "NS-S-",
  CONTACT: "NS-C-",
} as const;

export const VERIFICATION_CODE_LENGTH = 6;
export const VERIFICATION_CODE_EXPIRY_MINUTES = 60;
export const MAX_VERIFICATION_ATTEMPTS = 5;
export const MAX_RESEND_PER_HOUR = 3;

// ============================================================
// UI LABELS
// ============================================================

export const VOLUME_LABELS: Record<string, string> = {
  small: "Petit (< 1 jour)",
  medium: "Moyen (1-3 jours)",
  large: "Grand (3-7 jours)",
  very_large: "Très grand (7+ jours)",
};

export const COMPLEXITY_LABELS: Record<string, string> = {
  simple: "Simple",
  medium: "Moyenne",
  complex: "Complexe",
  very_complex: "Très complexe",
};

export const URGENCY_LABELS: Record<string, string> = {
  standard: "Standard (2 semaines+)",
  fast: "Rapide (1 semaine)",
  urgent: "Urgent (< 3 jours)",
  express: "Express (24-48h)",
};

export const REVISION_LABELS: Record<string, string> = {
  "1": "1 révision",
  "2": "2 révisions",
  "3": "3 révisions",
  unlimited: "Illimitées",
};

export const AVAILABILITY_LABELS: Record<string, string> = {
  FULL_TIME: "Temps plein",
  PART_TIME: "Mi-temps",
  OCCASIONAL: "Occasionnel",
  WEEKEND: "Week-end",
};

export const EXPERIENCE_LABELS: Record<string, string> = {
  BEGINNER: "Débutant",
  INTERMEDIATE: "Intermédiaire",
  ADVANCED: "Avancé",
  EXPERT: "Expert",
};

export const TICKET_STATUS_LABELS: Record<string, string> = {
  PENDING_VERIFICATION: "En attente de vérification",
  VERIFIED: "Vérifié",
  IN_REVIEW: "En examen",
  ACCEPTED: "Accepté",
  ASSIGNED: "Assigné",
  IN_PROGRESS: "En cours",
  PENDING_REVISION: "En révision",
  PENDING_PAYMENT: "En attente de paiement",
  COMPLETED: "Terminé",
  REJECTED: "Refusé",
  CANCELLED: "Annulé",
};

export const TICKET_STATUS_COLORS: Record<string, string> = {
  PENDING_VERIFICATION: "bg-gray-500",
  VERIFIED: "bg-blue-500",
  IN_REVIEW: "bg-yellow-500",
  ACCEPTED: "bg-green-500",
  ASSIGNED: "bg-purple-500",
  IN_PROGRESS: "bg-blue-600",
  PENDING_REVISION: "bg-orange-500",
  PENDING_PAYMENT: "bg-amber-500",
  COMPLETED: "bg-emerald-500",
  REJECTED: "bg-red-500",
  CANCELLED: "bg-gray-400",
};
