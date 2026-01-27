import { PopularMealsCard } from '@/components/common/PopularMealsCard';
import SectionHeader from '@/components/common/SectionHeader'
import React from 'react'
export const popularMeals = [
    {
        id: 1,
        title: "Truffle Ribeye Steak",
        tag: "Chef’s Choice",
        description:
            "28-day aged beef, shaved black truffle, garlic herb butter, and roasted asparagus.",
        price: 42,
        image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c3RlYWtzfGVufDB8fDB8fHww",
        images: [
            "https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c3RlYWtzfGVufDB8fDB8fHww",
            "https://images.unsplash.com/photo-1558030006-450675393462?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDZ8fHN0ZWFrc3xlbnwwfHwwfHx8MA%3D%3D",
        ],
    },
    {
        id: 2,
        title: "Wild Salmon Risotto",
        tag: "Popular",
        description:
            "Pan-seared Atlantic salmon over creamy lemon-asparagus risotto with micro-greens.",
        price: 34,
        image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c2FsbW9ufGVufDB8fDB8fHww",
        images: [
            "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c2FsbW9ufGVufDB8fDB8fHww",
        ],
    },
    {
        id: 3,
        title: "Lobster Ravioli",
        tag: "Seasonal",
        description:
            "Handmade pasta with Maine lobster, saffron cream, and fresh chives.",
        price: 38,
        image: "https://images.unsplash.com/photo-1590759668628-05b0fc34bb70?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGxvYnN0ZXJ8ZW58MHx8MHx8fDA%3D",
        images: [
            "https://images.unsplash.com/photo-1590759668628-05b0fc34bb70?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGxvYnN0ZXJ8ZW58MHx8MHx8fDA%3D",
            "https://images.unsplash.com/photo-1541529086526-db283c563270?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGxvYnN0ZXJ8ZW58MHx8MHx8fDA%3D",
            "https://images.unsplash.com/photo-1541529086526-db283c563270?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGxvYnN0ZXJ8ZW58MHx8MHx8fDA%3D",
        ],
    },
    {
        id: 4,
        title: "Noodels",
        tag: "Light Choice",
        description:
            "Rice noodles with stir-fried vegetables, tofu, and a tangy sesame-ginger sauce.",
        price: 22,
        image: "https://images.unsplash.com/photo-1591814468924-caf88d1232e1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fG5vb2RsZXxlbnwwfHwwfHx8MA%3D%3D",
        images: [
            "https://images.unsplash.com/photo-1591814468924-caf88d1232e1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fG5vb2RsZXxlbnwwfHwwfHx8MA%3D%3D",
            "https://images.unsplash.com/photo-1552611052-33e04de081de?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bm9vZGxlc3xlbnwwfHwwfHx8MA%3D%3D",
            "https://images.unsplash.com/photo-1552611052-33e04de081de?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bm9vZGxlc3xlbnwwfHwwfHx8MA%3D%3D",
        ],
    },
    {
        id: 5,
        title: "Truffle Ribeye Steak",
        tag: "Chef’s Choice",
        description:
            "28-day aged beef, shaved black truffle, garlic herb butter, and roasted asparagus.",
        price: 42,
        image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c3RlYWtzfGVufDB8fDB8fHww",
        images: [
            "https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c3RlYWtzfGVufDB8fDB8fHww",
            "https://images.unsplash.com/photo-1558030006-450675393462?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDZ8fHN0ZWFrc3xlbnwwfHwwfHx8MA%3D%3D",
        ],
    },
    {
        id: 6,
        title: "Wild Salmon Risotto",
        tag: "Popular",
        description:
            "Pan-seared Atlantic salmon over creamy lemon-asparagus risotto with micro-greens.",
        price: 34,
        image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c2FsbW9ufGVufDB8fDB8fHww",
        images: [
            "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c2FsbW9ufGVufDB8fDB8fHww",
        ],
    },
    {
        id: 7,
        title: "Lobster Ravioli",
        tag: "Seasonal",
        description:
            "Handmade pasta with Maine lobster, saffron cream, and fresh chives.",
        price: 38,
        image: "https://images.unsplash.com/photo-1590759668628-05b0fc34bb70?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGxvYnN0ZXJ8ZW58MHx8MHx8fDA%3D",
        images: [
            "https://images.unsplash.com/photo-1590759668628-05b0fc34bb70?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGxvYnN0ZXJ8ZW58MHx8MHx8fDA%3D",
            "https://images.unsplash.com/photo-1541529086526-db283c563270?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGxvYnN0ZXJ8ZW58MHx8MHx8fDA%3D",
            "https://images.unsplash.com/photo-1627042633099-3665780a40f8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mzl8fGxvYnN0ZXJ8ZW58MHx8MHx8fDA%3D",
            "https://images.unsplash.com/photo-1541529086526-db283c563270?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGxvYnN0ZXJ8ZW58MHx8MHx8fDA%3D",
        ],
    },
    {
        id: 8,
        title: "Noodels",
        tag: "Light Choice",
        description:
            "Rice noodles with stir-fried vegetables, tofu, and a tangy sesame-ginger sauce.",
        price: 22,
        image: "https://images.unsplash.com/photo-1591814468924-caf88d1232e1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fG5vb2RsZXxlbnwwfHwwfHx8MA%3D%3D",
        images: [
            "https://images.unsplash.com/photo-1591814468924-caf88d1232e1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fG5vb2RsZXxlbnwwfHwwfHx8MA%3D%3D",
            "https://images.unsplash.com/photo-1552611052-33e04de081de?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bm9vZGxlc3xlbnwwfHwwfHx8MA%3D%3D",
            "https://images.unsplash.com/photo-1626804475315-99d94f2762a1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHNhbG1vbnxlbnwwfHwwfHx8MA%3D%3D",
            "https://images.unsplash.com/photo-1552611052-33e04de081de?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bm9vZGxlc3xlbnwwfHwwfHx8MA%3D%3D",
        ],
    },
];
export default function PopularMeals() {
    return (
        <div className='py-20'>
            <SectionHeader subtitle='Popular Meals' title='Delicious Meals Loved by Our Customers' description='Discover our most popular meals, crafted with fresh ingredients and bursting with flavor. These customer favorites are sure to satisfy your cravings.' />
            <div className="max-w-5xl mx-auto grid gap-6  sm:grid-cols-2 lg:grid-cols-2 mt-5">
                {popularMeals.map((meal) => (
                    <PopularMealsCard key={meal.id} meal={meal} />
                ))}
            </div>
        </div>
    )
}
