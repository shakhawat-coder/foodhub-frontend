import { MyOrdersTable } from '@/components/modules/user/my-orders-table'

export default function page() {
  return (
    <div className="space-y-6 p-4 md:p-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-3xl font-bold tracking-tight bg-linear-to-r from-primary to-orange-600 bg-clip-text text-transparent">My Orders</h1>
        <p className="text-muted-foreground mt-1">
          Your meal orders.
        </p>
      </div>

      <MyOrdersTable />
    </div>
  )
}
