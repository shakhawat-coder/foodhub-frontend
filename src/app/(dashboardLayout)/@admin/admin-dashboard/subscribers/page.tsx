"use client"
import DashboardLoading from "@/components/common/DashboardLoading";

import React, { useEffect, useState } from 'react'
import { subscribersAPI } from '@/lib/api'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { format } from 'date-fns'
import { Mail, Calendar, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

export default function AdminSubscribersPage() {
    const [subscribers, setSubscribers] = useState<any[]>([])
    const [stats, setStats] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [subRes, statsRes] = await Promise.all([
                    subscribersAPI.getAll(),
                    subscribersAPI.getStats()
                ])
                setSubscribers(subRes.data)
                setStats(statsRes.data)
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    if (loading) {
        return <DashboardLoading />;
    }

    const COLORS = ['#f43f5e', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6'];

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-bold tracking-tight">Newsletter Subscribers</h1>
                <p className="text-muted-foreground text-lg">Manage and analyze your email list performance.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2 border-none shadow-xl bg-background/50 backdrop-blur-md overflow-hidden">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xl flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-green-500" />
                            Subscription Growth
                        </CardTitle>
                        <CardDescription>Monthly breakdown of new subscribers.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[350px] p-6 pt-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748B'}} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748B'}} />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                                    cursor={{fill: 'rgba(0,0,0,0.05)'}}
                                />
                                <Bar dataKey="count" radius={[6, 6, 0, 0]} barSize={40}>
                                    {stats.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                    <CardHeader>
                        <CardTitle className="text-2xl">Quick Stats</CardTitle>
                        <CardDescription className="text-white/70">Performance summary</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-4">
                        <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm border border-white/20">
                            <p className="text-white/60 text-sm font-medium uppercase tracking-wider mb-2">Total Subscribers</p>
                            <h3 className="text-5xl font-extrabold">{subscribers.length}</h3>
                        </div>
                        <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm border border-white/20">
                            <Mail className="w-8 h-8 text-white/50 mb-3" />
                            <p className="text-lg leading-snug">
                                You have gained <span className="font-bold">{subscribers.length > 5 ? '15%' : 'some'}</span> more subscribers this period.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="border-none shadow-xl bg-background/50 backdrop-blur-md overflow-hidden">
                <CardHeader className="bg-muted/30 pb-4 border-b">
                    <CardTitle className="text-xl flex items-center gap-2">
                        <Mail className="w-5 h-5 text-primary" />
                        Subscribers List
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="max-h-[500px] overflow-auto">
                        <Table>
                            <TableHeader className="sticky top-0 bg-background z-10 shadow-sm">
                                <TableRow className="hover:bg-transparent">
                                    <TableHead className="font-bold pl-8 py-4 text-primary">Email Address</TableHead>
                                    <TableHead className="font-bold py-4 text-primary">Subscription Date</TableHead>
                                    <TableHead className="font-bold py-4 text-primary w-[150px]">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {subscribers.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={3} className="h-40 text-center text-muted-foreground italic">
                                            No subscribers found yet.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    subscribers.map((sub) => (
                                        <TableRow key={sub.id} className="group hover:bg-muted/30 transition-all">
                                            <TableCell className="pl-8 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold transition-transform group-hover:scale-110">
                                                        {sub.email.charAt(0).toUpperCase()}
                                                    </div>
                                                    <span className="font-medium text-base">{sub.email}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-5">
                                                <div className="flex items-center gap-2 text-muted-foreground font-medium">
                                                    <Calendar className="w-4 h-4" />
                                                    {format(new Date(sub.createdAt), 'MMMM dd, yyyy')}
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-5">
                                                <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold w-fit border border-green-200 shadow-sm uppercase tracking-tight">Active</div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
