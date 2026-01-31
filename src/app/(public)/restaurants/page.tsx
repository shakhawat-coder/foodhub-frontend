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
