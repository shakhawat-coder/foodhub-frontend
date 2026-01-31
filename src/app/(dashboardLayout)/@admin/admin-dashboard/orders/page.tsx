import { MyOrdersTable } from "@/components/modules/admin/order-history";


export default function page() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight bg-linear-to-r from-primary to-orange-600 bg-clip-text text-transparent">All Orders</h1>
                <p className="text-muted-foreground mt-1">
                    Manage all user orders.
                </p>
            </div>

            <MyOrdersTable />
        </div>
    )
}

