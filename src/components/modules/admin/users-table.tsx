"use client"

import React from 'react'
import { useRouter } from 'next/navigation'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { format } from 'date-fns'
import { Shield, User, Truck, CheckCircle2, XCircle } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Switch } from "@/components/ui/switch"
import { usersAPI, providersAPI } from '@/lib/api'


interface Users {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    image?: string;
    role: 'USER' | 'PROVIDER';
    phone?: string;
    address?: string;
    createdAt: string;
    updatedAt: string;
    isSynced?: boolean;
    isSuspended: boolean;
}

interface UsersTableProps {
    users: Users[]
}

const getRoleBadge = (role: string) => {
    switch (role) {
        case 'ADMIN':
            return <Badge variant="default" className="bg-red-500 hover:bg-red-600 gap-1"><Shield className="w-3 h-3" /> Admin</Badge>
        case 'PROVIDER':
            return <Badge variant="secondary" className="gap-1"><Truck className="w-3 h-3" /> Provider</Badge>
        default:
            return <Badge variant="outline" className="gap-1"><User className="w-3 h-3" /> User</Badge>
    }
}

export function UsersTable({ users }: UsersTableProps) {
    const [isSyncing, setIsSyncing] = React.useState(false);
    const router = useRouter();

    const handleSyncProvider = async () => {
        try {
            setIsSyncing(true);
            const data: any = await providersAPI.syncFromUsers();
            toast.success(data.message || "Providers synced successfully");
            router.refresh();
        } catch (error) {
            console.error(error);
            toast.error("Failed to sync providers");
        } finally {
            setIsSyncing(false);
        }
    };

    const handleToggleStatus = async (userId: string) => {
        try {
            const data: any = await usersAPI.toggleStatus(userId);
            toast.success(data.message || "User status updated");
            router.refresh();
        } catch (error) {
            console.error(error);
            toast.error("Failed to update user status");
        }
    };

    if (users.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-muted/30 rounded-2xl border-2 border-dashed">
                <div className="bg-background p-4 rounded-full shadow-sm mb-4">
                    <User className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold">No users found</h3>
                <p className="text-muted-foreground mt-2 max-w-xs text-center">
                    There are no users registered in the system yet.
                </p>
            </div>
        )
    }

    return (
        <div className="rounded-xl border bg-card shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md">
            <Table>
                <TableHeader className="bg-muted/50">
                    <TableRow>
                        <TableHead className="w-[80px]">Image</TableHead>
                        <TableHead className="font-bold">Name</TableHead>
                        <TableHead className="font-bold">Email</TableHead>
                        <TableHead className="font-bold">Role</TableHead>
                        <TableHead className="font-bold">Verified</TableHead>
                        <TableHead className="font-bold">Active</TableHead>
                        <TableHead className="font-bold">Joined</TableHead>
                        <TableHead className="font-bold text-center">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.map((user) => (
                        <TableRow key={user.id} className="group hover:bg-muted/30 transition-colors">
                            <TableCell>
                                <Avatar className="h-9 w-9">
                                    <AvatarImage src={user.image} alt={user.name} />
                                    <AvatarFallback>{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                                </Avatar>
                            </TableCell>
                            <TableCell className="font-medium">
                                {user.name}
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                                {user.email}
                            </TableCell>
                            <TableCell>
                                {getRoleBadge(user.role)}
                            </TableCell>
                            <TableCell>
                                {user.emailVerified ? (
                                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 gap-1">
                                        <CheckCircle2 className="w-3 h-3" /> Verified
                                    </Badge>
                                ) : (
                                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 gap-1">
                                        <XCircle className="w-3 h-3" /> Unverified
                                    </Badge>
                                )}
                            </TableCell>
                            <TableCell>
                                <Switch
                                    checked={!user.isSuspended}
                                    onCheckedChange={() => handleToggleStatus(user.id)}
                                />
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                                {format(new Date(user.createdAt), 'MMM dd, yyyy')}
                            </TableCell>
                            <TableCell className="text-center">
                                {user.role === 'PROVIDER' && !user.isSynced && (
                                    <Button
                                        size="sm"
                                        onClick={handleSyncProvider}
                                        disabled={isSyncing}
                                        className="bg-blue-600 hover:bg-blue-700 h-8"
                                    >
                                        {isSyncing ? 'Approving...' : 'Approve'}
                                    </Button>
                                )}
                                {user.role === 'PROVIDER' && user.isSynced && (
                                    <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-100">Approved</Badge>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
