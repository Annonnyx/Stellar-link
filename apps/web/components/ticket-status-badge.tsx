import { TICKET_STATUS_LABELS } from "@nova-studio/shared";

export function TicketStatus({ status }: { status: string }) {
  const colorMap: Record<string, string> = {
    PENDING_VERIFICATION: "bg-gray-500/10 text-gray-500",
    VERIFIED: "bg-blue-500/10 text-blue-500",
    IN_REVIEW: "bg-yellow-500/10 text-yellow-500",
    ACCEPTED: "bg-green-500/10 text-green-500",
    ASSIGNED: "bg-purple-500/10 text-purple-500",
    IN_PROGRESS: "bg-blue-600/10 text-blue-600",
    PENDING_REVISION: "bg-orange-500/10 text-orange-500",
    PENDING_PAYMENT: "bg-amber-500/10 text-amber-500",
    COMPLETED: "bg-emerald-500/10 text-emerald-500",
    REJECTED: "bg-red-500/10 text-red-500",
    CANCELLED: "bg-gray-400/10 text-gray-400",
  };

  const label = TICKET_STATUS_LABELS[status] || status;
  const colorClass = colorMap[status] || "bg-gray-500/10 text-gray-500";

  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${colorClass}`}>
      {label}
    </span>
  );
}
