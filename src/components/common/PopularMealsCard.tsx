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
        image: string;
    
}

export function PopularMealsCard({ meal }: { meal: MealCardProps }) {
    return (
        <Link href={`/meals/${meal.id}`} className="overflow-hidden relative transitionp-0 block w-full items-center">
            <div className="grid grid-cols-3">
                <div className="h-25 w-25 rounded-full overflow-hidden">
                    <img
                        src={meal.image}
                        alt={meal.name}
                        className="object-cover h-full w-full"
                    />
                </div>
                <div className="col-span-2 space-y-2 p-5">
                    <div className="flex justify-between">
                        <h3 className="text-lg font-semibold whitespace-nowrap">{meal.name}</h3>
                        <div className="border-b w-full"></div>
                        <span className="text-lg font-bold text-primary">
                            ${meal.price}
                        </span>
                    </div>

                    <p className="text-sm w-full text-muted-foreground line-clamp-3">
                        {meal.description}
                    </p>
                </div>
            </div>

        </Link>
    );
}
