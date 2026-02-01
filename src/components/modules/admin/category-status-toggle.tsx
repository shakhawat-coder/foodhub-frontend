"use client"

import { useState } from "react"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { Label } from "@/components/ui/label"
import { categoriesAPI } from "@/lib/api"


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
            await categoriesAPI.update(categoryId, { isActive: checked });
            setIsActive(checked)
            toast.success(`Category ${checked ? 'activated' : 'deactivated'} successfully`)
            router.refresh()
        } catch (error: any) {
            console.error("Error toggling status:", error)
            toast.error(error.message || "An error occurred while updating status")
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
