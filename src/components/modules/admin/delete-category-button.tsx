"use client"

import { useState } from "react"
import { Trash2 } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface DeleteCategoryButtonProps {
    categoryId: string;
    categoryName: string;
}

export function DeleteCategoryButton({ categoryId, categoryName }: DeleteCategoryButtonProps) {
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const handleDelete = async () => {
        if (!window.confirm(`Are you sure you want to delete the category "${categoryName}"? This action cannot be undone.`)) {
            return
        }

        setIsLoading(true)
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories/${categoryId}`, {
                method: 'DELETE',
            })

            if (res.ok) {
                toast.success(`Category "${categoryName}" deleted successfully`)
                router.refresh()
            } else {
                const data = await res.json()
                toast.error(data.error || "Failed to delete category")
            }
        } catch (error) {
            console.error("Error deleting category:", error)
            toast.error("An error occurred while deleting the category")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <button
            onClick={handleDelete}
            disabled={isLoading}
            className="text-red-500 hover:text-red-700 transition-colors disabled:opacity-50"
            title="Delete Category"
        >
            <Trash2 className="h-4 w-4 cursor-pointer" />
        </button>
    )
}
