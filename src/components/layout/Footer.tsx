import Link from "next/link";
import React from "react";

export default function Footer() {
    return (
        <footer className="relative px-3">
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                    backgroundImage: "url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8Zm9vZHN8ZW58MHx8MHx8fDA%3D')",
                }}
            />
            <div className="absolute inset-0 bg-black/70" />
            <div className="relative z-10 text-white">
                <div className="container mx-auto grid gap-10 py-16 grid-cols-2 md:grid-cols-3">
                    <div className="col-span-2 md:col-span-1">
                        <Link href="/" className="flex items-center gap-2 mb-4">
                            <img
                                src="/logo.png"
                                className="h-15"
                                alt="FoodHub Logo"
                            />
                        </Link>
                        <p className="mt-4 text-sm text-white/80">
                            Discover delicious meals from your favorite restaurants and get
                            them delivered fast to your doorstep.
                        </p>
                    </div>

                    <div className="col-span-1">
                        <h3 className="mb-4 text-lg font-semibold">Quick Links</h3>
                        <ul className="space-y-2 text-sm text-white/80">
                            <li>
                                <Link href="/" className="hover:text-yellow-500">Home</Link>
                            </li>
                            <li>
                                <Link href="/meals" className="hover:text-yellow-500">Meals</Link>
                            </li>
                            <li>
                                <Link href="/restaurants" className="hover:text-yellow-500">Restaurants</Link>
                            </li>
                            <li>
                                <Link href="user-dashboard/order-tracking" className="hover:text-yellow-500">Track Your Order</Link>
                            </li>
                        </ul>
                    </div>

                    <div className="col-span-1">
                        <h3 className="mb-4 text-lg font-semibold">Contact</h3>
                        <ul className="space-y-2 text-sm text-white/80">
                            <li>
                                <a href="mailto:support@foodhub.com" className="hover:text-yellow-500">Email: support@foodhub.com </a>
                            </li>
                            <li>
                                <a href="tel:+8801234567890" className="hover:text-yellow-500">Phone: +880 1234-567890
                                </a>
                            </li>
                            <li>Dhaka, Bangladesh</li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/20">
                    <div className="container mx-auto flex flex-col items-center justify-between gap-4 py-6 text-sm md:flex-row">
                        <p className="text-white/70">
                            © {new Date().getFullYear()} FoodHub. All rights reserved.
                        </p>

                        <div className="flex gap-4">
                            <a href="#" className="hover:text-yellow-500">Facebook</a>
                            <a href="#" className="hover:text-yellow-500">Instagram</a>
                            <a href="#" className="hover:text-yellow-500">Twitter</a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
