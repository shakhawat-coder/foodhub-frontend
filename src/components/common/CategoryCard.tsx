
import { Button } from "@/components/ui/button"
import {
    Card,
    CardAction,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import Link from "next/link"

interface CategoryCardProps {
    id: string | number
    name: string
    image: string
    itemCount?: number
    meals?: Array<unknown>
}

export default function CategoryCard({ id, name, image, itemCount, meals }: CategoryCardProps) {
    const totalItems = typeof itemCount === "number" ? itemCount : Array.isArray(meals) ? meals.length : 0

    return (
        <Link href={`/menu/${id}`} className="w-full">
            <Card className="relative mx-auto w-full h-full aspect-square max-w-sm p-0 rounded-2xl overflow-hidden">
                <div className="absolute inset-0 z-30 bg-black/15" />
                <img
                    src={image}
                    alt={name}
                    className="relative z-20 aspect-auto w-full h-full object-cover brightness-60 dark:brightness-40"
                />
                <CardHeader className="absolute w-full bottom-5 z-50 text-white">
                    <CardTitle className="text-2xl">{name}</CardTitle>
                    <span className="w-full">{totalItems} items</span>
                    <span className="w-full text-sm text-white/90">View Menu</span>
                </CardHeader>
            </Card>
        </Link>
    )
}
