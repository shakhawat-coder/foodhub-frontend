"use client";
import DashboardLoading from "@/components/common/DashboardLoading";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { managerAPI } from "@/lib/api";
import { useEffect, useState } from "react";

export default function ManagerOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data: any = await managerAPI.getOrders().catch(() => []);
        setOrders(Array.isArray(data) ? data : []);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return <DashboardLoading />;
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">All Orders</h1>
      <div className="grid gap-4">
        {orders.map((order) => (
          <Card key={order.id}>
            <CardHeader>
              <CardTitle className="text-sm">#{order.id.slice(-6).toUpperCase()}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <p>Status: {order.status}</p>
              <p>Address: {order.address}</p>
              <p>Total: ${Number(order.totalAmount).toFixed(2)}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
