import { ProductDetails } from '@/components/modules/productDetails/ProductDetail';
import React from 'react'

export default async function MealItem({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // Fetch all meals to find the specific one and related ones as requested by the user's pattern
  let mealsApi = await fetch(process.env.NEXT_PUBLIC_API_URL + '/meal', { cache: 'no-store' })
  let meals = await mealsApi.json()
  console.log("meals found:", meals.length);

  const meal = meals.find((m: any) => m.id === id);

  if (!meal) {
    return (
      <div className="container py-20 text-center">
        <h1 className="text-2xl font-bold">Meal not found</h1>
        <p className="text-muted-foreground mt-2">The meal you are looking for does not exist or has been removed.</p>
      </div>
    )
  }

  // Get related meals (excluding current)
  const relatedMeals = meals.filter((m: any) => m.id !== id).slice(0, 4);

  return (
    <ProductDetails meal={meal} relatedMeals={relatedMeals} />
  )
}
