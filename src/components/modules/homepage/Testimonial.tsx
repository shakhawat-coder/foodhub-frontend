"use client";

import SectionHeader from "@/components/common/SectionHeader";
import React from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
const testimonials = [
    {
        id: 1,
        name: "Rahim Ahmed",
        role: "Food Lover",
        message:
            "The food quality is outstanding and delivery is always on time. FoodHub has become my go-to app for ordering meals.",
    },
    {
        id: 2,
        name: "Nusrat Jahan",
        role: "Regular Customer",
        message:
            "Amazing variety of restaurants and very easy to order. The interface is clean and user-friendly.",
    },
    {
        id: 3,
        name: "Tanvir Hasan",
        role: "Office Worker",
        message:
            "Fast delivery and great taste. I especially love the healthy meal options available here.",
    },
];


export default function Testimonial() {
    return (
        <div className="py-20">

            <div className="mt-12 grid items-center gap-10 md:grid-cols-2">
                <div className="bg-yellow-100/50 backdrop:blur-3xl rounded-e-full overflow-hidden p-10 h-full flex flex-col items-center justify-center -me-32 z-10">
                    <SectionHeader
                        subtitle="Reviews"
                        title="What Our Customers Say"

                    />
                    <Swiper
                        modules={[Autoplay]}
                        autoplay={{ delay: 4500, disableOnInteraction: false }}
                        loop
                        className="max-w-lg"
                    >
                        {testimonials.map((item) => (
                            <SwiperSlide key={item.id}>
                                <div className="rounded-2xl border p-8 shadow-sm">
                                    <p className="mb-6 text-base leading-relaxed text-gray-600">
                                        “{item.message}”
                                    </p>

                                    <div>
                                        <h4 className="font-semibold">{item.name}</h4>
                                        <span className="text-sm text-muted-foreground">
                                            {item.role}
                                        </span>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>

                {/* RIGHT: Image */}
                <div className=" rounded-s-full overflow-hidden">
                    <img
                        src="/testimonial.png"
                        alt="testimonial"
                        className="max-w-full overflow-hidden"
                    />
                </div>
            </div>
        </div>
    );
}
