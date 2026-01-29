"use client";

import { PopularMealsCard } from '@/components/common/PopularMealsCard';
import { MealFilters, FilterState } from '@/components/modules/meals/MealFilters';
import React, { useState, useEffect, useMemo } from 'react';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";

interface Category {
    id: string;
    name: string;
}

interface Meal {
    id: string;
    name: string;
    image: string | null;
    price: number;
    description: string;
    providerId: string;
    dietaryTypes: string;
    isPopular: boolean;
    categoryId: string;
    category?: Category;
    createdAt: string;
    updatedAt: string;
}

interface MealsClientProps {
    initialMeals: Meal[];
}

export function MealsClient({ initialMeals }: MealsClientProps) {
    // Calculate min and max prices from meals
    const { minPrice, maxPrice } = useMemo(() => {
        if (initialMeals.length === 0) {
            return { minPrice: 0, maxPrice: 100 };
        }
        const prices = initialMeals.map(m => m.price || 0);
        return {
            minPrice: Math.floor(Math.min(...prices)),
            maxPrice: Math.ceil(Math.max(...prices))
        };
    }, [initialMeals]);

    // Extract unique categories from meals
    const availableCategories = useMemo(() => {
        const categories = initialMeals
            .filter(meal => meal.category)
            .map(meal => meal.category!.name);
        return Array.from(new Set(categories));
    }, [initialMeals]);

    // Extract unique dietary types from meals
    const availableDietaryTypes = useMemo(() => {
        const types = initialMeals
            .map(meal => meal.dietaryTypes)
            .filter(Boolean);
        return Array.from(new Set(types));
    }, [initialMeals]);

    const [filteredMeals, setFilteredMeals] = useState<Meal[]>(initialMeals);
    const [filters, setFilters] = useState<FilterState>({
        categories: [],
        priceRange: [minPrice, maxPrice],
        dietaryPreferences: []
    });

    // Apply filters whenever filters change
    useEffect(() => {
        console.log('Filtering - Initial meals:', initialMeals.length);
        console.log('Current filters:', filters);
        console.log('Price range:', { minPrice, maxPrice });

        let filtered = [...initialMeals];

        // Filter by categories (only if categories are selected)
        if (filters.categories.length > 0) {
            filtered = filtered.filter(meal =>
                meal.category && filters.categories.includes(meal.category.name)
            );
            console.log('After category filter:', filtered.length);
        }

        // Filter by price range (only if user has changed from default)
        if (filters.priceRange[0] !== minPrice || filters.priceRange[1] !== maxPrice) {
            filtered = filtered.filter(meal =>
                meal.price >= filters.priceRange[0] && meal.price <= filters.priceRange[1]
            );
            console.log('After price filter:', filtered.length);
        }

        // Filter by dietary types (only if preferences are selected)
        if (filters.dietaryPreferences.length > 0) {
            filtered = filtered.filter(meal =>
                meal.dietaryTypes && filters.dietaryPreferences.includes(meal.dietaryTypes)
            );
            console.log('After dietary filter:', filtered.length);
        }

        console.log('Final filtered count:', filtered.length);
        setFilteredMeals(filtered);
    }, [filters, initialMeals, minPrice, maxPrice]);

    const handleFilterChange = (newFilters: FilterState) => {
        setFilters(newFilters);
    };

    return (
        <div className="container mx-auto mt-8 px-4 md:px-6">
            <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
                {/* Desktop Sidebar - Filters */}
                <aside className="hidden lg:block">
                    <div className="sticky top-6">
                        <MealFilters
                            onFilterChange={handleFilterChange}
                            minPrice={minPrice}
                            maxPrice={maxPrice}
                            availableCategories={availableCategories}
                            availableDietaryTypes={availableDietaryTypes}
                        />
                    </div>
                </aside>

                {/* Main Content - Menu */}
                <div>
                    {/* Mobile Filter Button */}
                    <div className="mb-6 flex items-center justify-between lg:hidden">
                        <h2 className="text-2xl font-bold">Menu</h2>
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="outline" size="sm">
                                    <Filter className="mr-2 h-4 w-4" />
                                    Filters
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="w-80 overflow-y-auto">
                                <MealFilters
                                    onFilterChange={handleFilterChange}
                                    minPrice={minPrice}
                                    maxPrice={maxPrice}
                                    availableCategories={availableCategories}
                                    availableDietaryTypes={availableDietaryTypes}
                                />
                            </SheetContent>
                        </Sheet>
                    </div>

                    {/* Desktop Header */}
                    <div className="mb-6 hidden lg:flex items-center justify-between">
                        <h2 className="text-2xl font-bold">Menu</h2>
                        <p className="text-sm text-muted-foreground">
                            {filteredMeals.length} {filteredMeals.length === 1 ? 'meal' : 'meals'} found
                        </p>
                    </div>

                    {/* Meals Grid */}
                    {filteredMeals.length === 0 ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="text-center">
                                <p className="text-lg font-semibold">No meals found</p>
                                <p className="mt-2 text-sm text-muted-foreground">
                                    Try adjusting your filters to see more results
                                </p>
                                <p className="mt-2 text-xs text-muted-foreground">
                                    Total meals available: {initialMeals.length}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {filteredMeals.map((mealitem) => (
                                <PopularMealsCard key={mealitem.id} meal={mealitem} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
