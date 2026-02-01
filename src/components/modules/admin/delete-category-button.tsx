"use client"

import { useState } from "react"
import { Trash2 } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { categoriesAPI } from "@/lib/api"


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
            await categoriesAPI.delete(categoryId);
            toast.success(`Category "${categoryName}" deleted successfully`)
            router.refresh()
        } catch (error: any) {
            console.error("Error deleting category:", error)
            toast.error(error.message || "An error occurred while deleting the category")
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
