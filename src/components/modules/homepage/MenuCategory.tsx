import CategoryCard from '@/components/common/CategoryCard'
import SectionHeader from '@/components/common/SectionHeader'
import React from 'react'
import { categoriesAPI } from '@/lib/api';
import Link from 'next/link';
import { StaggerContainer, StaggerItem, FadeInUp } from '@/components/common/MotionWrapper';
import { Button } from '@/components/ui/button';


export default async function MenuCategory() {
    let categories: any[] = [];
    try {
        categories = await categoriesAPI.getAll() as any[];
    } catch (error) {
        console.error("Failed to fetch categories:", error);
    }


    return (
        <div className='py-8 sm:py-12 lg:py-16 container mx-auto px-4'>
            <SectionHeader subtitle='Menu' title='Explore Our Menu' description='Indulge in a curated selection of dishes crafted with the finest ingredients and culinary expertise. Every plate tells a story of tradition and innovation.' />
            <StaggerContainer className='grid grid-cols-2 md:grid-cols-4 gap-6'>
                {categories.sort(() => 0.5 - Math.random()).slice(0, 4).map((category: any) => (
                    <StaggerItem key={category.id}>
                        <CategoryCard {...category} />
                    </StaggerItem>
                ))}
            </StaggerContainer>
            <FadeInUp delay={0.6} className='flex justify-center mt-8'>
                <Link
                    href="/menu"
                >
                    <Button variant="outline" className="rounded-full px-8 py-6 font-bold uppercase tracking-widest text-xs hover:bg-primary hover:text-white transition-all shadow-md">
                        View All Menu
                    </Button>

                </Link>
            </FadeInUp>
        </div>
    )
}
