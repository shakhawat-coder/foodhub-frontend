"use client";

import SectionHeader from "@/components/common/SectionHeader";
import React, { useEffect, useState } from "react";
import { FadeInUp, FadeInRight } from "@/components/common/MotionWrapper";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { Star } from "lucide-react";
import { reviewsAPI } from "@/lib/api";

import "swiper/css";
import "swiper/css/pagination";

const fallbackTestimonials = [
    {
        id: "fb1",
        rating: 5,
        comment: "The food quality is outstanding and delivery is always on time. FoodHub has become my go-to app for ordering meals.",
        user: { name: "Rahim Ahmed", image: null }
    },
    {
        id: "fb2",
        rating: 5,
        comment: "Amazing variety of restaurants and very easy to order. The interface is clean and user-friendly.",
        user: { name: "Nusrat Jahan", image: null }
    },
    {
        id: "fb3",
        rating: 5,
        comment: "Fast delivery and great taste. I especially love the healthy meal options available here.",
        user: { name: "Tanvir Hasan", image: null }
    },
];

export default function Testimonial() {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTestimonials = async () => {
            try {
                const res = await reviewsAPI.getTestimonials();
                console.log(res);
                if (Array.isArray(res) && res.length > 0) {
                    setData(res);
                } else {
                    setData(fallbackTestimonials);
                }
            } catch (error) {
                console.error("Failed to fetch testimonials", error);
                setData(fallbackTestimonials);
            } finally {
                setLoading(false);
            }
        };
        fetchTestimonials();
    }, []);

    if (loading) return null;

    return (
        <div className="py-8 sm:py-12 lg:py-16 overflow-hidden">
            <div className="mt-4 md:mt-8 grid items-center gap-10 md:grid-cols-2">
                <FadeInUp className="bg-yellow-100/50 dark:bg-yellow-900/10 backdrop-blur-3xl md:rounded-e-full overflow-hidden p-6 sm:p-8 lg:p-10 h-full flex flex-col items-center justify-center md:-me-32 z-10">
                    <SectionHeader
                        subtitle="Reviews"
                        title="What Our Customers Say"
                    />
                    <Swiper
                        modules={[Autoplay]}
                        autoplay={{ delay: 4500, disableOnInteraction: false }}
                        loop={data.length > 1}
                        className="max-w-full w-full"
                    >
                        {data.map((item) => (
                            <SwiperSlide key={item.id}>
                                <div className="rounded-2xl border p-4 sm:p-8 shadow-sm max-w-full bg-white/40 dark:bg-neutral-900/40 backdrop-blur-md">
                                    <div className="flex gap-1 mb-4 text-orange-500">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`size-3 sm:size-4 ${i < Math.floor(Number(item.rating)) ? 'fill-current' : 'text-gray-300'}`}
                                            />
                                        ))}
                                    </div>
                                    <p className="mb-6 text-xs sm:text-sm lg:text-base leading-relaxed text-gray-700 dark:text-gray-300 italic font-medium">
                                        “{item.comment}”
                                    </p>

                                    <div className="flex items-center gap-3">
                                        {item.user?.image ? (
                                            <img
                                                src={item.user.image}
                                                alt={item.user.name}
                                                className="size-8 sm:size-10 rounded-full object-cover border-2 border-primary/20"
                                            />
                                        ) : (
                                            <div className="size-8 sm:size-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-xs sm:text-sm">
                                                {item.user?.name?.charAt(0).toUpperCase() || "?"}
                                            </div>
                                        )}
                                        <div className="min-w-0">
                                            <h4 className="font-bold text-xs sm:text-sm truncate">{item.user?.name}</h4>
                                            <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">
                                                Happy Customer
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </FadeInUp>

                {/* RIGHT: Image */}
                <FadeInRight className="hidden md:block rounded-s-full overflow-hidden max-w-full">
                    <img
                        src="/testimonial.png"
                        alt="testimonial"
                        className="max-w-full overflow-hidden"
                    />
                </FadeInRight>
            </div>
        </div>
    );
}
