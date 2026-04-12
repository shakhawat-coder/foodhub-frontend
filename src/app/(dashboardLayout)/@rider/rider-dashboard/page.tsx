"use client";
import DashboardLoading from "@/components/common/DashboardLoading";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { riderAPI } from "@/lib/api";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Truck, MapPin, Phone, User, Package, Loader2, CheckCircle2, Navigation, DollarSign, RefreshCw } from "lucide-react";

export default function RiderDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ available: 0, history: 0 });
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [activeOrders, setActiveOrders] = useState<any[]>([]);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [debugData, setDebugData] = useState<any>(null);

  const fetchData = async () => {
    try {
      if (activeOrders.length === 0) setLoading(true);
      const [available, history, myOrdersRes, profile] = await Promise.all([
        riderAPI.getAvailableOrders().catch((e) => { console.error(e); return []; }),
        riderAPI.getHistory().catch((e) => { console.error(e); return []; }),
        riderAPI.getMyOrders().catch((e) => { console.error(e); return { error: e.message }; }),
        riderAPI.getProfile().catch((e) => { console.error(e); return null; }),
      ]);
      
      setDebugData({ myOrdersRes, profile });

      const myOrders = Array.isArray(myOrdersRes) ? myOrdersRes : (myOrdersRes as any)?.data || [];

      setStats({
        available: Array.isArray(available) ? available.length : 0,
        history: Array.isArray(history) ? history.length : 0
      });
      setActiveOrders(myOrders);
      
      if (profile && typeof profile.isAvailable === 'boolean') {
        setIsAvailable(profile.isAvailable);
      } else if (isAvailable === null) {
        setIsAvailable(false);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000); // 10s auto-sync
    return () => clearInterval(interval);
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

  const handleUpdateStatus = async (orderId: string, currentStatus: string) => {
    const nextStatusMap: Record<string, "PICKED_UP" | "ON_THE_WAY" | "DELIVERED"> = {
        "ASSIGNED": "PICKED_UP",
        "PICKED_UP": "ON_THE_WAY",
        "ON_THE_WAY": "DELIVERED"
    };

    const nextStatus = nextStatusMap[currentStatus];
    if (!nextStatus) return;

    try {
      setUpdatingId(orderId);
      await riderAPI.updateOrderStatus(orderId, nextStatus);
      toast.success(`Order status updated to ${nextStatus.replaceAll("_", " ")}`);
      fetchData(); // Refresh list
    } catch (error: any) {
      toast.error(error.message || "Update failed");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleNavigate = (address: string) => {
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`, '_blank');
  };

  if (loading && activeOrders.length === 0) {
      return <DashboardLoading />;
  }

  return (
    <div className="space-y-8 p-1">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-primary">
            Rider Command Center
          </h1>
          <p className="text-muted-foreground mt-1">Real-time delivery management and coordination.</p>
        </div>
        <Card className="min-w-[200px] shadow-sm">
            <CardContent className="p-4 flex items-center justify-between">
                <div className="space-y-0.5">
                    <p className="text-sm font-medium">Availability</p>
                    <p className="text-xs text-muted-foreground">
                        {isAvailable === null ? "Detecting status..." : isAvailable ? "Ready for orders" : "Currently offline"}
                    </p>
                </div>
                {isAvailable === null ? (
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                ) : (
                    <Switch checked={isAvailable} onCheckedChange={toggleAvailability} />
                )}
            </CardContent>
        </Card>
      </div>

      {process.env.NODE_ENV === 'development' && debugData && (
        <Card className="bg-muted/50 border-dashed border-2">
            <CardHeader className="py-2">
                <CardTitle className="text-[10px] uppercase text-muted-foreground tracking-widest">Local Debug Console</CardTitle>
            </CardHeader>
            <CardContent>
                <pre className="text-[10px] overflow-auto max-h-[100px]">
                    {JSON.stringify(debugData, null, 2)}
                </pre>
            </CardContent>
        </Card>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="relative overflow-hidden group hover:shadow-md transition-all">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Assigned</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{activeOrders.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Pending action</p>
          </CardContent>
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
            <Package className="size-12" />
          </div>
        </Card>
        
        <Card className="relative overflow-hidden group hover:shadow-md transition-all">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Earnings Pool</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">${(stats.history * 5 + activeOrders.length * 5).toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">Estimates based on tasks</p>
          </CardContent>
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform text-green-600">
            <DollarSign className="size-12" />
          </div>
        </Card>

        <Card className="relative overflow-hidden group hover:shadow-md transition-all">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Pools</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.available}</div>
            <p className="text-xs text-muted-foreground mt-1">Orders waiting</p>
          </CardContent>
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
            <Truck className="size-12" />
          </div>
        </Card>

        <Card className="relative overflow-hidden group hover:shadow-md transition-all">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.history}</div>
            <p className="text-xs text-muted-foreground mt-1">Successful deliveries</p>
          </CardContent>
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
            <CheckCircle2 className="size-12" />
          </div>
        </Card>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2">
            <Truck className="size-5 text-primary" />
            Active Deliveries
            </h2>
            <Button variant="ghost" size="sm" onClick={fetchData} className="text-xs gap-1.5" disabled={loading}>
                <RefreshCw className={`size-3.5 ${loading ? 'animate-spin' : ''}`} />
                Sync
            </Button>
        </div>

        {activeOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-16 border-2 border-dashed rounded-3xl bg-muted/20 text-center">
            <div className="p-4 bg-muted/50 rounded-full mb-4">
              <Package className="size-10 text-muted-foreground/50" />
            </div>
            <h3 className="text-lg font-semibold">No active deliveries</h3>
            <p className="text-sm text-muted-foreground max-w-xs mt-1">
              Check back soon for new assignments or set your status to Online to accept new orders.
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {activeOrders.map((order) => (
              <Card key={order.id} className="overflow-hidden border-primary/5 hover:border-primary/20 transition-all shadow-sm">
                <div className="grid md:grid-cols-[1fr_2fr] gap-0">
                  <div className="bg-muted/30 p-6 flex flex-col justify-between border-r">
                    <div>
                      <Badge variant="outline" className="font-mono text-[10px] mb-3">
                        #{order.id.slice(-8).toUpperCase()}
                      </Badge>
                      <h3 className="text-xl font-bold">Delivery Task</h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    
                    <div className="mt-6">
                       <p className="text-xs font-bold text-primary uppercase tracking-widest mb-2">Status</p>
                       <Badge className="bg-primary/10 text-primary border-primary/20 capitalize font-medium px-3 py-1">
                         {order.status.toLowerCase().replace(/_/g, " ")}
                       </Badge>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="grid sm:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                            <User className="size-4" />
                          </div>
                          <div>
                            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-0.5">Customer</p>
                            <p className="font-semibold text-lg">{order.user?.name}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                            <MapPin className="size-4" />
                          </div>
                          <div>
                            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-0.5">Address</p>
                            <p className="text-sm leading-relaxed">{order.address}</p>
                          </div>
                        </div>

                         {order.user?.phone && (
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
                                    <Phone className="size-4" />
                                </div>
                                <div>
                                    <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-0.5">Contact</p>
                                    <p className="text-sm">{order.user.phone}</p>
                                </div>
                            </div>
                         )}
                      </div>

                      <div className="flex flex-col justify-between">
                         <div className="bg-muted/10 border p-4 rounded-xl">
                            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-3">Order Items</p>
                            <div className="space-y-2">
                                {order.items.map((item: any) => (
                                    <div key={item.id} className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">{item.quantity}x {item.meal.name}</span>
                                        <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                ))}
                                <div className="pt-2 mt-2 border-t flex justify-between font-bold">
                                    <span>Total Amount</span>
                                    <span className="text-primary">${order.totalAmount.toFixed(2)}</span>
                                </div>
                            </div>
                         </div>

                         <div className="mt-6 flex flex-col gap-3">
                            <Button 
                              variant="outline"
                              className="w-full gap-2 py-6 border-dashed hover:border-primary hover:bg-primary/5 transition-all"
                              onClick={() => handleNavigate(order.address)}
                            >
                                <Navigation className="size-4" />
                                Open in Maps
                            </Button>
                            <Button 
                              className="w-full gap-2 font-bold py-6 shadow-lg shadow-primary/20" 
                              disabled={updatingId === order.id}
                              onClick={() => handleUpdateStatus(order.id, order.status)}
                            >
                              {updatingId === order.id ? (
                                <Loader2 className="size-4 animate-spin" />
                              ) : (
                                <>
                                  <CheckCircle2 className="size-4" />
                                  {order.status === "ASSIGNED" ? "Pick Up Order" : order.status === "PICKED_UP" ? "Start Delivery" : "Mark Delivered"}
                                </>
                              )}
                            </Button>
                         </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
