import { PopularMealsCard } from '@/components/common/PopularMealsCard';
import React from 'react'
import { categoriesAPI, mealsAPI } from '@/lib/api';

export default async function CategoryPage({ params }: { params: { id: string } }) {
    const { id } = await params;

    try {
        const category = await categoriesAPI.getById(id) as any;
        const allMeals = await mealsAPI.getAll() as any[];

        // Filter meals by category ID
        const categoryMeals = allMeals.filter((meal: any) => meal.categoryId === id);


        return (
            <div className="">
                <div className="relative h-75 w-full md:h-100">
                    <img
                        src={category.image}
                        alt={category.name}
                        // fill
                        className="object-cover w-full h-full"
                    // priority
                    />
                    <div className="absolute inset-0 bg-black/40" />
                    <div className="absolute bottom-0 left-0 w-full p-6 text-white md:p-10">
                        <div className="container mx-auto">
                            <h1 className="mb-2 text-4xl font-bold md:text-5xl">{category.name}</h1>
                            {category.description && (
                                <p className="max-w-2xl text-lg text-gray-200 line-clamp-2">{category.description}</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-8">

                    {categoryMeals.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {categoryMeals.map((meal: any) => (
                                <PopularMealsCard meal={meal} key={meal.id} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-gray-500 text-lg">
                                No meals found in this category
                            </p>
                        </div>
                    )}
                </div>
            </div>
        );
    } catch (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">
                    <p className="text-red-500 text-lg">
                        {error instanceof Error ? error.message : "Failed to load category"}
                    </p>
                </div>
            </div>
        );
    }

}

