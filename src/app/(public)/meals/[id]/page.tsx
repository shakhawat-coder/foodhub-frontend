import { ProductDetails } from '@/components/modules/productDetails/ProductDetail';
import React from 'react'
import { mealsAPI } from '@/lib/api';

export default async function MealItem({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let meals: any[] = [];
  try {
    meals = await mealsAPI.getAll() as any[];
  } catch (error) {
    console.error("Failed to fetch meals:", error);
  }


  const meal = meals.find((m: any) => m.id === id);

  if (!meal) {
    return (
      <div className="container  py-12 lg:py-20 text-center">
        <h1 className="text-2xl font-bold">Meal not found</h1>
        <p className="text-muted-foreground mt-2">The meal you are looking for does not exist or has been removed.</p>
      </div>
    )
  }
  const relatedMeals = meals.filter((m: any) => m.id !== id).slice(0, 4);

  return (
    <>
      <ProductDetails meal={meal} relatedMeals={relatedMeals} />
    </>
  )
}
