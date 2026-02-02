import SectionHeader from '@/components/common/SectionHeader';
import Link from 'next/link';
import React from 'react'
import { providersAPI } from '@/lib/api';

interface Restaurant {
    id: number | string;
    name: string;
    rating: number;
    review: number;
    logo: string;
}

export default async function Restaurants() {
    let provider: Restaurant[] = [];
    try {
        provider = await providersAPI.getAll() as Restaurant[];
    } catch (error) {
        console.error("Failed to fetch providers:", error);
    }

    return (
        <div className='py-20'>
            <div>
                <SectionHeader title="Discover the best dining experiences" subtitle="Top Restaurants" description=" Discover the best dining experiences around you with our curated list of top restaurants. From classic favorites to trendy new places, we've got you covered." />
            </div>
            <div className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
                {provider.map((providerItem: Restaurant) => (
                    <Link href={`/restaurants/${providerItem.id}`} key={providerItem.id} className="flex flex-col items-center justify-center">
                        <div className="w-40 h-40 relative rounded-lg overflow-hidden mx-auto">
                            <img
                                src={providerItem.logo ? providerItem.logo : "/restaurantlogo.png"}
                                alt={providerItem.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <h5 className="mt-4 text-lg font-semibold text-center">{providerItem.name}</h5>
                        <p className="text-sm font-medium text-center"> {providerItem.rating} ⭐</p>
                        <p className="text-xs text-gray-500 text-center">({providerItem.review})Reviews </p>
                    </Link>
                ))}
            </div>
        </div>
    )
}
