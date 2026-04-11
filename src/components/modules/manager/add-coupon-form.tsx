"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"
import { couponsAPI } from "@/lib/api"
import { Textarea } from "@/components/ui/textarea"

const formSchema = z.object({
    code: z.string().min(3, "Code must be at least 3 characters").max(20),
    description: z.string().optional(),
    discountPercent: z.coerce.number().min(1).max(100),
    minOrderAmount: z.coerce.number().min(0),
    expiryDate: z.string().min(1, "Expiry date is required"),
})

type CouponFormValues = z.infer<typeof formSchema>;

interface AddCouponFormProps {
    coupon?: any;
    onSuccess?: () => void;
}

export function AddCouponForm({ coupon, onSuccess }: AddCouponFormProps) {
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const form = useForm<CouponFormValues>({
        resolver: zodResolver(formSchema) as any,
        defaultValues: {
            code: coupon?.code || "",
            description: coupon?.description || "",
            discountPercent: coupon?.discountPercent || 10,
            minOrderAmount: coupon?.minOrderAmount || 0,
            expiryDate: coupon?.expiryDate ? new Date(coupon.expiryDate).toISOString().split('T')[0] : "",
        },
    })

    async function onSubmit(values: CouponFormValues) {
        setIsLoading(true)
        try {
            if (coupon) {
                await couponsAPI.update(coupon.id, values);
                toast.success("Coupon updated successfully");
            } else {
                await couponsAPI.create(values);
                toast.success("Coupon created successfully");
            }
            if (onSuccess) {
                onSuccess();
            } else {
                router.push("/manager-dashboard/coupons");
                router.refresh();
            }
        } catch (error: any) {
            toast.error(error.message || "Failed to save coupon");
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Coupon Code</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g. SUMMER50" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Describe the offer..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="discountPercent"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Discount (%)</FormLabel>
                                <FormControl>
                                    <Input type="number" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="minOrderAmount"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Min Order ($)</FormLabel>
                                <FormControl>
                                    <Input type="number" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <FormField
                    control={form.control}
                    name="expiryDate"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Expiry Date</FormLabel>
                            <FormControl>
                                <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {coupon ? "Update Coupon" : "Create Coupon"}
                </Button>
            </form>
        </Form>
    )
}
