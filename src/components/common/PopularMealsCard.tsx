"use client";

// import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface MealCardProps {

    id: string;
    name: string;
    description: string;
    price: number;
    image: string | null;

}

export function PopularMealsCard({ meal }: { meal: MealCardProps }) {
    return (
        <Link href={`/meals/${meal.id}`} className="overflow-hidden relative transitionp-0 block w-full items-center">
            <div className="flex items-center gap-4 pb-5 mb-5 group">
                <div className="h-24 w-24 md:h-28 md:w-28 shrink-0 rounded-lg overflow-hidden border">
                    <img
                        src={meal.image || '/placeholder-meal.jpg'}
                        alt={meal.name}
                        className="object-cover h-full w-full group-hover:scale-105 transition-transform duration-300"
                    />
                </div>
                <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-center gap-3">
                        <h3 className="text-lg font-bold whitespace-nowrap group-hover:text-primary transition-colors">{meal.name}</h3>
                        <div className="flex-1 border-b border-muted-foreground/20 h-0 mt-1"></div>
                        <span className="text-lg font-black text-primary shrink-0">
                            ${meal.price}
                        </span>
                    </div>

                    <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed truncate">
                        {meal.description}
                    </p>
                </div>
            </div>

        </Link>
    );
}
