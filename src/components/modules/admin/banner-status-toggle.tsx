"use client";

import React, { useState } from 'react'
import { Switch } from "@/components/ui/switch"
import { toast } from 'sonner'
import { bannerAPI } from '@/lib/api'

interface BannerStatusToggleProps {
    bannerId: string;
    initialStatus: boolean;
}

export function BannerStatusToggle({ bannerId, initialStatus }: BannerStatusToggleProps) {
    const [isActive, setIsActive] = useState(initialStatus)
    const [isLoading, setIsLoading] = useState(false)

    const handleToggle = async () => {
        setIsLoading(true)
        try {
            await bannerAPI.updateStatus(bannerId, !isActive)
            setIsActive(!isActive)
            toast.success(`Banner is now ${!isActive ? 'Active' : 'Inactive'}`)
        } catch (error) {
            console.error(error)
            toast.error("Failed to update banner status")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex items-center space-x-2">
            <Switch
                checked={isActive}
                onCheckedChange={handleToggle}
                disabled={isLoading}
            />
        </div>
    )
}
