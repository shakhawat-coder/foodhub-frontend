"use client";

import RestaurantDetail from "@/components/modules/restaurants/RestaurantDetail";
import { useParams } from "next/navigation";
import React from "react";

export default function RestaurantPage() {
    const params = useParams();
    const id = params?.id as string;

    if (!id) return null;

    return <RestaurantDetail id={id} />;
}
