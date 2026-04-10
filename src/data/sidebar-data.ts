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
  Image,
  ShoppingBasket,
  Grid2X2,
  ShoppingCart,
  PlusCircle,
  ListOrdered,
  Bike,
  ShieldCheck,
  UserPlus,
  BarChart3,
} from "lucide-react";

export const sidebarData = {
  CUSTOMER: [
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
    {
      title: "Profile",
      url: "/provider-dashboard/profile",
      icon: UserCog,
    },
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
    {
      title: "Banners",
      url: "/admin-dashboard/banners",
      icon: Image,
    },
    {
      title: "Create Manager",
      url: "/admin-dashboard/create-manager",
      icon: UserPlus,
    },
  ],
  RIDER: [
    {
      title: "Dashboard",
      url: "/rider-dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Available Orders",
      url: "/rider-dashboard/available-orders",
      icon: ListOrdered,
    },
    {
      title: "Delivery History",
      url: "/rider-dashboard/history",
      icon: Truck,
    },
    {
      title: "Profile",
      url: "/rider-dashboard/profile",
      icon: UserCog,
    },
  ],
  MANAGER: [
    {
      title: "Dashboard",
      url: "/manager-dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Orders",
      url: "/manager-dashboard/orders",
      icon: ShoppingBasket,
    },
    {
      title: "Riders",
      url: "/manager-dashboard/riders",
      icon: Bike,
    },
    {
      title: "Reports",
      url: "/manager-dashboard/reports",
      icon: BarChart3,
    },
    {
      title: "Assignments",
      url: "/manager-dashboard/assign-rider",
      icon: ShieldCheck,
    },
  ],
};
