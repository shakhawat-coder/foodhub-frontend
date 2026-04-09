"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { riderAPI } from "@/lib/api";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function RiderAvailableOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data: any = await riderAPI.getAvailableOrders();
      setOrders(Array.isArray(data) ? data : []);
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch available orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const acceptOrder = async (id: string) => {
    try {
      await riderAPI.acceptOrder(id);
      toast.success("Order accepted");
      loadOrders();
    } catch (error: any) {
      toast.error(error.message || "Could not accept order");
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Available Orders</h1>
      {loading ? (
        <p>Loading...</p>
      ) : orders.length === 0 ? (
        <p className="text-muted-foreground">No available orders right now.</p>
      ) : (
        <div className="grid gap-4">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-sm">Order #{order.id.slice(-6).toUpperCase()}</CardTitle>
                <Button size="sm" onClick={() => acceptOrder(order.id)}>
                  Accept
                </Button>
              </CardHeader>
              <CardContent>
                <p className="text-sm">Address: {order.address}</p>
                <p className="text-sm">Amount: ${Number(order.totalAmount).toFixed(2)}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
