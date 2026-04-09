"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { managerAPI } from "@/lib/api";
import { useEffect, useState } from "react";

export default function ManagerReportsPage() {
  const [reports, setReports] = useState<any>(null);

  useEffect(() => {
    (async () => {
      const data = await managerAPI.getReports().catch(() => null);
      setReports(data);
    })();
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Reports</h1>
      <Card>
        <CardHeader>
          <CardTitle>Delivery Reports</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>Total Orders: {reports?.totalOrders ?? 0}</p>
          <p>Delivered Orders: {reports?.deliveredOrders ?? 0}</p>
          <p>Pending Riders: {reports?.pendingRiders ?? 0}</p>
          <p>Active Riders: {reports?.activeRiders ?? 0}</p>
        </CardContent>
      </Card>
    </div>
  );
}
