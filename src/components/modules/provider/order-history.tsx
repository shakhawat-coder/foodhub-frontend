"use client"

import React, { useEffect, useState } from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ordersAPI } from '@/lib/api'
import { format } from 'date-fns'
import { Loader2, Package, ShoppingBag, Truck, CheckCircle2, XCircle, Clock, MoreVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"

interface Order {
    id: string
    createdAt: string
    totalAmount: number
    status: string
    items: {
        id: string
        quantity: number
        price: number
        meal: {
            name: string
            image?: string
            provider: {
                name: string
            }
        }
    }[]
}

const getStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
        case 'PENDING':
            return <Badge variant="outline" className="bg-yellow-100 text-yellow-700 border-yellow-200 gap-1"><Clock className="w-3 h-3" /> Pending</Badge>
        case 'PREPARING':
            return <Badge variant="outline" className="bg-purple-100 text-purple-700 border-purple-200 gap-1"><ShoppingBag className="w-3 h-3" /> Preparing</Badge>
        case 'OUT_FOR_DELIVERY':
            return <Badge variant="outline" className="bg-orange-100 text-orange-700 border-orange-200 gap-1"><Truck className="w-3 h-3" /> On the way</Badge>
        case 'DELIVERED':
            return <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200 gap-1"><CheckCircle2 className="w-3 h-3" /> Delivered</Badge>
        case 'CANCELLED':
            return <Badge variant="outline" className="bg-red-100 text-red-700 border-red-200 gap-1"><XCircle className="w-3 h-3" /> Cancelled</Badge>
        default:
            return <Badge variant="outline">{status}</Badge>
    }
}

interface OrderHistoryProps {
    type?: 'incoming' | 'history'
}

export function OrderHistory({ type }: OrderHistoryProps) {
    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [updating, setUpdating] = useState<string | null>(null)

    const fetchOrders = async () => {
        try {
            setLoading(true)
            const data = await ordersAPI.getProviderOrders({ type })
            setOrders(data as Order[])
        } catch (err: any) {
            setError(err.message || 'Failed to fetch orders')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchOrders()
    }, [type])

    const handleStatusUpdate = async (orderId: string, newStatus: string) => {
        try {
            setUpdating(orderId)
            await ordersAPI.updateStatus(orderId, newStatus)
            toast.success("Order status updated")

            // Optimistic update or refresh
            // If the new status moves it out of the current filter (e.g. Delivered), remove it
            if (type === 'incoming' && (newStatus === 'DELIVERED' || newStatus === 'CANCELLED')) {
                setOrders(prev => prev.filter(o => o.id !== orderId))
            } else {
                setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o))
            }

        } catch (err) {
            toast.error("Failed to update status")
            console.error(err)
        } finally {
            setUpdating(null)
        }
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-muted-foreground animate-pulse">Loading your orders...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="p-8 text-center bg-red-50 border border-red-100 rounded-xl">
                <p className="text-red-600 font-medium">Error: {error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-4 text-sm underline text-red-500 hover:text-red-700"
                >
                    Try again
                </button>
            </div>
        )
    }

    if (orders.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-muted/30 rounded-2xl border-2 border-dashed">
                <div className="bg-background p-4 rounded-full shadow-sm mb-4">
                    <ShoppingBag className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold">No {type === 'incoming' ? 'incoming' : 'past'} orders</h3>
                <p className="text-muted-foreground mt-2 max-w-xs text-center">
                    {type === 'incoming'
                        ? "You don't have any pending orders at the moment."
                        : "You haven't completed any orders yet."}
                </p>
                {type === 'history' && (
                    <div className='mt-6'>Wait for new orders!</div>
                )}
            </div>
        )
    }

    return (
        <div className="rounded-xl border bg-card shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md">
            <Table>
                <TableHeader className="bg-muted/50">
                    <TableRow>
                        <TableHead className="w-25 font-bold">Order ID</TableHead>
                        <TableHead className="font-bold">Date</TableHead>
                        <TableHead className="font-bold">Items</TableHead>
                        <TableHead className="font-bold text-right">Total</TableHead>
                        <TableHead className="font-bold text-center">Status</TableHead>
                        {type === 'incoming' && (
                            <TableHead className="font-bold text-center">Update Status</TableHead>
                        )}
                        <TableHead className="font-bold text-center">View Details</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {orders.map((order) => (
                        <TableRow key={order.id} className="group hover:bg-muted/30 transition-colors">
                            <TableCell className="font-mono text-xs text-muted-foreground">
                                #{order.id.slice(-6).toUpperCase()}
                            </TableCell>
                            <TableCell className="text-sm">
                                {format(new Date(order.createdAt), 'MMM dd, yyyy')}
                                <div className="text-[10px] text-muted-foreground">
                                    {format(new Date(order.createdAt), 'hh:mm a')}
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex flex-col gap-1">
                                    {order.items.map((item) => (
                                        <div key={item.id} className="text-sm flex items-center gap-2">
                                            <span className="w-5 h-5 flex items-center justify-center bg-primary/10 text-primary text-[10px] font-bold rounded-full">
                                                {item.quantity}x
                                            </span>
                                            <span className="font-medium truncate max-w-[200px]">{item.meal.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </TableCell>
                            <TableCell className="text-right font-bold text-primary">
                                ${order.totalAmount.toFixed(2)}
                            </TableCell>
                            <TableCell className="text-center">
                                {getStatusBadge(order.status)}
                            </TableCell>
                            {type === 'incoming' && (
                                <TableCell className="text-center">
                                    <div className="flex justify-center">
                                        <Select
                                            defaultValue={order.status}
                                            onValueChange={(val) => handleStatusUpdate(order.id, val)}
                                            disabled={updating === order.id}
                                        >
                                            <SelectTrigger className="w-[140px] h-8 text-xs">
                                                <SelectValue placeholder="Update Status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="PENDING">Pending</SelectItem>
                                                <SelectItem value="PREPARING">Preparing</SelectItem>
                                                <SelectItem value="OUT_FOR_DELIVERY">On the way</SelectItem>
                                                <SelectItem value="DELIVERED">Delivered</SelectItem>
                                                <SelectItem value="CANCELLED">Cancelled</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </TableCell>
                            )}
                            <TableCell className="text-center">
                                <Link href={`/ordersummary/${order.id}`}>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                    >
                                        View Details
                                    </Button>
                                </Link>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
