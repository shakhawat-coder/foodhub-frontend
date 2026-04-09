"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { managerAPI } from "@/lib/api";
import { useEffect, useState } from "react";

export default function ManagerDashboardPage() {
  const [reports, setReports] = useState<any>(null);

  useEffect(() => {
    (async () => {
      const data = await managerAPI.getReports().catch(() => null);
      setReports(data);
    })();
  }, []);

  const cards = [
    { title: "Total Orders", value: reports?.totalOrders ?? 0 },
    { title: "Delivered Orders", value: reports?.deliveredOrders ?? 0 },
    { title: "Pending Riders", value: reports?.pendingRiders ?? 0 },
    { title: "Active Riders", value: reports?.activeRiders ?? 0 },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight bg-linear-to-r from-primary to-orange-600 bg-clip-text text-transparent">
        Manager Dashboard
      </h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Card key={card.title}>
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">{card.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-3xl font-bold">{card.value}</CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
