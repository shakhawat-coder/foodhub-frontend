"use client"

import React, { useEffect, useState } from 'react'
import { contactsAPI } from '@/lib/api'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { format } from 'date-fns'
import { MessageSquare, Mail, User, BookOpen } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function ManagerContactsPage() {
    const [contacts, setContacts] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchContacts = async () => {
            try {
                const res = await contactsAPI.getAll()
                setContacts(res.data)
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false)
            }
        }
        fetchContacts()
    }, [])

    if (loading) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-10 w-48" />
                <Skeleton className="h-[400px] w-full" />
            </div>
        )
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">Contact Messages</h1>
            </div>

            <Card className="border-none shadow-sm overflow-hidden bg-background/50 backdrop-blur-sm">
                <CardHeader className="bg-muted/50 pb-4">
                    <CardTitle className="text-xl flex items-center gap-2">
                        <MessageSquare className="w-5 h-5 text-primary" />
                        All Inquiries
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent">
                                <TableHead className="w-[200px] font-bold">Contact Name</TableHead>
                                <TableHead className="font-bold">Message Info</TableHead>
                                <TableHead className="w-[180px] font-bold">Received At</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {contacts.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={3} className="h-32 text-center text-muted-foreground">
                                        No messages found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                contacts.map((contact) => (
                                    <TableRow key={contact.id} className="group hover:bg-muted/30 transition-colors">
                                        <TableCell>
                                            <div className="flex flex-col gap-1">
                                                <div className="font-semibold flex items-center gap-2">
                                                   <User className="w-3.5 h-3.5 text-muted-foreground" />
                                                   {contact.name}
                                                </div>
                                                <div className="text-xs text-muted-foreground flex items-center gap-2">
                                                   <Mail className="w-3.5 h-3.5" />
                                                   {contact.email}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="space-y-1.5 py-2">
                                                <div className="font-bold text-sm bg-primary/5 text-primary px-2 py-0.5 rounded-md w-fit flex items-center gap-2">
                                                    <BookOpen className="w-3.5 h-3.5" />
                                                    {contact.subject}
                                                </div>
                                                <p className="text-sm text-balance leading-relaxed text-muted-foreground group-hover:text-foreground transition-colors line-clamp-3">
                                                    {contact.message}
                                                </p>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-sm font-medium text-muted-foreground">
                                                {format(new Date(contact.createdAt), 'MMM dd, yyyy')}
                                                <div className="text-[10px] opacity-70">
                                                    {format(new Date(contact.createdAt), 'hh:mm a')}
                                                </div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
