import React from 'react'

import { headers } from "next/headers";
import { usersAPI } from '@/lib/api';
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
        const apiResponse = await usersAPI.getAll({
            headers: {
                Cookie: headersList.get('cookie') || ''
            }
        });
        users = apiResponse.data as Users[];
        console.log("Fetched users:", users);
    } catch (error) {
        console.error("Failed to fetch users:", error);
    }

    return (
        <div>
            <UsersTable users={users} />
        </div>
    )
}
