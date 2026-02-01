"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { Loader2 } from "lucide-react";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import SectionHeader from '@/components/common/SectionHeader';
import { providersAPI } from '@/lib/api';

export default function TopRestaurants() {
    const [providers, setProviders] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProviders = async () => {
            try {
                const data = await providersAPI.getAll() as any[];
                // Sort by rating (descending) and take top 10
                const topProviders = data
                    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
                    .slice(0, 10);
                setProviders(topProviders);
            } catch (error) {
                console.error("Failed to fetch providers:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProviders();
    }, []);

    return (
        <section className="py-20">
            <div>
                <SectionHeader
                    title="Discover the best dining experiences"
                    subtitle="Top Restaurants"
                    description="Discover the best dining experiences around you with our curated list of top restaurants. From classic favorites to trendy new places, we've got you covered."
                />
            </div>
            <div className="w-full mt-10 min-h-75 flex items-center justify-center">
                {isLoading ? (
                    <div className="flex flex-col items-center gap-2">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p className="text-muted-foreground font-medium">Loading top restaurants...</p>
                    </div>
                ) : providers.length > 0 ? (
                    <Swiper
                        modules={[Autoplay]}
                        autoplay={{ delay: 4000, disableOnInteraction: false }}
                        loop={providers.length >= 5}
                        breakpoints={{
                            320: {
                                slidesPerView: 1,
                                spaceBetween: 10,
                            },
                            640: {
                                slidesPerView: 2,
                                spaceBetween: 15,
                            },
                            768: {
                                slidesPerView: 3,
                                spaceBetween: 15,
                            },
                            1024: {
                                slidesPerView: 4,
                                spaceBetween: 10,
                            },
                            1280: {
                                slidesPerView: 5,
                                spaceBetween: 10,
                            },
                        }}
                        className="py-4 w-full"
                    >
                        {providers.map((restaurant) => (
                            <SwiperSlide key={restaurant.id} className="h-auto!">
                                <Link href={`/restaurants/${restaurant.id}`} className="group flex flex-col items-center justify-center p-4 h-full rounded-xl hover:bg-muted/50 transition-colors">
                                    <div className="w-32 h-32 relative rounded-full overflow-hidden mx-auto shadow-md group-hover:scale-105 transition-transform duration-300">
                                        <img
                                            src={restaurant.logo || "/restaurantlogo.png"}
                                            alt={restaurant.name}
                                            className="object-cover w-full h-full"
                                        />
                                    </div>
                                    <h3 className="mt-4 text-lg font-semibold text-center group-hover:text-primary transition-colors">{restaurant.name}</h3>
                                    <div className="mt-2 flex flex-col items-center gap-1">
                                        <p className="text-sm font-medium text-center flex items-center gap-1">
                                            Rating: {restaurant.rating || 0} <span className="text-yellow-500">⭐</span>
                                        </p>
                                        <p className="text-xs text-muted-foreground text-center">({restaurant.review || 0} reviews)</p>
                                    </div>
                                </Link>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                ) : (
                    <div className="text-center py-10">
                        <p className="text-muted-foreground">No restaurants found.</p>
                    </div>
                )}
            </div>
        </section>
    );
}

