import React from 'react'
import { mealsAPI } from '@/lib/api'
import { AdminMealsTable } from '@/components/modules/admin/meals-table'

export default async function AdminMealsPage() {
    let meals: any[] = [];

    try {
        // Fetch all meals from the API
        meals = await mealsAPI.getAll() as any[];
    } catch (error) {
        console.error("Failed to fetch meals for admin dashboard:", error);
    }

    return (
        <div className="p-4 md:p-6 space-y-6">
            <AdminMealsTable meals={meals} />
        </div>
    )
}
