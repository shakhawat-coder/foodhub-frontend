import { OrderHistory } from "@/components/modules/provider/order-history";

export default function page() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight bg-linear-to-r from-primary to-orange-600 bg-clip-text text-transparent">Incoming Orders</h1>
                <p className="text-muted-foreground mt-1">
                    Manage your incoming orders and update their status.
                </p>
            </div>

            <OrderHistory type="incoming" />
        </div>
    )
}
