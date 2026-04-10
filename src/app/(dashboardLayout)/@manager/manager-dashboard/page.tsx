"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { managerAPI } from "@/lib/api";
import { useEffect, useState } from "react";
import { ShoppingBag, CheckCircle, UserPlus, Users } from "lucide-react";
import { DashboardAnalyticsSection } from "@/components/modules/dashboard/analytics-section";

export default function ManagerDashboardPage() {
  const [reports, setReports] = useState<any>(null);

  useEffect(() => {
    (async () => {
      const data = await managerAPI.getReports().catch(() => null);
      setReports(data);
    })();
  }, []);

  const cards = [
    { title: "Total Orders", value: reports?.totalOrders ?? 0, icon: ShoppingBag, color: "text-blue-600", bgColor: "bg-blue-50" },
    { title: "Delivered", value: reports?.deliveredOrders ?? 0, icon: CheckCircle, color: "text-green-600", bgColor: "bg-green-50" },
    { title: "New Riders", value: reports?.pendingRiders ?? 0, icon: UserPlus, color: "text-purple-600", bgColor: "bg-purple-50" },
    { title: "Active Riders", value: reports?.activeRiders ?? 0, icon: Users, color: "text-orange-600", bgColor: "bg-orange-50" },
  ];

  return (
    <div className="space-y-8 p-2">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight bg-linear-to-r from-primary to-orange-600 bg-clip-text text-transparent">
          Manager Dashboard
        </h1>
        <p className="text-muted-foreground mt-2">
          Oversee platform operations, track performance metrics, and manage logistics.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Card key={card.title} className="overflow-hidden border shadow-sm transition-all duration-300 hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-semibold text-muted-foreground">{card.title}</CardTitle>
              <div className={`p-2 rounded-lg ${card.bgColor}`}>
                <card.icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{card.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <DashboardAnalyticsSection mode="admin" />
    </div>
  );
}
