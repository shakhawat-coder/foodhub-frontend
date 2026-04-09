"use client";

import React, { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { bannerAPI } from '@/lib/api'

interface DeleteBannerButtonProps {
    bannerId: string;
    bannerTitle: string;
}

export function DeleteBannerButton({ bannerId, bannerTitle }: DeleteBannerButtonProps) {
    const [isDeleting, setIsDeleting] = useState(false)
    const router = useRouter()

    const handleDelete = async () => {
        if (!window.confirm(`Are you absolutely sure you want to delete the banner "${bannerTitle}"? This action cannot be undone.`)) {
            return
        }

        setIsDeleting(true)
        try {
            await bannerAPI.delete(bannerId)
            toast.success("Banner deleted successfully")
            router.refresh()
        } catch (error) {
            console.error(error)
            toast.error("Failed to delete banner")
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <button 
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-red-500 hover:text-red-700 transition-colors disabled:opacity-50"
            title="Delete Banner"
        >
            <Trash2 className="h-4 w-4" />
        </button>
    )
}
