import CategoryCard from '@/components/common/CategoryCard'
import SectionHeader from '@/components/common/SectionHeader'
import React from 'react'
import { categoriesAPI } from '@/lib/api';
import Link from 'next/link';


export default async function MenuCategory() {
    let categories: any[] = [];
    try {
        categories = await categoriesAPI.getAll() as any[];
    } catch (error) {
        console.error("Failed to fetch categories:", error);
    }


    return (
        <div className='py-12 lg:py-20 px-3'>
            <SectionHeader subtitle='Menu' title='Explore Our Menu' description='Indulge in a curated selection of dishes crafted with the finest ingredients and culinary expertise. Every plate tells a story of tradition and innovation.' />
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
                {categories.sort(() => 0.5 - Math.random()).slice(0, 4).map((category: any) => (
                    <CategoryCard key={category.id} {...category} />
                ))}
            </div>
            <div className='flex justify-center mt-8'>
                <Link
                    href="/menu"
                    className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary/90"
                >
                    View All Menu
                </Link>
            </div>
        </div>
    )
}
