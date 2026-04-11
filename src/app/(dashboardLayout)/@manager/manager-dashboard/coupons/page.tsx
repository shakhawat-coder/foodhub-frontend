"use client";

import { couponsAPI } from "@/lib/api";
import { CouponsTable } from "@/components/modules/manager/coupons-table";
import { Button } from "@/components/ui/button";
import { Plus, Ticket, Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function CouponsPage() {
    const [coupons, setCoupons] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCoupons = async () => {
            try {
                const res: any = await couponsAPI.getAll();
                setCoupons(res.data || []);
            } catch (error) {
                console.error("Failed to fetch coupons", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCoupons();
    }, []);

    return (
        <div className="p-4 lg:p-10 space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-muted/20 p-6 rounded-2xl border border-border/50 shadow-sm">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                        <div className="bg-primary/10 p-2 rounded-xl">
                            <Ticket className="w-6 h-6 text-primary" />
                        </div>
                        Coupons Management
                    </h1>
                    <p className="text-muted-foreground mt-1">Create and manage discount codes for your customers.</p>
                </div>
                <Link href="/manager-dashboard/coupons/create">
                    <Button className="gap-2 h-12 px-6 rounded-xl shadow-lg hover:shadow-primary/20 transition-all font-bold">
                        <Plus className="w-5 h-5" /> Create Coupon
                    </Button>
                </Link>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-10 h-10 animate-spin text-primary" />
                </div>
            ) : (
                <CouponsTable coupons={coupons} />
            )}
        </div>
    );
}
