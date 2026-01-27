
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
}

export default function CategoryCard({ id, name, image }: CategoryCardProps) {
    return (
        <Card className="relative mx-auto w-full max-w-sm p-0 rounded-2xl overflow-hidden">
            <div className="absolute inset-0 z-30 bg-black/15" />
            <img
                src={image}
                alt={name}
                className="relative z-20 aspect-auto w-full h-full object-cover brightness-60 dark:brightness-40"
            />
            <CardHeader className="absolute w-full bottom-5 z-50 text-white">
                <CardTitle className="text-2xl">{name}</CardTitle>
                <Link href={`/menu/${id}`} className="w-full">View Menu</Link>
            </CardHeader>
        </Card>
    )
}
