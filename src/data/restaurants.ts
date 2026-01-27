
import { popularMeals } from "@/components/modules/homepage/PopularMeals";

export interface Restaurant {
    id: number | string;
    name: string;
    description: string;
    cuisine: string;
    rating: number;
    review: number;
    image: string;
    coverImage: string;
    address: string;
    openingHours: string;
    menu: typeof popularMeals;
}

export const restaurants: Restaurant[] = [
    {
        id: 1,
        name: "Burger King",
        description: "Burger King is an American multinational chain of hamburger fast food restaurants. Headquartered in Miami-Dade County, Florida, the company was founded in 1953 as Insta-Burger King, a Jacksonville, Florida–based restaurant chain.",
        cuisine: "Fast Food",
        rating: 4.5,
        review: 1200,
        image: "https://images.unsplash.com/photo-1594041680534-e8c8cdebd659?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHN0ZWFrfGVufDB8fDB8fHww",
        coverImage: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=1200&auto=format&fit=crop&q=80",
        address: "123 Burger Lane, Food City, FC 12345",
        openingHours: "10:00 AM - 11:00 PM",
        menu: popularMeals.slice(0, 4),
    },
    {
        id: 2,
        name: "McDonald's",
        description: "McDonald's Corporation is an American multinational fast food corporation, founded in 1940 as a restaurant operated by Richard and Maurice McDonald, in San Bernardino, California, United States.",
        cuisine: "Fast Food",
        rating: 4.5,
        review: 1200,
        image: "https://images.unsplash.com/photo-1578935149228-66b184c83e69?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8c2VhJTIwZm9vZHxlbnwwfHwwfHx8MA%3D%3D",
        coverImage: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=1200&auto=format&fit=crop&q=80",
        address: "456 McDrive, Food City, FC 12345",
        openingHours: "06:00 AM - 12:00 AM",
        menu: popularMeals.slice(2, 6),
    },
    {
        id: 3,
        name: "Pizza Hut",
        description: "Pizza Hut is an American multinational restaurant chain and international franchise founded in 1958 in Wichita, Kansas by Dan and Frank Carney.",
        cuisine: "Fast Food",
        rating: 4.5,
        review: 1200,
        image: "https://images.unsplash.com/photo-1623428187969-5da2dcea5ebf?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dmVnYW4lMjBmb29kfGVufDB8fDB8fHww",
        coverImage: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1200&auto=format&fit=crop&q=80",
        address: "789 Pizza Place, Food City, FC 12345",
        openingHours: "11:00 AM - 10:00 PM",
        menu: popularMeals.slice(0, 3),
    },
    {
        id: 4,
        name: "KFC",
        description: "KFC (Kentucky Fried Chicken) is an American fast food restaurant chain headquartered in Louisville, Kentucky, that specializes in fried chicken.",
        cuisine: "Fast Food",
        rating: 4.5,
        review: 1200,
        image: "https://images.unsplash.com/photo-1594041680534-e8c8cdebd659?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHN0ZWFrfGVufDB8fDB8fHww",
        coverImage: "https://images.unsplash.com/photo-1513639776629-9269d0d905dd?w=1200&auto=format&fit=crop&q=80",
        address: "101 Chicken Rd, Food City, FC 12345",
        openingHours: "10:00 AM - 11:00 PM",
        menu: popularMeals.slice(4, 8),
    },
    {
        id: 5,
        name: "Subway",
        description: "Subway is an American multi-national fast food restaurant franchise that primarily sells submarine sandwiches (subs), salads and beverages.",
        cuisine: "Fast Food",
        rating: 4.5,
        review: 1200,
        image: "https://images.unsplash.com/photo-1578935149228-66b184c83e69?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8c2VhJTIwZm9vZHxlbnwwfHwwfHx8MA%3D%3D",
        coverImage: "https://images.unsplash.com/photo-1600891964092-4316c288032e?w=1200&auto=format&fit=crop&q=80",
        address: "202 Sub Way, Food City, FC 12345",
        openingHours: "09:00 AM - 10:00 PM",
        menu: popularMeals.slice(1, 5),
    },
    {
        id: 6,
        name: "Kacchi Bhai",
        description: "Traditional Kacchi Biryani served with love and passion.",
        cuisine: "Fast Food",
        rating: 4.5,
        review: 1200,
        image: "https://images.unsplash.com/photo-1623428187969-5da2dcea5ebf?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dmVnYW4lMjBmb29kfGVufDB8fDB8fHww",
        coverImage: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=1200&auto=format&fit=crop&q=80",
        address: "303 Biryani St, Food City, FC 12345",
        openingHours: "12:00 PM - 11:00 PM",
        menu: popularMeals.slice(3, 7),
    },
    {
        id: 7,
        name: "Dominos",
        description: "Domino's Pizza, Inc., doing business as Domino's, is an American multinational pizza restaurant chain founded in 1960 and led by CEO Russell Weiner.",
        cuisine: "Fast Food",
        rating: 4.5,
        review: 1200,
        image: "https://images.unsplash.com/photo-1594041680534-e8c8cdebd659?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHN0ZWFrfGVufDB8fDB8fHww",
        coverImage: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1200&auto=format&fit=crop&q=80",
        address: "404 Domino Dr, Food City, FC 12345",
        openingHours: "11:00 AM - 12:00 AM",
        menu: popularMeals,
    }
];
