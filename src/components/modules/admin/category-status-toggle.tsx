"use client"

import { useState } from "react"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { Label } from "@/components/ui/label"

interface CategoryStatusToggleProps {
    categoryId: string;
    initialStatus: boolean;
}

export function CategoryStatusToggle({ categoryId, initialStatus }: CategoryStatusToggleProps) {
    const [isActive, setIsActive] = useState(initialStatus)
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const toggleStatus = async (checked: boolean) => {
        setIsLoading(true)
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories/${categoryId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ isActive: checked }),
            })

            if (res.ok) {
                setIsActive(checked)
                toast.success(`Category ${checked ? 'activated' : 'deactivated'} successfully`)
                router.refresh()
            } else {
                toast.error("Failed to update status")
            }
        } catch (error) {
            console.error("Error toggling status:", error)
            toast.error("An error occurred while updating status")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex items-center gap-3">
            <span className={`text-sm font-medium ${isActive ? "text-primary" : "text-muted-foreground"}`}>
                {isActive ? "Active" : "Inactive"}
            </span>
            <Switch
                id={`status-${categoryId}`}
                checked={isActive}
                onCheckedChange={toggleStatus}
                disabled={isLoading}
                className="data-[state=checked]:bg-primary"
            />
        </div>
    )
}
