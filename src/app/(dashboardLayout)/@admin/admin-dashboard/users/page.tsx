import React from 'react'

import { headers } from "next/headers";
import { UsersTable } from '@/components/modules/admin/users-table';

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

export default async function UserManagement() {
    let users: Users[] = [];

    try {
        const headersList = await headers();
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
            headers: {
                Cookie: headersList.get('cookie') || ''
            },
            cache: 'no-store'
        });

        if (res.ok) {
            const apiResponse = await res.json();
            users = apiResponse.data;
            console.log("Fetched users:", users);

        } else {
            console.error("Failed to fetch users:", res.status, res.statusText);
        }
    } catch (error) {
        console.error("Failed to fetch users:", error);
    }
    return (
        <div>
            <UsersTable users={users} />
        </div>
    )
}
