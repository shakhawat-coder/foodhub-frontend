"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface CartItem {
    id: string;
    quantity: number;
    meal: {
        id: string;
        name: string;
        price: number;
        image: string | null;
    };
}

interface CartData {
    id: string;
    items: CartItem[];
}

export default function Cart() {
    const router = useRouter();
    const { data: session, isPending: authPending } = authClient.useSession();
    const [cart, setCart] = useState<CartData | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchCart = async () => {
        if (!session?.user?.id) return;
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart`, {
                credentials: "include"
            });
            if (!response.ok) throw new Error("Failed to fetch cart");
            const data = await response.json();
            setCart(data);
        } catch (error) {
            console.error(error);
            toast.error("Could not load your cart");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!authPending) {
            fetchCart();
        }
    }, [session, authPending]);

    const updateQuantity = async (mealId: string, quantity: number) => {
        if (!session?.user?.id || quantity < 1) return;
        try {
            // Optimistic update
            setCart(prev => prev ? {
                ...prev,
                items: prev.items.map(item => item.meal.id === mealId ? { ...item, quantity } : item)
            } : null);

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/update`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ mealId, quantity }),
            });

            if (!response.ok) throw new Error("Failed to update cart");
            fetchCart(); // Refresh to ensure sync
        } catch (error) {
            toast.error("Error updating quantity");
            fetchCart();
        }
    };

    const removeItem = async (mealId: string) => {
        if (!session?.user?.id) return;
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/remove`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ mealId }),
            });

            if (!response.ok) throw new Error("Failed to remove item");
            toast.success("Item removed");
            fetchCart();
        } catch (error) {
            toast.error("Error removing item");
        }
    };

    const calculateTotal = () => {
        return cart?.items.reduce((total, item) => total + item.meal.price * item.quantity, 0) || 0;
    };

    const handleCheckout = () => {
        if (!cart || cart.items.length === 0) {
            toast.error("Your cart is empty");
            return;
        }
        router.push("/checkout");
    };

    if (authPending || loading) {
        return (
            <div className="flex items-center justify-center min-h-100">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!session) {
        return (
            <div className="text-center py-20">
                <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                <h2 className="text-2xl font-bold mb-2">Please login to see your cart</h2>
                <Link href="/login">
                    <Button>Login Now</Button>
                </Link>
            </div>
        );
    }

    if (!cart || cart.items.length === 0) {
        return (
            <div className="text-center py-20 px-5">
                <div className="max-w-md mx-auto space-y-6">
                    <div className="bg-muted w-24 h-24 rounded-full flex items-center justify-center mx-auto">
                        <ShoppingBag className="h-12 w-12 text-muted-foreground" />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold tracking-tight">Your cart is empty</h2>
                        <p className="text-muted-foreground text-lg">
                            Looks like you haven't added anything to your cart yet.
                        </p>
                    </div>
                    <Link href="/meals">
                        <Button size="lg" className="rounded-full px-8">
                            Browse Meals <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-10 px-4">
            <h1 className="text-4xl font-bold mb-8">Your Cart</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-4">
                    {cart.items.map((item) => (
                        <Card key={item.id} className="overflow-hidden border-none shadow-sm bg-muted/30 hover:bg-muted/50 transition-colors">
                            <CardContent className="p-4 sm:p-6 flex items-center gap-4 sm:gap-6">
                                <div className="h-24 w-24 sm:h-32 sm:w-32 shrink-0 rounded-xl overflow-hidden bg-white">
                                    <img
                                        src={item.meal.image || "/placeholder-meal.jpg"}
                                        alt={item.meal.name}
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                        <h3 className="text-xl font-semibold truncate">{item.meal.name}</h3>
                                        <p className="text-xl font-bold text-primary">${item.meal.price}</p>
                                    </div>

                                    <div className="flex items-center justify-between mt-6">
                                        <div className="flex items-center gap-3 bg-background rounded-full p-1 border shadow-sm">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 rounded-full"
                                                onClick={() => updateQuantity(item.meal.id, item.quantity - 1)}
                                                disabled={item.quantity <= 1}
                                            >
                                                <Minus className="h-4 w-4" />
                                            </Button>
                                            <span className="w-8 text-center font-medium">{item.quantity}</span>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 rounded-full"
                                                onClick={() => updateQuantity(item.meal.id, item.quantity + 1)}
                                            >
                                                <Plus className="h-4 w-4" />
                                            </Button>
                                        </div>

                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                            onClick={() => removeItem(item.meal.id)}
                                        >
                                            <Trash2 className="h-5 w-5" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="lg:col-span-1">
                    <Card className="sticky top-24 border-none shadow-xl bg-gray-600 text-primary-foreground overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                        <CardContent className="p-8 relative">
                            <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
                            <div className="space-y-4 text-primary-foreground/80">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span>${calculateTotal().toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Shipping</span>
                                    <span className="text-primary-foreground font-medium italic">Free</span>
                                </div>
                                <div className="border-t border-primary-foreground/20 pt-4 mt-4">
                                    <div className="flex justify-between items-end">
                                        <span className="text-lg font-medium">Total</span>
                                        <span className="text-3xl font-bold">${calculateTotal().toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                            <Button className="w-full mt-8 bg-white text-primary hover:bg-white/90 font-bold text-lg h-14 rounded-xl shadow-lg group" onClick={handleCheckout}>
                                Checkout Now
                                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
