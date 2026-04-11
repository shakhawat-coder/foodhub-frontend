"use client";

import { Menu, ShoppingCart, Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";
import React, { useState, useRef, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";
import { ModeToggle } from "@/components/mode-toggle";
import { NavbarSearch } from "@/components/layout/navbar-search";

interface MenuItem {
  title: string;
  url: string;
  description?: string;
  icon?: React.ReactNode;
  items?: MenuItem[];
}

interface Navbar1Props {
  className?: string;
  logo?: {
    url: string;
    src: string;
    alt: string;
    className?: string;
  };
  menu?: MenuItem[];
  auth?: {
    login: {
      title: string;
      url: string;
    };
    signup: {
      title: string;
      url: string;
    };
  };
}

import { mealsAPI } from "@/lib/api";

const Navbar = ({
  logo = {
    url: "/",
    src: "/logo.png",
    alt: "logo"
  },
  menu = [
    { title: "Home", url: "/" },
    { title: "Meals", url: "/meals" },
    { title: "Menu", url: "/menu" },
    { title: "Restaurants", url: "/restaurants" },
    { title: "Contact", url: "/contact" },
  ],
  auth = {
    login: { title: "Login", url: "/login" },
    signup: { title: "Sign up", url: "/signup" },
  },
  className,
}: Navbar1Props) => {
  const session = authClient.useSession()
  const sessionUser = session.data?.user
  const router = useRouter()
  const pathname = usePathname();

  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
  const [reviewedMeals, setReviewedMeals] = useState<any[]>([])
  const dropdownRef = useRef<HTMLDivElement | null>(null)

  const getDashboardPath = (role?: string) => {
    const normalized = (role || "").toUpperCase();
    if (normalized === "CUSTOMER") return "/user-dashboard";
    return `/${normalized.toLowerCase()}-dashboard`;
  };

  useEffect(() => {
    const fetchReviewed = async () => {
      try {
        const meals = await mealsAPI.getReviewed(4);
        setReviewedMeals(meals);
      } catch (error) {
        console.error("Failed to fetch reviewed meals", error);
      }
    };
    fetchReviewed();
  }, []);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", onDocClick)
    return () => document.removeEventListener("mousedown", onDocClick)
  }, [])

  useEffect(() => {
    setMobileSearchOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await authClient.signOut()
      toast.success("Logged out")
      router.push("/")
    } catch (e) {
      console.error("Logout failed", e)
      toast.error("Failed to log out")
    }
  }

  const renderMenuItem = (item: MenuItem) => {
    if (item.title === "Meals" && reviewedMeals.length > 0) {
      return (
        <NavigationMenuItem key={item.title}>
          <NavigationMenuTrigger className="bg-transparent hover:bg-muted font-medium">
            <Link href={item.url}>{item.title}</Link>
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="w-[400px] md:w-[600px] lg:w-[800px] max-w-[calc(100vw-2rem)] p-6 bg-popover rounded-xl shadow-2xl border">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-primary border-b pb-2 mb-4">
                    <h3 className="text-lg font-bold flex items-center gap-2 italic">
                       Highly Reviewed
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    {reviewedMeals.map((meal) => (
                      <Link 
                        key={meal.id} 
                        href={`/meals/${meal.id}`}
                        className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted/50 transition-all group duration-300"
                      >
                         <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg shadow-sm">
                           <img 
                             src={meal.image || '/mealbanner.jpg'} 
                             alt={meal.name}
                             className="object-cover w-full h-full transform group-hover:scale-110 transition-transform duration-500"
                           />
                         </div>
                         <div className="flex-1 min-w-0">
                           <h4 className="font-bold truncate group-hover:text-primary transition-colors text-base">{meal.name}</h4>
                           <div className="flex items-center justify-between mt-1">
                              <span className="text-orange-600 font-bold text-sm">${meal.price}</span>
                              <span className="text-[10px] bg-muted px-2 py-0.5 rounded text-muted-foreground uppercase font-semibold">Reviewed</span>
                           </div>
                         </div>
                      </Link>
                    ))}
                  </div>
                </div>
                <div className="bg-primary/5 p-8 rounded-2xl flex flex-col justify-center items-center text-center space-y-5 border border-primary/10">
                  <div className="h-12 w-12 bg-primary/20 rounded-full flex items-center justify-center">
                    <ShoppingCart className="text-primary w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-black text-primary italic">Hungry for more?</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Explore our curated collection of delicious meals from top-rated providers across the city.
                  </p>
                  <Link href="/meals" className="w-full">
                    <Button className="w-full h-12 rounded-xl text-lg font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all">
                      View All Meals
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      );
    }
    return (
      <NavigationMenuItem key={item.title}>
        <NavigationMenuLink
          asChild
          className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-accent-foreground"
        >
          <Link href={item.url}>{item.title}</Link>
        </NavigationMenuLink>
      </NavigationMenuItem>
    );
  };

  const renderMobileMenuItem = (item: MenuItem) => {
    if (item.title === "Meals" && reviewedMeals.length > 0) {
      return (
        <AccordionItem key={item.title} value={item.title} className="border-none">
          <AccordionTrigger className="hover:no-underline py-2 text-md font-semibold">
            {item.title}
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-col gap-4 pl-4 pt-2">
              <div className="grid grid-cols-2 gap-3">
                {reviewedMeals.slice(0, 2).map((meal) => (
                  <Link key={meal.id} href={`/meal/${meal.id}`} className="group space-y-2">
                    <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                      <img 
                        src={meal.image || '/mealbanner.jpg'} 
                        alt={meal.name}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="text-xs font-bold line-clamp-1">{meal.name}</div>
                  </Link>
                ))}
              </div>
              <Link href="/meals">
                <Button variant="outline" size="sm" className="w-full text-xs h-8">
                  Browse All Meals
                </Button>
              </Link>
            </div>
          </AccordionContent>
        </AccordionItem>
      );
    }
    return (
      <Link key={item.title} href={item.url} className="text-md font-semibold py-2 block">
        {item.title}
      </Link>
    );
  };

  return (
    <section className={cn("py-2 lg:py-4 px-3 fixed w-full top-0 z-50 bg-white/20 backdrop-blur-sm", className)}>
      <div className="container mx-auto">
        <nav className="hidden items-center justify-between gap-4 lg:flex">
          <Link href={logo.url} className="flex shrink-0 items-center gap-2">
            <img
              src={logo.src}
              className="max-h-8 dark:invert"
              alt={logo.alt}
            />
          </Link>
          <div className="flex shrink-0 items-center gap-6">
            <div className="flex items-center">
              <NavigationMenu>
                <NavigationMenuList>
                  {menu.map((item) => renderMenuItem(item))}
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <NavbarSearch className="max-w-[180px]" />
            <ModeToggle />
            {!sessionUser ? (
              <>
                <Button asChild variant="outline" size="lg">
                  <Link href={auth.login.url}>{auth.login.title}</Link>
                </Button>
                <Button asChild size="lg">
                  <Link href={auth.signup.url}>{auth.signup.title}</Link>
                </Button>
              </>
            ) : (
              <div className="relative flex items-center gap-4">
                {(sessionUser as any).role === "CUSTOMER" && (
                  <Link href={"/cart"} className="relative">
                    <ShoppingCart />
                  </Link>
                )}

                <button
                  aria-expanded={dropdownOpen}
                  onClick={() => setDropdownOpen((v) => !v)}
                  className="inline-flex items-center bg-white text-black shadow-md cursor-pointer justify-center rounded-full w-9 h-9 "
                >
                  {((sessionUser.name ?? sessionUser.email ?? "?") as string).charAt(0).toUpperCase()}
                </button>
                {dropdownOpen && (
                  <div ref={dropdownRef} className="absolute right-5 top-7 mt-2 w-40 bg-popover text-popover-foreground rounded-md border shadow-md z-50">
                    <Link href={getDashboardPath((sessionUser as any).role)} className="block px-3 py-2 text-sm">Dashboard</Link>
                    <button onClick={() => { setDropdownOpen(false); handleLogout() }} className="w-full text-left px-3 py-2 text-sm">Logout</button>
                  </div>
                )}
              </div>
            )}
          </div>
        </nav>

        {/* Mobile Menu */}
        <div className="block lg:hidden">
          <div className="flex items-center justify-between gap-2">
            {/* Logo */}
            <Link href={logo.url} className="flex shrink-0 items-center gap-2">
              <img
                src={logo.src}
                className="max-h-8 dark:invert"
                alt={logo.alt}
              />
            </Link>

            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
                className="rounded-full"
              >
                {mobileSearchOpen ? <X className="size-5" /> : <Search className="size-5" />}
              </Button>
              <ModeToggle />
              {sessionUser && (sessionUser as any).role === "CUSTOMER" && (
                <Link href={"/cart"} className="relative">
                  <ShoppingCart className="size-5" />
                </Link>
              )}

              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Menu className="size-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent className="overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle>
                      <Link href={logo.url} className="flex items-center gap-2">
                        <img
                          src={logo.src}
                          className="max-h-8 dark:invert"
                          alt={logo.alt}
                        />
                      </Link>
                    </SheetTitle>
                  </SheetHeader>
                  <div className="flex flex-col gap-6 p-4">
                    <Accordion
                      type="single"
                      collapsible
                      className="flex w-full flex-col gap-4"
                    >
                      {menu.map((item) => renderMobileMenuItem(item))}
                    </Accordion>
                    {sessionUser ? (
                      <div className="flex flex-col gap-3">
                        <div className="font-medium">Hello {sessionUser.name}</div>
                        <Link href={getDashboardPath((sessionUser as any).role)} className="w-full">
                          <Button className="w-full">Dashboard</Button>
                        </Link>
                        <Button onClick={handleLogout} className="w-full">Logout</Button>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-3">
                        <Button asChild variant="outline">
                          <Link href={auth.login.url}>{auth.login.title}</Link>
                        </Button>
                        <Button asChild>
                          <Link href={auth.signup.url}>{auth.signup.title}</Link>
                        </Button>
                      </div>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          <AnimatePresence>
            {mobileSearchOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="py-3 px-1">
                  <NavbarSearch className="w-full" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export { Navbar };
