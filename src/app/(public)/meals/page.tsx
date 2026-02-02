import { MealsClient } from '@/components/modules/meals/MealsClient';
import React from 'react';
import { mealsAPI } from '@/lib/api';


export default async function MealsPage() {
    let meals: any[] = [];
    try {
        meals = await mealsAPI.getAll() as any[];
    } catch (error) {
        console.error("Failed to fetch meals:", error);
    }


    return (
        <div>
            <div className="min-h-screen bg-background pb-20">
                {/* Hero Section */}
                <div className="relative h-75 w-full md:h-100">
                    <img
                        src={"/mealbanner.jpg"}
                        alt={"All Meals"}
                        className="object-cover w-full h-full"
                    />
                    <div className="absolute inset-0 bg-black/40" />
                    <div className="absolute bottom-0 left-0 w-full p-6 text-white md:p-10">
                        <div className="container mx-auto">
                            <h1 className="mb-2 text-4xl font-bold md:text-5xl">All Meals</h1>
                            <p className="max-w-2xl text-lg text-gray-200 line-clamp-2">
                                Discover a variety of delicious meals from our collection.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Client Component with Filters */}
                {meals.length < 1 ? (
                    <div className="container mx-auto mt-8 px-4 md:px-6">
                        <div className="flex items-center justify-center py-20">
                            <div className="text-center">
                                <p className="text-lg font-semibold">No meals available</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <MealsClient initialMeals={meals} />
                )}
            </div>
        </div>
    );
}
