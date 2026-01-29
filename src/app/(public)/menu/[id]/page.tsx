import Link from 'next/link';
import React from 'react'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default async function CategoryPage({ params }: { params: { id: string } }) {
    const { id } = await params;

    try {
        const categoryResponse = await fetch(`${API_BASE_URL}/categories/${id}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            next: { revalidate: 60 }
        });

        if (!categoryResponse.ok) {
            throw new Error("Failed to fetch category");
        }

        const category = await categoryResponse.json();

        // Fetch all meals and filter by categoryId
        const mealsResponse = await fetch(`${API_BASE_URL}/meal`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            next: { revalidate: 60 }
        });

        if (!mealsResponse.ok) {
            throw new Error("Failed to fetch meals");
        }

        const allMeals = await mealsResponse.json();

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
                                <div
                                    key={meal.id}
                                    className="border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
                                >
                                    {/* Meal Image - if available */}
                                    {meal.image && (
                                        <img
                                            src={meal.image}
                                            alt={meal.name}
                                            className="w-full h-48 object-cover"
                                        />
                                    )}

                                    {/* Meal Details */}
                                    <div className="p-4">
                                        <Link href={`/meals/${meal.id}`} className="text-xl font-semibold mb-2">{meal.name}</Link>

                                        {meal.description && (
                                            <p className="text-gray-600 text-sm mb-3">
                                                {meal.description}
                                            </p>
                                        )}

                                        <div className="flex justify-between items-center">
                                            <span className="text-2xl font-bold text-green-600">
                                                ${meal.price}
                                            </span>
                                            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
                                                Add to Cart
                                            </button>
                                        </div>
                                    </div>
                                </div>
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
