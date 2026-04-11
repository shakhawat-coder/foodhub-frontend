import { AddCouponForm } from "@/components/modules/manager/add-coupon-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Ticket } from "lucide-react";

export default function CreateCouponPage() {
    return (
        <div className="p-4 lg:p-10">
            <div className="max-w-2xl mx-auto">
                <Card className="border-none shadow-xl">
                    <CardHeader className="bg-muted/50 rounded-t-xl border-b mb-6">
                        <div className="flex items-center gap-3">
                            <div className="bg-primary/10 p-2 rounded-xl">
                                <Ticket className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <CardTitle className="text-2xl font-bold">Create New Coupon</CardTitle>
                                <CardDescription>Enter the details for the new discount code.</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="px-8 pb-8">
                        <AddCouponForm />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
