"use client";

import { Book, CarTaxiFront, Menu, ShoppingCart, Sunset, Trees, Zap } from "lucide-react";

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
import { useRouter } from "next/navigation";
import { toast } from "sonner";

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

const Navbar = ({

  logo = {
    url: "https://www.shadcnblocks.com",
    src: "/logo.png",
    alt: "logo"
  },
  menu = [
    { title: "Home", url: "/" },

    {
      title: "Meals",
      url: "/meals",
    },

    {
      title: "Restaurants",
      url: "/restaurants",
    },

    {
      title: "Orders",
      url: "/orders",
    },

    {
      title: "About",
      url: "/about",
    },
    {
      title: "Contact",
      url: "/contact",
    }
  ],
  auth = {
    login: { title: "Login", url: "/login" },
    signup: { title: "Sign up", url: "/signup" },
  },
  className,
}: Navbar1Props) => {
  const session = authClient.useSession()
  const sessionUser = session.data?.user
  console.log("session is", sessionUser);
  const router = useRouter()

  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", onDocClick)
    return () => document.removeEventListener("mousedown", onDocClick)
  }, [])

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

  return (
    <section className={cn("py-4 fixed w-full top-0 z-50 bg-white/20 backdrop-blur-sm", className)}>
      <div className="container">
        <nav className="hidden items-center justify-between lg:flex">
          <Link href={logo.url} className="flex items-center gap-2">
            <img
              src={logo.src}
              className="max-h-8 dark:invert"
              alt={logo.alt}
            />
          </Link>
          <div className="flex items-center gap-6">
            <div className="flex items-center">
              <NavigationMenu>
                <NavigationMenuList>
                  {menu.map((item) => renderMenuItem(item))}
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>
          <div className="flex gap-2">
            {!sessionUser ? (
              <>
                <Button asChild variant="outline" size="sm">
                  <Link href={auth.login.url}>{auth.login.title}</Link>
                </Button>
                <Button asChild size="sm">
                  <Link href={auth.signup.url}>{auth.signup.title}</Link>
                </Button>
              </>
            ) : (
              <div className="relative flex items-center gap-4">
                <Link href={"/cart"} className="relative">
                  <ShoppingCart />
                  <span className="absolute -top-3 -right-1 bg-red-500 text-white h-5 w-5 flex items-center justify-center text-xs rounded-full">9+</span>
                </Link>

                <button
                  aria-expanded={dropdownOpen}
                  onClick={() => setDropdownOpen((v) => !v)}
                  className="inline-flex items-center bg-white text-black justify-center rounded-full w-9 h-9 "
                >
                  {((sessionUser.name ?? sessionUser.email ?? "?") as string).charAt(0).toUpperCase()}
                </button>
                {dropdownOpen && (
                  <div ref={dropdownRef} className="absolute right-5 top-7 mt-2 w-40 bg-popover text-popover-foreground rounded-md border shadow-md z-50">
                    <Link href="/dashboard" className="block px-3 py-2 text-sm">Dashboard</Link>
                    <button onClick={() => { setDropdownOpen(false); handleLogout() }} className="w-full text-left px-3 py-2 text-sm">Logout</button>
                  </div>
                )}
              </div>
            )}
          </div>
        </nav>

        {/* Mobile Menu */}
        <div className="block lg:hidden">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href={logo.url} className="flex items-center gap-2">
              <img
                src={logo.src}
                className="max-h-8 dark:invert"
                alt={logo.alt}
              />
            </Link>
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
                      <Link href="/dashboard" className="w-full">
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
      </div>
    </section>
  );
};

const renderMenuItem = (item: MenuItem) => {
  return (
    <NavigationMenuItem key={item.title}>
      <NavigationMenuLink
        asChild
        className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-accent-foreground"
      >
        <Link href={item.url}>{item.title}</Link>
      </NavigationMenuLink>
    </NavigationMenuItem>
  );
};

const renderMobileMenuItem = (item: MenuItem) => {

  return (
    <Link key={item.title} href={item.url} className="text-md font-semibold">
      {item.title}
    </Link>
  );
};

export { Navbar };
