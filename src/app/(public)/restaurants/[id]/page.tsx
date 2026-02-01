import RestaurantDetail from "@/components/modules/restaurants/RestaurantDetail";
import React from "react";
import { providersAPI } from "@/lib/api";

export default async function RestaurantPage({ params }: { params: any }) {
    const providerId = await params;
    const id = providerId?.id;
    if (!id) return null;

    let provider: any = null;
    try {
        provider = await providersAPI.getById(id);
    } catch (e) {
        console.error("Failed to fetch provider in route:", e);
    }

    return <RestaurantDetail id={id} provider={provider} />;
}

