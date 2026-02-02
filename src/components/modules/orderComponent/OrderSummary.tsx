"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  CheckCircle,
  CreditCard,
  Download,
  MapPin,
  Package,
  Printer,
  Truck,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { ordersAPI } from "@/lib/api";


import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface OrderItem {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  details?: { label: string; value: string }[];
}

interface ShippingAddress {
  name: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone?: string;
}

interface PaymentMethod {
  type: "card" | "paypal" | "bank";
  lastFour?: string;
  cardBrand?: string;
  email?: string;
}

interface OrderSummaryData {
  orderNumber: string;
  orderDate: string;
  status: string;
  email: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  discount?: number;
  total: number;
  shippingAddress: ShippingAddress;
  shippingMethod: string;
  estimatedDelivery: string;
  paymentMethod: PaymentMethod;
}


interface OrderSummaryProps {
  order?: OrderSummaryData;
  orderId?: string;
  className?: string;
}

const OrderSummary = ({
  order: initialOrder,
  orderId,
  className,
}: OrderSummaryProps) => {
  const [order, setOrder] = useState<OrderSummaryData | null>(initialOrder || null);
  const [loading, setLoading] = useState(!initialOrder && !!orderId);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) return;
      try {
        const data: any = await ordersAPI.getById(orderId);


        const subtotal = data.items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);
        const tax = data.totalAmount - subtotal;

        // Map backend order to frontend OrderSummaryData
        const mappedOrder: OrderSummaryData = {
          orderNumber: data.id.toUpperCase(),
          orderDate: new Date(data.createdAt).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          }),
          status: data.status,
          email: data.user.email,
          items: data.items.map((item: any) => ({
            id: item.id,
            name: item.meal.name,
            image: item.meal.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
            price: item.price,
            quantity: item.quantity,
          })),
          subtotal: subtotal,
          shipping: 0,
          tax: tax,
          total: data.totalAmount,
          shippingAddress: {
            name: data.address.split(',')[0].trim(),
            street: data.address.split(',')[1]?.trim() || "",
            city: data.address.split(',')[2]?.trim() || "",
            state: "",
            zipCode: data.address.split(',')[3]?.trim() || "",
            country: data.address.split(',')[4]?.trim() || "Bangladesh",
            phone: data.address.split('PH:')[1]?.trim() || "",
          },
          shippingMethod: "Standard Delivery",
          estimatedDelivery: "30-45 minutes",
          paymentMethod: {
            type: "bank",
            lastFour: "",
            cardBrand: "Cash on Delivery",
          }
        };
        setOrder(mappedOrder);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load order summary");
      } finally {
        setLoading(false);
      }
    };

    if (!initialOrder && orderId) {
      fetchOrder();
    }
  }, [orderId, initialOrder]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="py-32 text-center">
        <h1 className="text-2xl font-bold">Order not found</h1>
        <p className="mt-2 text-muted-foreground">We couldn't find the requested order details.</p>
      </div>
    );
  }
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<
      string,
      { label: string; className: string }
    > = {
      PENDING: {
        label: "Pending",
        className: "bg-amber-500/10 text-amber-600 hover:bg-amber-500/10",
      },
      PREPARING: {
        label: "Preparing",
        className: "bg-blue-500/10 text-blue-600 hover:bg-blue-500/10",
      },
      OUT_FOR_DELIVERY: {
        label: "Out for Delivery",
        className: "bg-indigo-500/10 text-indigo-600 hover:bg-indigo-500/10",
      },
      DELIVERED: {
        label: "Delivered",
        className: "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/10",
      },
      CANCELLED: {
        label: "Cancelled",
        className: "bg-red-500/10 text-red-600 hover:bg-red-500/10",
      },
      confirmed: {
        label: "Order Confirmed",
        className: "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/10",
      },
    };
    return variants[status] || variants.confirmed;
  };

  const statusBadge = getStatusBadge(order.status);

  return (
    <section className={cn("py-16 md:py-24", className)}>
      <div className="container max-w-4xl mx-auto">
        {/* Success Header */}
        <div className="mb-10 text-center">
          <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-emerald-500/10">
            <CheckCircle className="size-8 text-emerald-600" />
          </div>
          <h1 className="mb-2 text-2xl font-bold tracking-tight md:text-3xl">
            Thank you for your order!
          </h1>
          <p className="text-muted-foreground">
            A confirmation email has been sent to{" "}
            <span className="font-medium text-foreground">{order.email}</span>
          </p>
        </div>

        {/* Order Info Bar */}
        <Card className="mb-6 shadow-none">
          <CardContent className="flex flex-wrap items-center justify-between gap-4 p-4 md:p-6">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
              <div>
                <p className="text-sm text-muted-foreground">Order Number</p>
                <p className="font-semibold">{order.orderNumber}</p>
              </div>
              <Separator
                orientation="vertical"
                className="hidden h-10 md:block"
              />
              <div>
                <p className="text-sm text-muted-foreground">Order Date</p>
                <p className="font-medium">{order.orderDate}</p>
              </div>
            </div>
            <Badge className={statusBadge.className}>{statusBadge.label}</Badge>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Items & Totals */}
          <div className="space-y-6 lg:col-span-2">
            {/* Order Items */}
            <Card className="shadow-none">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Package className="size-5" />
                  Items Ordered
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={item.id}>
                    <div className="flex gap-4">
                      <div className="w-20 shrink-0">
                        <AspectRatio
                          ratio={1}
                          className="overflow-hidden rounded-lg bg-muted"
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            className="size-full object-cover"
                          />
                        </AspectRatio>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-medium">{item.name}</h3>
                        {item.details && (
                          <p className="mt-0.5 text-sm text-muted-foreground">
                            {item.details.map((d, i) => (
                              <span key={d.label}>
                                {d.value}
                                {i < item.details!.length - 1 && " · "}
                              </span>
                            ))}
                          </p>
                        )}
                        <p className="mt-1 text-sm text-muted-foreground">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                        {item.quantity > 1 && (
                          <p className="text-sm text-muted-foreground">
                            {formatPrice(item.price)} each
                          </p>
                        )}
                      </div>
                    </div>
                    {index < order.items.length - 1 && (
                      <Separator className="mt-4" />
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Order Totals */}
            <Card className="shadow-none">
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatPrice(order.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>
                      {order.shipping === 0
                        ? "Free"
                        : formatPrice(order.shipping)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax</span>
                    <span>{formatPrice(order.tax)}</span>
                  </div>
                  {order.discount && order.discount > 0 && (
                    <div className="flex justify-between text-sm text-emerald-600">
                      <span>Discount</span>
                      <span>-{formatPrice(order.discount)}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total Paid</span>
                    <span>{formatPrice(order.total)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Shipping & Payment */}
          <div className="space-y-6">
            {/* Shipping Information */}
            <Card className="shadow-none">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <MapPin className="size-5" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="font-medium">{order.shippingAddress.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {order.shippingAddress.street}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                    {order.shippingAddress.zipCode}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {order.shippingAddress.country}
                  </p>
                  <p className="text-sm font-medium mt-2">
                    {order.shippingAddress.phone ? `Phone: ${order.shippingAddress.phone}` : ''}
                  </p>
                </div>
                <Separator />
                <div className="flex items-start gap-3">
                  <Truck className="mt-0.5 size-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">
                      {order.shippingMethod}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Estimated delivery: {order.estimatedDelivery}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Information */}
            <Card className="shadow-none">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <CreditCard className="size-5" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent>
                {order.paymentMethod.type === "bank" && (
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-md bg-muted text-primary">
                      <CreditCard className="size-6" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        {order.paymentMethod.cardBrand}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Payment on reaching destination
                      </p>
                    </div>
                  </div>
                )}
                {order.paymentMethod.type === "card" && (
                  <div className="flex items-center gap-3">
                    <img
                      src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/visa-icon.svg"
                      alt="Visa"
                      className="size-8"
                    />
                    <div>
                      <p className="text-sm font-medium">
                        {order.paymentMethod.cardBrand} ending in{" "}
                        {order.paymentMethod.lastFour}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Payment completed
                      </p>
                    </div>
                  </div>
                )}
                {order.paymentMethod.type === "paypal" && (
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-md bg-muted">
                      <img
                        src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/paypal-icon.svg"
                        alt="PayPal"
                        className="size-5"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium">PayPal</p>
                      <p className="text-sm text-muted-foreground">
                        {order.paymentMethod.email}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Continue Shopping */}
        <div className="mt-10 text-center">
          <div className="flex flex-wrap justify-center gap-3">
            <Button asChild>
              <a href="/meals">Continue Shopping</a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export { OrderSummary };
