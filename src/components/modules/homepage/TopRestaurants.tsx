"use client";
import React from 'react'

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import Image from "next/image";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import SectionHeader from '@/components/common/SectionHeader';
const topRestaurants = [
    {
        id: 1,
        name: "Burger King",
        cuisine: "Fast Food",
        rating: 4.5,
        review: 1200,
        image: "https://images.unsplash.com/photo-1594041680534-e8c8cdebd659?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHN0ZWFrfGVufDB8fDB8fHww",
    },
    {
        id: 2,
        name: "McDonald's",
        cuisine: "Fast Food",
        rating: 4.5,
        review: 1200,
        image: "https://images.unsplash.com/photo-1578935149228-66b184c83e69?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8c2VhJTIwZm9vZHxlbnwwfHwwfHx8MA%3D%3D",
    },
    {
        id: 3,
        name: "Burger King",
        cuisine: "Fast Food",
        rating: 4.5,
        review: 1200,
        image: "https://images.unsplash.com/photo-1623428187969-5da2dcea5ebf?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dmVnYW4lMjBmb29kfGVufDB8fDB8fHww",
    },
    {
        id: 4,
        name: "KFC",
        cuisine: "Fast Food",
        rating: 4.5,
        review: 1200,
        image: "https://images.unsplash.com/photo-1594041680534-e8c8cdebd659?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHN0ZWFrfGVufDB8fDB8fHww",
    },
    {
        id: 5,
        name: "McDonald's",
        cuisine: "Fast Food",
        rating: 4.5,
        review: 1200,
        image: "https://images.unsplash.com/photo-1578935149228-66b184c83e69?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8c2VhJTIwZm9vZHxlbnwwfHwwfHx8MA%3D%3D",
    },
    {
        id: 6,
        name: "Kacchi Bhai",
        cuisine: "Fast Food",
        rating: 4.5,
        review: 1200,
        image: "https://images.unsplash.com/photo-1623428187969-5da2dcea5ebf?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dmVnYW4lMjBmb29kfGVufDB8fDB8fHww",
    },
    {
        id: 7,
        name: "Burger King",
        cuisine: "Fast Food",
        rating: 4.5,
        review: 1200,
        image: "https://images.unsplash.com/photo-1594041680534-e8c8cdebd659?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHN0ZWFrfGVufDB8fDB8fHww",
    }
]
export default function TopRestaurants() {
    return (
        <>
            <div>
                <SectionHeader title="Discover the best dining experiences" subtitle="Top Restaurants" description=" Discover the best dining experiences around you with our curated list of top restaurants. From classic favorites to trendy new places, we've got you covered." />
            </div>
            <div className="w-full">
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
                // className="h-auto md:h-screen"
                >
                    {topRestaurants.map((restaurant) => (
                        <SwiperSlide key={restaurant.id} className="flex flex-col items-center justify-center p-4">
                            <div className="w-32 h-32 relative rounded-lg overflow-hidden mx-auto">
                                <img
                                    src={restaurant.image}
                                    alt={restaurant.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <h3 className="mt-4 text-lg font-semibold text-center">{restaurant.name}</h3>
                            <p className="text-sm text-gray-600 text-center">{restaurant.cuisine}</p>
                            <p className="text-sm font-medium text-center">Rating: {restaurant.rating} ⭐</p>
                            <p className="text-xs text-gray-500 text-center">Reviews: {restaurant.review}</p>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </>
    )
}
