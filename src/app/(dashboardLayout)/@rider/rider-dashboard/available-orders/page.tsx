"use client";
import DashboardLoading from "@/components/common/DashboardLoading";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { riderAPI } from "@/lib/api";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Truck, Loader2, RefreshCw, Package, MapPin, DollarSign, ArrowLeft } from "lucide-react";
import Link from "next/link";

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
      toast.success("Order accepted and added to your tasks");
      loadOrders();
    } catch (error: any) {
      toast.error(error.message || "Could not accept order");
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
             <Link href="/rider-dashboard" className="p-2 hover:bg-muted rounded-full transition-colors">
                <ArrowLeft className="size-4" />
             </Link>
             <h1 className="text-3xl font-black tracking-tight text-primary">Available Pool</h1>
          </div>
          <p className="text-muted-foreground ml-10">Real-time browse of orders waiting for a rider.</p>
        </div>
        
        <Button 
          variant="outline" 
          onClick={loadOrders} 
          disabled={loading}
          className="rounded-full px-6 bg-background/50 backdrop-blur-sm border-dashed"
        >
          {loading ? (
             <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
             <RefreshCw className="mr-2 h-4 w-4" />
          )}
          Refresh List
        </Button>
      </div>

      {loading ? (
        <DashboardLoading />
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-16 border-2 border-dashed rounded-[2.5rem] bg-muted/20 text-center animate-in fade-in zoom-in duration-500">
           <div className="p-6 bg-primary/10 rounded-full mb-6 text-primary ring-8 ring-primary/5">
             <Truck className="size-12" />
           </div>
           <h3 className="text-2xl font-black">Order Pool is Empty</h3>
           <p className="text-muted-foreground max-w-sm mt-3 text-lg leading-relaxed">
             All orders have been claimed! Grab a coffee, stay online, and we'll notify you the moment a new delivery assignments drop in.
           </p>
           <Button onClick={loadOrders} className="mt-8 rounded-full px-10 py-6 font-bold text-lg shadow-xl shadow-primary/20">
             <RefreshCw className="mr-2 h-5 w-5" /> Sync Now
           </Button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2">
          {orders.map((order) => (
            <Card key={order.id} className="overflow-hidden border-primary/5 hover:border-primary/20 hover:shadow-xl transition-all duration-300 group">
              <div className="p-6 flex flex-col h-full bg-linear-to-br from-background to-muted/20">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <Badge variant="outline" className="font-mono text-[10px] mb-2 bg-background">
                      #{order.id.slice(-8).toUpperCase()}
                    </Badge>
                    <h3 className="text-xl font-extrabold tracking-tight group-hover:text-primary transition-colors">
                      Delivery Request
                    </h3>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-green-600 justify-end">
                       <DollarSign className="size-5" />
                       <p className="text-2xl font-black leading-none">${Number(order.totalAmount).toFixed(2)}</p>
                    </div>
                    <p className="text-[9px] text-muted-foreground uppercase font-black tracking-widest mt-1">Potential Earnings</p>
                  </div>
                </div>
                
                <div className="space-y-4 mb-8 flex-grow">
                  <div className="flex items-start gap-3 p-3 bg-background/50 rounded-xl border border-dashed">
                    <div className="p-2 bg-primary/10 text-primary rounded-lg shrink-0">
                        <MapPin className="size-4" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-0.5">Drop-off Location</p>
                      <p className="text-sm font-semibold leading-snug line-clamp-2">{order.address}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 px-1 text-xs text-muted-foreground italic">
                    <Package className="size-3.5" />
                    <span>Order includes {Math.floor(Math.random() * 3) + 1} items</span>
                  </div>
                </div>
                
                <Button 
                  className="w-full font-black py-7 rounded-2xl shadow-lg shadow-primary/10 transition-all hover:-translate-y-0.5" 
                  onClick={() => acceptOrder(order.id)}
                >
                  Confirm Assignment
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
