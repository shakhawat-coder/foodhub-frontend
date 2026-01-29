

// ============================================================
// Example 1: Server Component - Fetch meals (Recommended)
// ============================================================
export async function MealsExample() {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/meal`,
            {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                // For ISR (Incremental Static Regeneration), use:
                // next: { revalidate: 60 } // Cache for 60 seconds
            },
        );

        if (!response.ok) throw new Error("Failed to fetch meals");
        const meals = await response.json();

        return (
            <div>
                {meals.map((meal: any) => (
                    <div key={meal.id}>
                        <h3>{meal.name}</h3>
                        <p>{meal.description}</p>
                        <p>Price: ${meal.price}</p>
                    </div>
                ))}
            </div>
        );
    } catch (error) {
        return <div>Error: {error instanceof Error ? error.message : "Failed to load meals"}</div>;
    }
}

// ============================================================
// Example 2: Server Component - Fetch categories
// ============================================================
export async function CategoriesExample() {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/categories`,
            {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            },
        );

        if (!response.ok) throw new Error("Failed to fetch categories");
        const categories = await response.json();

        return (
            <div>
                {categories.map((cat: any) => (
                    <button key={cat.id}>{cat.name}</button>
                ))}
            </div>
        );
    } catch (error) {
        console.error("Failed to fetch categories:", error);
        return <div>Error loading categories</div>;
    }
}

// ============================================================
// Example 3: Client Component - Add item to cart (Interactive)
// ============================================================
"use client";

import { useState } from "react";

export function AddToCartExample() {
    const [loading, setLoading] = useState(false);

    const handleAddToCart = async (mealId: string, quantity: number, price: number) => {
        try {
            setLoading(true);
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/cart`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ mealId, quantity, price }),
                },
            );

            if (!response.ok) throw new Error("Failed to add item to cart");
            alert("Item added to cart!");
        } catch (err) {
            console.error("Failed to add item to cart:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button onClick={() => handleAddToCart("meal-id", 1, 99.99)} disabled={loading}>
            {loading ? "Adding..." : "Add to Cart"}
        </button>
    );
}
