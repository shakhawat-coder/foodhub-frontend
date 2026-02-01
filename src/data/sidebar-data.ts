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
  ListOrdered,
} from "lucide-react";

export const sidebarData = {
  USER: [
    {
      title: "Dashboard",
      url: "/user-dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "My Orders",
      url: "/user-dashboard/my-orders",
      icon: ShoppingBag,
    },
    {
      title: "Track Order",
      url: "/user-dashboard/order-tracking",
      icon: Truck,
    },
    {
      title: "Profile",
      url: "/user-dashboard/profile",
      icon: UserCog,
    },
  ],
  PROVIDER: [
    {
      title: "Dashboard",
      url: "/provider-dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Menu Management",
      url: "/provider-dashboard/menu",
      icon: UtensilsCrossed,
      items: [
        { title: "All Meals", url: "/provider-dashboard/all-meals" },
        { title: "Add Meal", url: "/provider-dashboard/add-meal" },
      ],
    },
    {
      title: "Orders",
      url: "/provider-dashboard/orders",
      icon: ClipboardList,
      items: [
        {
          title: "Incoming Orders",
          url: "/provider-dashboard/incoming-order",
        },
        { title: "Order History", url: "/provider-dashboard/order-history" },
      ],
    },
    // {
    //   title: "Profile",
    //   url: "/provider-dashboard/profile",
    //   icon: UserCog,
    // },
  ],
  ADMIN: [
    {
      title: "Dashboard",
      url: "/admin-dashboard",
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
      ],
    },
    {
      title: "Meals Management",
      url: "/admin-dashboard/meals",
      icon: UtensilsCrossed,
    },
    // {
    //   title: "Profile",
    //   url: "/admin-dashboard/profile",
    //   icon: UserCog,
    // },
  ],
};
