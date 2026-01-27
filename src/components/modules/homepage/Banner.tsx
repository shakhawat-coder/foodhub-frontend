"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import Image from "next/image";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

import Banner1 from "../../../../public/banner1.jpg";
import Banner2 from "../../../../public/banner2.jpg";
import Banner3 from "../../../../public/banner3.jpg";

const restaurants = [
    {
        id: 1,
        name: "Burger King",
        cuisine: "Fast Food",
        rating: 4.5,
        image: Banner1,
    },
    {
        id: 2,
        name: "Italiano Pizza",
        cuisine: "Italian",
        rating: 4.7,
        image: Banner2,
    },
    {
        id: 3,
        name: "Healthy Bowl",
        cuisine: "Healthy",
        rating: 4.6,
        image: Banner3,
    },
];

export default function Banner() {
    return (
        <div className="w-full">
            <Swiper
                modules={[Autoplay, Pagination, EffectFade]}
                autoplay={{ delay: 4000, disableOnInteraction: false }}
                pagination={{ clickable: true }}
                loop
                effect="fade"
                fadeEffect={{ crossFade: true }}
                className="h-65 md:h-screen"
            >
                {restaurants.map((restaurant) => (
                    <SwiperSlide key={restaurant.id}>
                        {/* IMPORTANT: height must be set here */}
                        <div className="relative h-full w-full">
                            <Image
                                src={restaurant.image}
                                alt={restaurant.name}
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}
