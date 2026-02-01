import { PopularMealsCard } from '@/components/common/PopularMealsCard';
import SectionHeader from '@/components/common/SectionHeader'
import React from 'react'
import { mealsAPI } from '@/lib/api';

export default async function PopularMeals() {
    let meals: any[] = [];
    try {
        const response = await mealsAPI.getAll();
        // Assuming the API returns the array directly based on meal.controller.ts
        // Filter by isPopular and limit to 6
        meals = Array.isArray(response)
            ? response.filter((meal: any) => meal.isPopular).slice(0, 6)
            : [];
    } catch (error) {
        console.error("Error fetching popular meals:", error);
    }

    return (
        <div className='py-12 lg:py-20 px-3'>
            <SectionHeader subtitle='Popular Meals' title='Delicious Meals Loved by Our Customers' description='Discover our most popular meals, crafted with fresh ingredients and bursting with flavor. These customer favorites are sure to satisfy your cravings.' />
            <div className="max-w-5xl mx-auto grid gap-6  sm:grid-cols-2 lg:grid-cols-2 mt-5">
                {meals.map((meal: any) => (
                    <PopularMealsCard key={meal.id} meal={meal} />
                ))}
            </div>
        </div>
    )
}
