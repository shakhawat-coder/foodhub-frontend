
import { restaurants } from "@/data/restaurants";
import { PopularMealsCard } from "@/components/common/PopularMealsCard";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Clock } from "lucide-react";
// import Image from "next/image";

interface RestaurantDetailProps {
    id: string;
}

export default function RestaurantDetail({ id }: RestaurantDetailProps) {
    const restaurant = restaurants.find((r) => r.id === Number(id));

    if (!restaurant) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <p className="text-xl font-semibold text-muted-foreground">Restaurant not found</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Hero Section */}
            <div className="relative h-[300px] w-full md:h-[400px]">
                <img
                    src={restaurant.coverImage}
                    alt={restaurant.name}
                    // fill
                    className="object-cover w-full h-full"
                // priority
                />
                <div className="absolute inset-0 bg-black/40" />
                <div className="absolute bottom-0 left-0 w-full p-6 text-white md:p-10">
                    <div className="container mx-auto">
                        <Badge className="mb-4 bg-primary text-primary-foreground hover:bg-primary/90">
                            {restaurant.cuisine}
                        </Badge>
                        <h1 className="mb-2 text-4xl font-bold md:text-5xl">{restaurant.name}</h1>
                        <p className="max-w-2xl text-lg text-gray-200 line-clamp-2">
                            {restaurant.description}
                        </p>
                    </div>
                </div>
            </div>

            <div className="container mx-auto mt-8 px-4 md:px-6">
                <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
                    {/* Main Content - Menu */}
                    <div>
                        <div className="mb-8">
                            <h2 className="mb-6 text-2xl font-bold">Menu</h2>
                            <div className="grid gap-6 sm:grid-cols-2">
                                {restaurant.menu.map((meal) => (
                                    <PopularMealsCard key={meal.id} meal={meal} />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar - Info */}
                    <div className="space-y-6">
                        <div className="rounded-xl border bg-card p-6 shadow-sm">
                            <h3 className="mb-4 text-lg font-semibold">Restaurant Info</h3>
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <MapPin className="mt-1 h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <p className="font-medium">Address</p>
                                        <p className="text-sm text-muted-foreground">{restaurant.address}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Clock className="mt-1 h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <p className="font-medium">Opening Hours</p>
                                        <p className="text-sm text-muted-foreground">{restaurant.openingHours}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                                    <div>
                                        <p className="font-medium">{restaurant.rating} ({restaurant.review} reviews)</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
