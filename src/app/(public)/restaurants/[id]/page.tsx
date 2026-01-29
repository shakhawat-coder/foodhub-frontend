import RestaurantDetail from "@/components/modules/restaurants/RestaurantDetail";
import React from "react";

export default async function RestaurantPage({ params }: { params: any }) {
    const resolvedParams = await params;
    const id = resolvedParams?.id;
    if (!id) return null;

    let provider: any = null;
    try {
        const providerData = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/provider/${id}`, { cache: 'no-store' });
        provider = await providerData.json();
        // console.log(provider);

    } catch (e) {
        console.error("Failed to fetch provider in route:", e);
    }

    return <RestaurantDetail id={id} provider={provider} />;
}
