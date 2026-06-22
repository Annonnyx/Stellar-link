"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Loader2 } from "lucide-react";
import Link from "next/link";

interface RecentTicket {
  id: string;
  code: string;
  type: string;
  status: string;
  submitterName: string;
  createdAt: string;
}

export function RecentActivity() {
  const [tickets, setTickets] = useState<RecentTicket[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((res) => res.json())
      .then((data) => {
        setTickets(data.recentTickets || []);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Activity className="h-5 w-5 text-violet-500" />
          Activité récente
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-4">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : tickets.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">Aucune activité récente</p>
        ) : (
          <div className="space-y-3">
            {tickets.map((ticket) => (
              <Link
                key={ticket.id}
                href={`/admin/tickets/${ticket.id}`}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div>
                  <p className="text-sm font-medium">{ticket.submitterName}</p>
                  <p className="text-xs text-muted-foreground">
                    {ticket.type === "SERVICE" ? "Demande de service" : ticket.type === "JOIN" ? "Candidature" : "Contact"}
                    {" · "}
                    {new Date(ticket.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
                <Badge variant="outline" className="text-xs">
                  {ticket.code}
                </Badge>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
