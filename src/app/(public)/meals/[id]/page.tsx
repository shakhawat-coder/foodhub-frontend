"use client"
import { ProductDetails } from '@/components/modules/productDetails/ProductDetail';
import { useParams } from 'next/navigation';
import React from 'react'

export default function MealItme() {
  const { id } = useParams();
  console.log(id);

  return (
    <ProductDetails id={id as string} />
  )
}
