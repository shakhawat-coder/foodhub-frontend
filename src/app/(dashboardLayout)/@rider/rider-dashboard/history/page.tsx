"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { riderAPI } from "@/lib/api";
import { useEffect, useState } from "react";

export default function RiderHistoryPage() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data: any = await riderAPI.getHistory();
        setHistory(Array.isArray(data) ? data : []);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Delivery History</h1>
      {loading ? (
        <p>Loading...</p>
      ) : history.length === 0 ? (
        <p className="text-muted-foreground">No delivery history yet.</p>
      ) : (
        <div className="grid gap-4">
          {history.map((order) => (
            <Card key={order.id}>
              <CardHeader>
                <CardTitle className="text-sm">Order #{order.id.slice(-6).toUpperCase()}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                <p>Status: {order.status}</p>
                <p>Amount: ${Number(order.totalAmount).toFixed(2)}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
