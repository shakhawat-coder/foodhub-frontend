import CategoryCard from '@/components/common/CategoryCard';
import SectionHeader from '@/components/common/SectionHeader';
import React from 'react'
import { categoriesAPI } from '@/lib/api';

export default async function CategoryWiseMeal() {
    const categoriesRaw = await categoriesAPI.getAll() as any[];
    const categories = categoriesRaw;
    // const categories = categoriesRaw.filter((category: any) => category.meals.length > 0);

    return (
        <div className='py-20 px-3'>
            <SectionHeader subtitle='Menu' title='Explore Our Meny' description='Indulge in a curated selection of dishes crafted with the finest ingredients and culinary expertise. Every plate tells a story of tradition and innovation.' />
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 '>
                {categories.map((category: any) => (
                    <CategoryCard key={category.id} {...category} />
                ))}
            </div>
        </div>
    )
}
