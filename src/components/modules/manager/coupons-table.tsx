"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { format } from 'date-fns'
import { Edit2, Trash2, Ticket } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { couponsAPI } from '@/lib/api'
import { Switch } from "@/components/ui/switch"
import { AddCouponForm } from './add-coupon-form'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { cn } from '@/lib/utils'

interface Coupon {
    id: string;
    code: string;
    description?: string;
    discountPercent: number;
    minOrderAmount: number;
    maxDiscount?: number;
    expiryDate: string;
    isActive: boolean;
    createdAt: string;
}

interface CouponsTableProps {
    coupons: Coupon[]
}

export function CouponsTable({ coupons }: CouponsTableProps) {
    const router = useRouter();
    const [editCoupon, setEditCoupon] = useState<Coupon | null>(null);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this coupon?")) return;
        try {
            await couponsAPI.remove(id);
            toast.success("Coupon deleted successfully");
            router.refresh();
        } catch (error) {
            toast.error("Failed to delete coupon");
        }
    };

    const handleToggleStatus = async (id: string, currentStatus: boolean) => {
        try {
            await couponsAPI.update(id, { isActive: !currentStatus });
            toast.success("Coupon status updated");
            router.refresh();
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    if (coupons.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-muted/30 rounded-2xl border-2 border-dashed">
                <Ticket className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold">No coupons found</h3>
                <p className="text-muted-foreground mt-2 text-center max-w-sm">
                    Start by creating your first discount coupon to incentivize your customers.
                </p>
            </div>
        )
    }

    return (
        <div className="rounded-xl border bg-card shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md">
            <Table>
                <TableHeader className="bg-muted/50">
                    <TableRow>
                        <TableHead className="font-bold">Code</TableHead>
                        <TableHead className="font-bold">Discount</TableHead>
                        <TableHead className="font-bold">Min Order</TableHead>
                        <TableHead className="font-bold">Expiry Date</TableHead>
                        <TableHead className="font-bold text-center">Active</TableHead>
                        <TableHead className="font-bold text-right pr-6">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {coupons.map((coupon) => {
                        const isExpired = new Date(coupon.expiryDate) < new Date();
                        return (
                            <TableRow key={coupon.id} className="group hover:bg-muted/30 transition-colors">
                                <TableCell className="font-bold text-primary">
                                    <div className="flex items-center gap-2">
                                        <Ticket className="w-4 h-4 text-muted-foreground" />
                                        {coupon.code}
                                    </div>
                                </TableCell>
                                <TableCell className="font-medium">
                                    <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border-emerald-200">
                                        {coupon.discountPercent}% OFF
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    ${coupon.minOrderAmount}
                                </TableCell>
                                <TableCell className="text-sm">
                                    <div className="flex flex-col">
                                        <span>{format(new Date(coupon.expiryDate), 'MMM dd, yyyy')}</span>
                                        {isExpired ? (
                                            <span className="text-[10px] text-red-500 font-bold uppercase">Expired</span>
                                        ) : (
                                            <span className="text-[10px] text-green-500 font-bold uppercase text-muted-foreground">Valid</span>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell className="text-center">
                                    <Switch
                                        checked={coupon.isActive}
                                        onCheckedChange={() => handleToggleStatus(coupon.id, coupon.isActive)}
                                    />
                                </TableCell>
                                <TableCell className="text-right pr-6">
                                    <div className="flex justify-end gap-1">
                                        <Button 
                                            size="icon" 
                                            variant="ghost" 
                                            className="h-8 w-8 text-blue-600 hover:bg-blue-50" 
                                            onClick={() => setEditCoupon(coupon)}
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </Button>
                                        <Button 
                                            size="icon" 
                                            variant="ghost" 
                                            className="h-8 w-8 text-red-600 hover:bg-red-50" 
                                            onClick={() => handleDelete(coupon.id)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>

            <Dialog open={!!editCoupon} onOpenChange={(open: boolean) => !open && setEditCoupon(null)}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Edit2 className="w-5 h-5 text-primary" />
                            Edit Coupon
                        </DialogTitle>
                    </DialogHeader>
                    {editCoupon && (
                        <AddCouponForm 
                            coupon={editCoupon} 
                            onSuccess={() => {
                                setEditCoupon(null);
                                router.refresh();
                            }} 
                        />
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}
