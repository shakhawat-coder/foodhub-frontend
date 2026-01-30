import React from 'react'
import { AddMealForm } from '@/components/modules/provider/add-meal-form'
import { MoveLeft } from 'lucide-react'
import Link from 'next/link'

export default function page() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link
              href="/provider-dashboard/all-meals"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <MoveLeft className="h-4 w-4" />
            </Link>
            <span className="text-sm text-muted-foreground">Back to Menu</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Add New Meal</h1>
          <p className="text-muted-foreground">
            Create a new culinary masterpiece for your customers.
          </p>
        </div>
      </div>

      <AddMealForm />
    </div>
  )
}
