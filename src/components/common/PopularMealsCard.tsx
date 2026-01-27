"use client";

// import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface MealCardProps {
    meal: {
        id: number;
        title: string;
        tag: string;
        description: string;
        price: number;
        image: string;
    };
}

export function PopularMealsCard({ meal }: MealCardProps) {
    return (
        <Link href={`/menu/${meal.id}`} className="overflow-hidden  transitionp-0 flex items-center">
            <div>
                <div className="h-20 w-20 rounded-full overflow-hidden">
                    <img
                        src={meal.image}
                        alt={meal.title}
                        className="object-cover h-full w-full"
                    />
                </div>
            </div>
            <div className="space-y-2 p-5">
                <div className="flex justify-between">
                    <h3 className="text-lg font-semibold whitespace-nowrap">{meal.title}</h3>
                    <div className="border-b w-full"></div>
                    <span className="text-lg font-bold text-primary">
                        ${meal.price}
                    </span>
                </div>

                <p className="text-sm text-muted-foreground line-clamp-3">
                    {meal.description}
                </p>
            </div>
        </Link>
    );
}
