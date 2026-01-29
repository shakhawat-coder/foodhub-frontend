"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { X } from "lucide-react";

interface MealFiltersProps {
    onFilterChange: (filters: FilterState) => void;
    minPrice?: number;
    maxPrice?: number;
    availableCategories?: string[];
    availableDietaryTypes?: string[];
}

export interface FilterState {
    categories: string[];
    priceRange: [number, number];
    dietaryPreferences: string[];
}

export function MealFilters({
    onFilterChange,
    minPrice = 0,
    maxPrice = 100,
    availableCategories = [],
    availableDietaryTypes = []
}: MealFiltersProps) {
    const [filters, setFilters] = useState<FilterState>({
        categories: [],
        priceRange: [minPrice, maxPrice],
        dietaryPreferences: []
    });

    const handleCategoryChange = (category: string, checked: boolean) => {
        const newCategories = checked
            ? [...filters.categories, category]
            : filters.categories.filter(c => c !== category);

        const newFilters = { ...filters, categories: newCategories };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    const handlePriceChange = (value: number[]) => {
        const newFilters = { ...filters, priceRange: [value[0], value[1]] as [number, number] };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    const handleDietaryChange = (preference: string, checked: boolean) => {
        const newPreferences = checked
            ? [...filters.dietaryPreferences, preference]
            : filters.dietaryPreferences.filter(p => p !== preference);

        const newFilters = { ...filters, dietaryPreferences: newPreferences };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    const clearFilters = () => {
        const newFilters: FilterState = {
            categories: [],
            priceRange: [minPrice, maxPrice],
            dietaryPreferences: []
        };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    const hasActiveFilters =
        filters.categories.length > 0 ||
        filters.dietaryPreferences.length > 0 ||
        filters.priceRange[0] !== minPrice ||
        filters.priceRange[1] !== maxPrice;

    return (
        <div className="space-y-6">
            {/* Header with Clear Filters */}
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold">Filters</h3>
                {hasActiveFilters && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearFilters}
                        className="h-8 px-2 text-xs"
                    >
                        <X className="mr-1 h-3 w-3" />
                        Clear All
                    </Button>
                )}
            </div>

            {/* Price Range Filter */}
            <Card>
                <CardHeader className="pb-4">
                    <CardTitle className="text-base font-semibold">Price Range</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="px-2">
                        <Slider
                            min={minPrice}
                            max={maxPrice}
                            step={1}
                            value={filters.priceRange}
                            onValueChange={handlePriceChange}
                            className="w-full"
                        />
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-muted-foreground">
                            ${filters.priceRange[0]}
                        </span>
                        <span className="font-medium text-muted-foreground">
                            ${filters.priceRange[1]}
                        </span>
                    </div>
                </CardContent>
            </Card>

            {/* Category Filter */}
            {availableCategories.length > 0 && (
                <Card>
                    <CardHeader className="pb-4">
                        <CardTitle className="text-base font-semibold">Categories</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {availableCategories.map((category) => (
                                <div key={category} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`category-${category}`}
                                        checked={filters.categories.includes(category)}
                                        onCheckedChange={(checked) =>
                                            handleCategoryChange(category, checked as boolean)
                                        }
                                    />
                                    <Label
                                        htmlFor={`category-${category}`}
                                        className="text-sm font-normal cursor-pointer"
                                    >
                                        {category}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Dietary Types Filter */}
            {availableDietaryTypes.length > 0 && (
                <Card>
                    <CardHeader className="pb-4">
                        <CardTitle className="text-base font-semibold">Dietary Types</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {availableDietaryTypes.map((preference) => (
                                <div key={preference} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`dietary-${preference}`}
                                        checked={filters.dietaryPreferences.includes(preference)}
                                        onCheckedChange={(checked) =>
                                            handleDietaryChange(preference, checked as boolean)
                                        }
                                    />
                                    <Label
                                        htmlFor={`dietary-${preference}`}
                                        className="text-sm font-normal cursor-pointer"
                                    >
                                        {preference}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Active Filters Summary */}
            {hasActiveFilters && (
                <Card className="border-primary/20 bg-primary/5">
                    <CardContent className="pt-6">
                        <div className="space-y-2">
                            <p className="text-sm font-semibold">Active Filters:</p>
                            <div className="flex flex-wrap gap-2">
                                {filters.categories.map((cat) => (
                                    <span
                                        key={cat}
                                        className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
                                    >
                                        {cat}
                                    </span>
                                ))}
                                {filters.dietaryPreferences.map((pref) => (
                                    <span
                                        key={pref}
                                        className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
                                    >
                                        {pref}
                                    </span>
                                ))}
                                {(filters.priceRange[0] !== minPrice || filters.priceRange[1] !== maxPrice) && (
                                    <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                                        ${filters.priceRange[0]} - ${filters.priceRange[1]}
                                    </span>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
