import {
    LayoutDashboard,
    ShoppingBag,
    Truck,
    Star,
    UserCog,
    UtensilsCrossed,
    BellRing,
    ClipboardList,
    Users,
    ShoppingBasket,
    Grid2X2,
    ShoppingCart,
    PlusCircle,
    ListOrdered
} from "lucide-react";

export const sidebarData = {
    USER: [
        {
            title: "Dashboard",
            url: "/dashboard/user",
            icon: LayoutDashboard,
        },
        {
            title: "My Orders",
            url: "/user-dashboard/my-orders",
            icon: ShoppingBag,
        },
        {
            title: "Track Order",
            url: "/dashboard/user/order-tracking",
            icon: Truck,
        },
        {
            title: "Reviews",
            url: "/dashboard/user/reviews",
            icon: Star,
        },
        {
            title: "Profile",
            url: "/dashboard/user/profile",
            icon: UserCog,
        },
    ],
    PROVIDER: [
        {
            title: "Dashboard",
            url: "/dashboard/provider",
            icon: LayoutDashboard,
        },
        {
            title: "Menu Management",
            url: "/provider-dashboard/menu",
            icon: UtensilsCrossed,
            items: [
                { title: "All Meals", url: "/provider-dashboard/all-meals" },
                { title: "Add Meal", url: "/provider-dashboard/add-meal" },
            ]
        },
        {
            title: "Orders",
            url: "/dashboard/provider/orders",
            icon: ClipboardList,
            items: [
                { title: "Incoming Orders", url: "/dashboard/provider/orders/incoming" },
                { title: "Order History", url: "/dashboard/provider/orders/history" },
            ]
        },
        {
            title: "Profile",
            url: "/dashboard/provider/profile",
            icon: UserCog,
        },
    ],
    ADMIN: [
        {
            title: "Dashboard",
            url: "/dashboard/admin",
            icon: LayoutDashboard,
        },
        {
            title: "Users Management",
            url: "/admin-dashboard/users",
            icon: Users,
        },
        {
            title: "Orders Management",
            url: "/admin-dashboard/orders",
            icon: ShoppingBasket,
        },
        {
            title: "Categories",
            url: "/admin-dashboard/categories",
            icon: Grid2X2,
            items: [
                { title: "All Categories", url: "/admin-dashboard/categories" },
                { title: "Add Category", url: "/admin-dashboard/add-category" },
            ]
        },
        {
            title: "Profile",
            url: "/admin-dashboard/profile",
            icon: UserCog,
        },
    ],
};
