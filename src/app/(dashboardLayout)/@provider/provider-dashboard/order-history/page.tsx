import { OrderHistory } from "@/components/modules/provider/order-history";


export default function page() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight bg-linear-to-r from-primary to-orange-600 bg-clip-text text-transparent">My Orders</h1>
                <p className="text-muted-foreground mt-1">
                    Your meal orders.
                </p>
            </div>

            <OrderHistory type="history" />
        </div>
    )
}