"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import Image from "next/image";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

import Banner1 from "../../../../public/Banner1.png";
import Banner3 from "../../../../public/Banner4.jpg";
import Banner2 from "../../../../public/Banner2.jpg";

const slides = [
    {
        id: 1,
        title: "Prime Sizzling Steaks",
        subtitle: "The Ultimate Steakhouse Experience",
        description: "Experience the finest cuts of aged meat, grilled to perfection by our master chefs for a truly unforgettable meal.",
        image: Banner1,
        color: "from-neutral-900/95",
    },
    {
        id: 2,
        title: "Freshcal Juices",
        subtitle: "100% Organic & Naturally Sourced",
        description: "Rejuvenate your senses with our signature cold-pressed juices, made daily from hand-picked orchard-fresh fruits.",
        image: Banner3,
        color: "from-emerald-950/95",
    },
    {
        id: 3,
        title: "Gourmet Street Food",
        subtitle: "Quick Bites, Legendary Flavors",
        description: "From artisanal double-stack burgers to crispy gold fries, discover why we are the city's favorite comfort food spot.",
        image: Banner2,
        color: "from-amber-950/95",
    },
];

export default function Banner() {
    return (
        <div className="w-full relative overflow-hidden">
            <Swiper
                modules={[Autoplay, Pagination, EffectFade]}
                autoplay={{ delay: 5000, disableOnInteraction: false }}
                pagination={{
                    clickable: true,
                    dynamicBullets: true,
                }}
                loop
                effect="fade"
                fadeEffect={{ crossFade: true }}
                className="h-[400px] md:h-[600px] lg:h-[750px] w-full"
            >
                {slides.map((slide) => (
                    <SwiperSlide key={slide.id}>
                        <div className="relative h-full w-full">
                            {/* Background Image */}
                            <Image
                                src={slide.image}
                                alt={slide.title}
                                fill
                                className="object-cover"
                                priority
                            />

                            {/* Gradient Overlay for Text Readability */}
                            <div className={`absolute inset-0 bg-gradient-to-r ${slide.color} via-black/40 to-transparent`} />

                            {/* Content Layer */}
                            <div className="absolute inset-0 flex items-center px-6 md:px-20 lg:px-32">
                                <div className="max-w-2xl text-white">
                                    <p className="text-orange-400 font-bold tracking-[0.2em] uppercase text-xs md:text-sm mb-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                                        {slide.subtitle}
                                    </p>
                                    <h1 className="text-4xl md:text-6xl lg:text-6xl font-black mb-6 leading-none md:leading-tight animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-200">
                                        {slide.title}
                                    </h1>
                                    <p className="text-gray-200 text-sm md:text-xl mb-10 max-w-lg leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-400">
                                        {slide.description}
                                    </p>
                                    <div className="animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-500">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Custom Pagination Styling */}
            <style jsx global>{`
                .swiper-pagination-bullet {
                    background: rgba(255, 255, 255, 0.5) !important;
                    width: 10px !important;
                    height: 10px !important;
                    margin: 0 8px !important;
                    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
                }
                .swiper-pagination-bullet-active {
                    background: #f97316 !important;
                    width: 35px !important;
                    border-radius: 20px !important;
                    opacity: 1 !important;
                }
            `}</style>
        </div>
    );
}
