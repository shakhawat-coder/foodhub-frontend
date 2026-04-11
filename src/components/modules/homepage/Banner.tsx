"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade, Navigation } from "swiper/modules";
import Image from "next/image";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import "swiper/css/navigation";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

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
        buttonText: "Order Now",
        url: "/menu",
    },      
    {
        id: 2,
        title: "Freshcal Juices",
        subtitle: "100% Organic & Naturally Sourced",
        description: "Rejuvenate your senses with our signature cold-pressed juices, made daily from hand-picked orchard-fresh fruits.",
        image: Banner3,
        color: "from-emerald-950/95",
        buttonText: "Shop Fresh",
        url: "/categories/juices",
    },
    {
        id: 3,
        title: "Gourmet Street Food",
        subtitle: "Quick Bites, Legendary Flavors",
        description: "From artisanal double-stack burgers to crispy gold fries, discover why we are the city's favorite comfort food spot.",
        image: Banner2,
        color: "from-amber-950/95",
        buttonText: "View Deals",
        url: "/offers",
    },
];

interface BannerProps {
    banners?: any[];
}

export default function Banner({ banners = [] }: BannerProps) {
    const displaySlides = banners.length > 0 ? banners.map(b => ({
        id: b.id,
        title: b.heading,
        subtitle: b.subheading,
        description: b.shortDescription,
        image: b.images?.[0] || "/Banner1.png",
        color: "from-neutral-900/95", 
        buttonText: b.buttonText,
        url: b.url,
    })) : slides;

    return (
        <div className="w-full relative overflow-hidden">
            <Swiper
                modules={[Autoplay, Pagination, EffectFade, Navigation]}
                autoplay={{ delay: 5000, disableOnInteraction: false }}
                pagination={{
                    clickable: true,
                    dynamicBullets: true,
                }}
                navigation={true}
                loop
                effect="fade"
                fadeEffect={{ crossFade: true }}
                className="h-[60vh] sm:h-[70vh] w-full group"
            >
                {displaySlides.map((slide) => (
                    <SwiperSlide key={slide.id}>
                        <div className="relative h-full w-full">
                            {/* Background Image */}
                            {/* ... previous img/Image logic ... */}
                            {typeof slide.image === 'string' ? (
                                <img
                                    src={slide.image}
                                    alt={slide.title}
                                    className="object-cover w-full h-full"
                                />
                            ) : (
                                <Image
                                    src={slide.image}
                                    alt={slide.title}
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            )}

                            {/* Gradient Overlay for Text Readability */}
                            <div className={`absolute inset-0 bg-linear-to-r ${slide.color} via-black/40 to-transparent`} />

                            {/* Content Layer */}
                            <div className="absolute inset-0 flex items-center pt-12 sm:pt-20 px-6 md:px-20 lg:px-32">
                                <div className="max-w-2xl text-white">
                                    <p className="text-orange-400 font-extrabold tracking-[0.2em] uppercase text-[9px] sm:text-xs mb-2 sm:mb-3 animate-in fade-in slide-in-from-bottom-4 duration-700">
                                        {slide.subtitle}
                                    </p>
                                    <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black mb-3 sm:mb-4 leading-tight animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-200">
                                        {slide.title}
                                    </h1>
                                    <p className="text-gray-200 text-[11px] sm:text-sm lg:text-base mb-5 sm:mb-6 max-w-lg leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-400">
                                        {slide.description}
                                    </p>
                                    <div className="animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-500">
                                        <Link href={slide.url}>
                                            <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-full px-5 sm:px-8 py-2 h-9 sm:h-11 text-xs sm:text-sm group/btn shadow-lg shadow-orange-500/20">
                                                {slide.buttonText}
                                                <ArrowRight className="ml-2 h-3 w-3 sm:h-4 sm:w-4 transition-transform group-hover/btn:translate-x-1" />
                                            </Button>
                                        </Link>
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
                .swiper-button-next, .swiper-button-prev {
                    color: white !important;
                    background: rgba(0, 0, 0, 0.3);
                    width: 36px !important;
                    height: 36px !important;
                    border-radius: 50%;
                    backdrop-filter: blur(4px);
                    transition: all 0.3s ease;
                    opacity: 0;
                }
                .group:hover .swiper-button-next, 
                .group:hover .swiper-button-prev {
                    opacity: 1;
                }
                .swiper-button-next:hover, .swiper-button-prev:hover {
                    background: #f97316 !important;
                    transform: scale(1.1);
                }
                .swiper-button-next::after, .swiper-button-prev::after {
                    font-size: 16px !important;
                    font-weight: bold;
                }
            `}</style>
        </div>
    );
}
