"use client";
import React from 'react';
import Link from 'next/link';
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
// import Image from "next/image";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import SectionHeader from '@/components/common/SectionHeader';
import { restaurants } from '@/data/restaurants';

export default function TopRestaurants() {
    return (
        <section className="py-20">
            <div>
                <SectionHeader
                    title="Discover the best dining experiences"
                    subtitle="Top Restaurants"
                    description="Discover the best dining experiences around you with our curated list of top restaurants. From classic favorites to trendy new places, we've got you covered."
                />
            </div>
            <div className="w-full mt-10">
                <Swiper
                    modules={[Autoplay]}
                    autoplay={{ delay: 4000, disableOnInteraction: false }}
                    loop
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
                    className="py-4"
                >
                    {restaurants.map((restaurant) => (
                        <SwiperSlide key={restaurant.id} className="!h-auto">
                            <Link href={`/restaurants/${restaurant.id}`} className="group flex flex-col items-center justify-center p-4 h-full rounded-xl hover:bg-muted/50 transition-colors">
                                <div className="w-32 h-32 relative rounded-full overflow-hidden mx-auto shadow-md group-hover:scale-105 transition-transform duration-300">
                                    <img
                                        src={restaurant.image}
                                        alt={restaurant.name}
                                        // fill
                                        className="object-cover"
                                    // sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    />
                                </div>
                                <h3 className="mt-4 text-lg font-semibold text-center group-hover:text-primary transition-colors">{restaurant.name}</h3>
                                <p className="text-sm text-muted-foreground text-center">{restaurant.cuisine}</p>
                                <div className="mt-2 flex flex-col items-center gap-1">
                                    <p className="text-sm font-medium text-center flex items-center gap-1">
                                        Rating: {restaurant.rating} <span className="text-yellow-500">⭐</span>
                                    </p>
                                    <p className="text-xs text-muted-foreground text-center">({restaurant.review} reviews)</p>
                                </div>
                            </Link>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
}

