"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { riderAPI } from "@/lib/api";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function RiderDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [availableCount, setAvailableCount] = useState(0);
  const [historyCount, setHistoryCount] = useState(0);
  const [isAvailable, setIsAvailable] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [status, setStatus] = useState<"PICKED_UP" | "ON_THE_WAY" | "DELIVERED">("PICKED_UP");

  const fetchStats = async () => {
    try {
      setLoading(true);
      const [availableOrders, history] = await Promise.all([
        riderAPI.getAvailableOrders().catch(() => []),
        riderAPI.getHistory().catch(() => []),
      ]);
      setAvailableCount(Array.isArray(availableOrders) ? availableOrders.length : 0);
      setHistoryCount(Array.isArray(history) ? history.length : 0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const toggleAvailability = async (next: boolean) => {
    try {
      await riderAPI.updateAvailability(next);
      setIsAvailable(next);
      toast.success(`You are now ${next ? "ONLINE" : "OFFLINE"}`);
    } catch (error: any) {
      toast.error(error.message || "Failed to update availability");
    }
  };

  const submitDeliveryStatus = async () => {
    if (!orderId.trim()) {
      toast.error("Enter order id");
      return;
    }
    try {
      await riderAPI.updateOrderStatus(orderId.trim(), status);
      toast.success("Delivery status updated");
    } catch (error: any) {
      toast.error(error.message || "Failed to update delivery status");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight bg-linear-to-r from-primary to-orange-600 bg-clip-text text-transparent">
          Rider Dashboard
        </h1>
        <p className="text-muted-foreground mt-1">Manage deliveries and availability.</p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Availability</CardTitle>
          <Badge variant={isAvailable ? "default" : "secondary"}>
            {isAvailable ? "ONLINE" : "OFFLINE"}
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <Switch checked={isAvailable} onCheckedChange={toggleAvailability} />
            <span className="text-sm text-muted-foreground">Toggle rider availability</span>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Available Orders</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold">{loading ? "..." : availableCount}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Delivered Orders</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold">{loading ? "..." : historyCount}</CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Update Delivery Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input
            placeholder="Order ID"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
          />
          <Select value={status} onValueChange={(v) => setStatus(v as any)}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PICKED_UP">PICKED_UP</SelectItem>
              <SelectItem value="ON_THE_WAY">ON_THE_WAY</SelectItem>
              <SelectItem value="DELIVERED">DELIVERED</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={submitDeliveryStatus}>Update Status</Button>
        </CardContent>
      </Card>
    </div>
  );
}
