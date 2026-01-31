import SectionHeader from '@/components/common/SectionHeader';
import Link from 'next/link';
import React from 'react'
import { Swiper } from 'swiper/react';
interface Restaurant {
    id: number | string;
    name: string;
    cuisine: string;
    rating: number;
    review: number;
    logo: string;
}
// const topRestaurants: Restaurant[] = [
//     {
//         id: 1,
//         name: "Burger King",
//         cuisine: "Fast Food",
//         rating: 4.5,
//         review: 1200,
//         image: "https://images.unsplash.com/photo-1594041680534-e8c8cdebd659?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHN0ZWFrfGVufDB8fDB8fHww",
//     },
//     {
//         id: 2,
//         name: "McDonald's",
//         cuisine: "Fast Food",
//         rating: 4.5,
//         review: 1200,
//         image: "https://images.unsplash.com/photo-1578935149228-66b184c83e69?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8c2VhJTIwZm9vZHxlbnwwfHwwfHx8MA%3D%3D",
//     },
//     {
//         id: 3,
//         name: "Burger King",
//         cuisine: "Fast Food",
//         rating: 4.5,
//         review: 1200,
//         image: "https://images.unsplash.com/photo-1623428187969-5da2dcea5ebf?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dmVnYW4lMjBmb29kfGVufDB8fDB8fHww",
//     },
//     {
//         id: 4,
//         name: "KFC",
//         cuisine: "Fast Food",
//         rating: 4.5,
//         review: 1200,
//         image: "https://images.unsplash.com/photo-1594041680534-e8c8cdebd659?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHN0ZWFrfGVufDB8fDB8fHww",
//     },
//     {
//         id: 5,
//         name: "McDonald's",
//         cuisine: "Fast Food",
//         rating: 4.5,
//         review: 1200,
//         image: "https://images.unsplash.com/photo-1578935149228-66b184c83e69?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8c2VhJTIwZm9vZHxlbnwwfHwwfHx8MA%3D%3D",
//     },
//     {
//         id: 6,
//         name: "Kacchi Bhai",
//         cuisine: "Fast Food",
//         rating: 4.5,
//         review: 1200,
//         image: "https://images.unsplash.com/photo-1623428187969-5da2dcea5ebf?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dmVnYW4lMjBmb29kfGVufDB8fDB8fHww",
//     },
//     {
//         id: 7,
//         name: "Burger King",
//         cuisine: "Fast Food",
//         rating: 4.5,
//         review: 1200,
//         image: "https://images.unsplash.com/photo-1594041680534-e8c8cdebd659?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHN0ZWFrfGVufDB8fDB8fHww",
//     }
// ]
export default async function Restaurants() {
    let providerData = await fetch(process.env.NEXT_PUBLIC_API_URL + '/provider', { cache: 'no-store' })
    let provider = await providerData.json()
    console.log(provider);
    return (
        <div className='py-20'>
            <div>
                <SectionHeader title="Discover the best dining experiences" subtitle="Top Restaurants" description=" Discover the best dining experiences around you with our curated list of top restaurants. From classic favorites to trendy new places, we've got you covered." />
            </div>
            <div className="w-full grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-5">
                {provider.map((providerItem: Restaurant) => (
                    <div key={providerItem.id} className="flex flex-col items-center justify-center">
                        <div className="w-40 h-40 relative rounded-lg overflow-hidden mx-auto">
                            <img
                                src={providerItem.logo ? providerItem.logo : "/restaurantlogo.png"}
                                alt={providerItem.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <Link href={`/restaurants/${providerItem.id}`} className="mt-4 text-lg font-semibold text-center">{providerItem.name}</Link>
                        <p className="text-sm text-gray-600 text-center">{providerItem.cuisine}</p>
                        <p className="text-sm font-medium text-center">Rating: {providerItem.rating} ⭐</p>
                        <p className="text-xs text-gray-500 text-center">Reviews: {providerItem.review}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}
