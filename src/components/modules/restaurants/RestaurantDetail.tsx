
import { restaurants } from "@/data/restaurants";
import { PopularMealsCard } from "@/components/common/PopularMealsCard";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Clock } from "lucide-react";
// import Image from "next/image";

interface RestaurantDetailProps {
    id: string;
    provider?: any;
}

export default function RestaurantDetail({ id, provider }: RestaurantDetailProps) {
    const restaurant = restaurants.find((r) => r.id === Number(id));
    console.log(provider);
    if (!provider) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <p className="text-xl font-semibold text-muted-foreground">Restaurant not found</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Hero Section */}
            <div className="relative h-75 w-full md:h-100">
                <img
                    src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Zm9vZHxlbnwwfDB8MHx8fDA%3D"
                    alt={provider.name}
                    // fill
                    className="object-cover w-full h-full"
                // priority
                />
                <div className="absolute inset-0 bg-black/40" />
                <div className="absolute bottom-0 left-0 w-full p-6 text-white md:p-10">
                    <div className="container mx-auto">
                        <Badge className="mb-4 bg-primary text-primary-foreground hover:bg-primary/90">
                            {provider.cuisine}
                        </Badge>
                        <h1 className="mb-2 text-4xl font-bold md:text-5xl">{provider.name}</h1>
                        <p className="max-w-2xl text-lg text-gray-200 line-clamp-2">
                            {provider.description}
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
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {provider.meals.map((meal: any) => (
                                    <PopularMealsCard key={meal.id} meal={meal} />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar - Info */}
                    <div className="space-y-6">
                        <div className="rounded-xl border bg-card p-6 shadow-sm">
                            <div className="mx-auto w-40 h-40 overflow-hidden rounded-lg">
                                <img src={provider.logo ? provider.logo : "/restaurantlogo.png"} alt="provider logo" className="w-full h-full object-cover rounded-lg" />
                            </div>
                            {provider && (
                                <div className="pt-4">
                                    <p className="font-medium">Provider</p>
                                    <p className="text-sm text-muted-foreground">{provider.name ?? JSON.stringify(provider)}</p>
                                </div>
                            )}
                            <h3 className="my-4 text-lg font-semibold">Restaurant Info</h3>
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <MapPin className="mt-1 h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <p className="font-medium">Address</p>
                                        <p className="text-sm text-muted-foreground">{provider.address}</p>
                                    </div>
                                </div>
                                {/* <div className="flex items-start gap-3">
                                    <Clock className="mt-1 h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <p className="font-medium">Opening Hours</p>
                                        <p className="text-sm text-muted-foreground">{provider.openingHours}</p>
                                    </div>
                                </div> */}
                                <div className="flex items-center gap-3">
                                    <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                                    <div>
                                        <p className="font-medium">{provider.rating} ({provider.review} reviews)</p>
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
