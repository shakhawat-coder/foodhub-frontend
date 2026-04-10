"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { managerAPI } from "@/lib/api";
import { toast } from "sonner";
import { Loader2, Truck, ShoppingBag, UserCheck, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function ManagerAssignRiderPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [riders, setRiders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submittingOrderId, setSubmittingOrderId] = useState<string | null>(null);
  const [selectedRiderId, setSelectedRiderId] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [oData, rData] = (await Promise.all([
        managerAPI.getOrders(),
        managerAPI.getRiders(),
      ])) as [any, any];
      // Filter pending orders and available riders
      setOrders(oData.filter((o: any) => o.status === "CONFIRMED" || o.status === "PREPARING"));
      setRiders(rData.filter((r: any) => r.status === "APPROVED"));
    } catch (error) {
      toast.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAssign = async (orderId: string) => {
    if (!selectedRiderId) {
      toast.error("Please select a rider first");
      return;
    }

    try {
      setSubmittingOrderId(orderId);
      await managerAPI.assignRider(orderId, selectedRiderId);
      toast.success("Rider assigned successfully");
      fetchData(); // Refresh data
    } catch (error: any) {
      toast.error(error.message || "Failed to assign rider");
    } finally {
      setSubmittingOrderId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight bg-linear-to-r from-primary to-orange-600 bg-clip-text text-transparent">
          Rider Assignment
        </h1>
        <p className="text-muted-foreground">Manage order logistics and assign riders to pending tasks.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column: Orders List */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-primary" />
            Pending Orders ({orders.length})
          </h2>
          {orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-xl bg-muted/20">
              <AlertCircle className="h-10 w-10 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No orders awaiting assignment.</p>
            </div>
          ) : (
            orders.map((order) => (
              <Card key={order.id} className={`transition-all ${submittingOrderId === order.id ? "opacity-50" : ""}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-sm font-mono">#{order.id.slice(-8).toUpperCase()}</CardTitle>
                      <CardDescription>{order.user.name} • {order.items.length} items</CardDescription>
                    </div>
                    <Badge variant={order.status === "CONFIRMED" ? "secondary" : "outline"} className="capitalize">
                      {order.status.toLowerCase().replace("_", " ")}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                   <div className="flex items-center justify-between gap-4">
                      <div className="text-sm text-muted-foreground truncate">
                        {order.items.map((i: any) => i.meal.name).join(", ")}
                      </div>
                      <Button 
                        size="sm" 
                        onClick={() => handleAssign(order.id)}
                        disabled={!!submittingOrderId || !selectedRiderId}
                      >
                        {submittingOrderId === order.id ? <Loader2 className="h-3 w-3 animate-spin mr-2" /> : <Truck className="h-4 w-4 mr-2" />}
                        Assign Rider
                      </Button>
                   </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Right Column: Rider Selection */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-primary" />
            Active Riders ({riders.length})
          </h2>
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="text-sm">Select Available Rider</CardTitle>
              <CardDescription>Only approved riders are shown.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
              {riders.map((rider) => (
                <div 
                  key={rider.id}
                  onClick={() => setSelectedRiderId(rider.id)}
                  className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all hover:border-primary/50 ${selectedRiderId === rider.id ? "border-primary bg-primary/5 shadow-sm" : "bg-card"}`}
                >
                  <div>
                    <p className="text-sm font-medium">{rider.user.name}</p>
                    <Badge variant={rider.isAvailable ? "default" : "secondary"} className="text-[10px] h-4">
                      {rider.isAvailable ? "Online" : "Offline"}
                    </Badge>
                  </div>
                  <div className="text-right">
                     <p className="text-[10px] text-muted-foreground">{rider.vehicleType}</p>
                  </div>
                </div>
              ))}
              {riders.length === 0 && (
                <p className="text-center py-4 text-sm text-muted-foreground">No riders found.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
