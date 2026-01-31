import React from 'react'

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
}

export default async function UserManagement() {
    let users: Users[] = [];

    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
            cache: 'no-store'
        });

        if (res.ok) {
            users = await res.json();
            console.log("Fetched users:", users);

        }
    } catch (error) {
        console.error("Failed to fetch users:", error);
    }
    return (
        <div>User Management Page</div>
    )
}
