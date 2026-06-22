// ============================================================
// ENUMS (mirroring Prisma enums for use in frontend)
// ============================================================

export enum Role {
  ADMIN = "ADMIN",
  CREATOR = "CREATOR",
  CLIENT = "CLIENT",
}

export enum ServiceCategory {
  VIDEO_EDITING = "VIDEO_EDITING",
  THREE_D = "THREE_D",
  DEVELOPMENT = "DEVELOPMENT",
  SOUND_DESIGN = "SOUND_DESIGN",
  GRAPHIC_DESIGN = "GRAPHIC_DESIGN",
  TRANSLATION = "TRANSLATION",
  DISCORD_SERVER = "DISCORD_SERVER",
  OTHER = "OTHER",
}

export enum TicketType {
  JOIN = "JOIN",
  SERVICE = "SERVICE",
  CONTACT = "CONTACT",
}

export enum TicketStatus {
  PENDING_VERIFICATION = "PENDING_VERIFICATION",
  VERIFIED = "VERIFIED",
  IN_REVIEW = "IN_REVIEW",
  ACCEPTED = "ACCEPTED",
  ASSIGNED = "ASSIGNED",
  IN_PROGRESS = "IN_PROGRESS",
  PENDING_REVISION = "PENDING_REVISION",
  PENDING_PAYMENT = "PENDING_PAYMENT",
  COMPLETED = "COMPLETED",
  REJECTED = "REJECTED",
  CANCELLED = "CANCELLED",
}

export enum ProjectStatus {
  DRAFT = "DRAFT",
  PLANNING = "PLANNING",
  IN_PROGRESS = "IN_PROGRESS",
  IN_REVISION = "IN_REVISION",
  PENDING_APPROVAL = "PENDING_APPROVAL",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
  ON_HOLD = "ON_HOLD",
}

export enum InvoiceStatus {
  DRAFT = "DRAFT",
  SENT = "SENT",
  PAID = "PAID",
  OVERDUE = "OVERDUE",
  CANCELLED = "CANCELLED",
  REFUNDED = "REFUNDED",
}

export enum Availability {
  FULL_TIME = "FULL_TIME",
  PART_TIME = "PART_TIME",
  OCCASIONAL = "OCCASIONAL",
  WEEKEND = "WEEKEND",
}

export enum ExperienceLevel {
  BEGINNER = "BEGINNER",
  INTERMEDIATE = "INTERMEDIATE",
  ADVANCED = "ADVANCED",
  EXPERT = "EXPERT",
}

export enum MessageType {
  TEXT = "TEXT",
  FILE = "FILE",
  SYSTEM = "SYSTEM",
  IMAGE = "IMAGE",
}

export enum NotificationType {
  TICKET_NEW = "TICKET_NEW",
  TICKET_VERIFIED = "TICKET_VERIFIED",
  TICKET_STATUS_CHANGED = "TICKET_STATUS_CHANGED",
  MESSAGE_NEW = "MESSAGE_NEW",
  TASK_AVAILABLE = "TASK_AVAILABLE",
  TASK_ASSIGNED = "TASK_ASSIGNED",
  PROJECT_UPDATED = "PROJECT_UPDATED",
  PAYMENT_RECEIVED = "PAYMENT_RECEIVED",
  INVOICE_SENT = "INVOICE_SENT",
  SYSTEM = "SYSTEM",
}

// ============================================================
// INTERFACES
// ============================================================

export interface PricingParams {
  serviceTypes: ServiceCategory[];
  volume: "small" | "medium" | "large" | "very_large";
  complexity: "simple" | "medium" | "complex" | "very_complex";
  urgency: "standard" | "fast" | "urgent" | "express";
  isModification: boolean;
  revisionsCount: "1" | "2" | "3" | "unlimited";
  isCommercial: boolean;
  exclusiveRights: boolean;
}

export interface PriceEstimate {
  min: number;
  max: number;
  breakdown: PriceBreakdownItem[];
  note: string;
}

export interface PriceBreakdownItem {
  label: string;
  value: string;
  multiplier?: number;
}

export interface ServiceInfo {
  category: ServiceCategory;
  label: string;
  description: string;
  icon: string;
  basePriceMin: number;
  basePriceMax: number;
  unit: string;
}

export interface SocketMessage {
  id: string;
  content: string;
  type: MessageType;
  senderName: string;
  senderType: "admin" | "creator" | "client" | "system";
  senderId?: string;
  fileUrl?: string;
  fileName?: string;
  createdAt: string;
}

export interface SocketTypingEvent {
  roomId: string;
  userName: string;
  isTyping: boolean;
}
