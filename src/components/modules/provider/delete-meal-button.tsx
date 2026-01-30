"use client"

import { useState } from "react"
import { Trash2 } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

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
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/meal/delete/${mealId}`, {
                method: 'DELETE',
                credentials: 'include',
            })

            if (res.ok) {
                toast.success(`Meal "${mealName}" deleted successfully`)
                router.refresh()
            } else {
                const data = await res.json()
                toast.error(data.error || "Failed to delete meal")
            }
        } catch (error) {
            console.error("Error deleting meal:", error)
            toast.error("An error occurred while deleting the meal")
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
