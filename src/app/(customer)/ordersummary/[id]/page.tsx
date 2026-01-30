import { OrderSummary } from '@/components/modules/orderComponent/OrderSummary'
import React from 'react'

export default async function OrderSummaryPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return (
        <div>
            <OrderSummary orderId={id} />
        </div>
    )
}
