"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, Loader2 } from "lucide-react";

interface DataPoint {
  label: string;
  revenue: number;
}

export function RevenueChart() {
  const [data, setData] = useState<DataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/revenue")
      .then((r) => r.json())
      .then((d) => setData(d.data || []))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const monthNames: Record<string, string> = {
    "01": "Jan", "02": "Fév", "03": "Mar", "04": "Avr",
    "05": "Mai", "06": "Jun", "07": "Jul", "08": "Aoû",
    "09": "Sep", "10": "Oct", "11": "Nov", "12": "Déc",
  };

  const formatted = data.map((d) => {
    const parts = d.label.split("-");
    const month = parts[1] || "";
    return { name: monthNames[month] || d.label, revenue: d.revenue };
  });

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Revenus mensuels
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-48">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : formatted.length === 0 ? (
          <div className="flex items-center justify-center h-48">
            <p className="text-sm text-muted-foreground">Aucune donnée de revenus</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={formatted}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" tickFormatter={(v) => `${v}€`} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
                formatter={(value: number) => [`${value.toFixed(0)}€`, "Revenus"]}
              />
              <Bar dataKey="revenue" fill="hsl(262.1 83.3% 57.8%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
