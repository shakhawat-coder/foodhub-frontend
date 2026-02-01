"use client"

import { useState } from "react"
import { Trash2 } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { mealsAPI } from "@/lib/api"

interface DeleteMealButtonProps {
    mealId: string;
    mealName: string;
}

export function DeleteMealButton({ mealId, mealName }: DeleteMealButtonProps) {
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const handleDelete = async () => {
        if (!window.confirm(`Are you sure you want to delete the meal "${mealName}"?`)) {
            return
        }

        setIsLoading(true)
        try {
            await mealsAPI.delete(mealId)
            toast.success(`Meal "${mealName}" deleted successfully`)
            router.refresh()
        } catch (error: any) {
            console.error("Error deleting meal:", error)
            toast.error(error.message || "An error occurred while deleting the meal")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <button
            onClick={handleDelete}
            disabled={isLoading}
            className="text-red-500 hover:text-red-700 transition-colors disabled:opacity-50"
            title="Delete Meal"
        >
            <Trash2 className="h-4 w-4 cursor-pointer" />
        </button>
    )
}
