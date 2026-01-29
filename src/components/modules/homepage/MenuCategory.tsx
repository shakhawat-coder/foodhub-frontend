import CategoryCard from '@/components/common/CategoryCard'
import SectionHeader from '@/components/common/SectionHeader'
import React from 'react'


const data = [
    {
        id: 1,
        name: "Signature Steaks",
        image: "https://images.unsplash.com/photo-1594041680534-e8c8cdebd659?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHN0ZWFrfGVufDB8fDB8fHww"
    },
    {
        id: 2,
        name: "Seafood Platters",
        image: "https://images.unsplash.com/photo-1578935149228-66b184c83e69?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8c2VhJTIwZm9vZHxlbnwwfHwwfHx8MA%3D%3D"
    },
    {
        id: 3,
        name: "Vegan Delights",
        image: "https://images.unsplash.com/photo-1623428187969-5da2dcea5ebf?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dmVnYW4lMjBmb29kfGVufDB8fDB8fHww"
    },
    {
        id: 4,
        name: "Desserts",
        image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZGVzc2VydHxlbnwwfHwwfHx8MA%3D%3D"
    }
]

export default async function MenuCategory() {
    let categoyData = await fetch(process.env.NEXT_PUBLIC_API_URL + '/categories', { cache: 'no-store' })
    let categories = await categoyData.json()
    console.log(categories);

    return (
        <div className='py-20'>
            <SectionHeader subtitle='Menu' title='Explore Our Meny' description='Indulge in a curated selection of dishes crafted with the finest ingredients and culinary expertise. Every plate tells a story of tradition and innovation.' />
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10'>
                {categories.map((category: any) => (
                    <CategoryCard key={category.id} {...category} />
                ))}
            </div>
        </div>
    )
}
