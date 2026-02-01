"use client";
import React, { useEffect, useState } from 'react';
import { authClient } from '@/lib/auth-client';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { providersAPI } from '@/lib/api';


export default function ProviderDashboardPage() {
    const { data: session } = authClient.useSession();
    const [provider, setProvider] = useState<any>(null);
    const [logo, setLogo] = useState<string>("/restaurantlogo.png");
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        const fetchProvider = async () => {
            if (session?.user?.email) {
                try {
                    const data: any = await providersAPI.getByEmail(session.user.email);
                    if (data) {
                        setProvider(data);
                        if (data.logo) {
                            setLogo(data.logo);
                        }
                    }
                } catch (err) {
                    console.error("Failed to fetch provider", err);
                }
            }
        };
        fetchProvider();
    }, [session]);

    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLogo(e.target.value);
    };

    const handleUpdateLogo = async () => {
        if (!provider?.id) return;
        setIsUpdating(true);
        try {
            await providersAPI.update(provider.id, { logo: logo });
            alert("Logo updated successfully");
        } catch (error) {
            console.error("Error updating logo:", error);
            alert("Error updating logo");
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className='text-center'>
            <h1 className="text-2xl font-bold mb-4">Welcome, {provider?.name || session?.user?.name}</h1>
            <div className="w-25 h-25 rounded-full overflow-hidden mb-4 border mx-auto">
                <img src={logo} className='w-full h-full object-cover' alt="logo" />
            </div>

            <div className="flex flex-col w-full max-w-sm items-center justify-center mx-auto space-y-2">
                <p>Please enter your logo URL:</p>
                <Input
                    type="text"
                    placeholder="Enter Image URL"
                    value={logo}
                    onChange={handleUrlChange}
                />
                <Button onClick={handleUpdateLogo} disabled={isUpdating}>
                    {isUpdating ? "Updating..." : "Update"}
                </Button>
            </div>


        </div>
    )
}