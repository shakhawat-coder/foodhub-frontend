"use client";
import { Facebook, Instagram, Mail, Phone, MapPin, Youtube, Linkedin, MoveRight, Loader2 } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { subscribersAPI } from "@/lib/api";
import { toast } from "sonner";

export default function Footer() {
    const [email, setEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        try {
            setIsSubmitting(true);
            await subscribersAPI.subscribe(email);
            toast.success("Subscribed successfully! Welcome to the family.");
            setEmail("");
        } catch (error: any) {
            toast.error(error.message || "Failed to subscribe. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <footer className="relative bg-[#0a0a0b] text-white pt-24 pb-12 overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] -translate-y-1/2 pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-600/10 rounded-full blur-[120px] translate-y-1/2 pointer-events-none" />

            <div className="container relative z-10 px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
                    {/* Brand Column */}
                    <div className="space-y-6">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="bg-primary p-2 rounded-xl group-hover:rotate-12 transition-transform duration-300 shadow-lg shadow-primary/20">
                                <img
                                    src="/logo.png"
                                    className="h-8 w-auto invert"
                                    alt="FoodHub Logo"
                                />
                            </div>
                            <span className="text-2xl font-black bg-linear-to-r from-white to-white/60 bg-clip-text text-transparent">FoodHub</span>
                        </Link>
                        <p className="text-zinc-400 text-[15px] leading-relaxed max-w-xs">
                            Elevating your dining experience with premium meals delivered with care. Your health, our priority.
                        </p>
                            <div className="flex gap-2">
                                {[
                                    { icon: Facebook, href: "https://facebook.com/" },
                                    { icon: Instagram, href: "https://instagram.com/" },
                                    { icon: Youtube, href: "https://youtube.com/" },
                                    { icon: Linkedin, href: "https://linkedin.com/company/" } 
                                ].map((social, i) => (
                                    <a
                                        key={i}
                                        href={social.href} 
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-primary hover:border-primary hover:scale-110 transition-all duration-300 text-zinc-400 hover:text-white"
                                    >
                                        <social.icon className="w-4 h-4" />
                                    </a>
                                ))}
                            </div>
                    </div>

                    {/* Quick Explore */}
                    <div>
                        <h4 className="text-white font-bold mb-8 text-lg uppercase tracking-wider">Quick Explore</h4>
                        <ul className="space-y-4">
                            {[
                                { name: "Home", href: "/" },
                                { name: "Our Menu", href: "/meals" },
                                { name: "Restaurants", href: "/restaurants" },
                                { name: "Stories & Blogs", href: "/blogs" },
                                { name: "Contact Us", href: "/contact-us" }
                            ].map((item, i) => (
                                <li key={i}>
                                    <Link
                                        href={item.href}
                                        className="text-zinc-400 hover:text-primary transition-colors flex items-center group"
                                    >
                                        <span className="w-0 group-hover:w-4 h-[1px] bg-primary  transition-all duration-300" />
                                        <span className="group-hover:ml-2 group-hover:text-primary transition-all duration-300">{item.name}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-white font-bold mb-8 text-lg uppercase tracking-wider">Get In Touch</h4>
                        <ul className="space-y-5">
                            <li>
                                <a href="mailto:support@foodhub.com" className="flex items-center gap-4 text-zinc-400 hover:text-white transition-colors group">
                                    <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-white/5 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all">
                                        <Mail className="w-4 h-4 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase font-bold text-zinc-500 tracking-tighter">Email Support</p>
                                        <p className="text-sm">support@foodhub.com</p>
                                    </div>
                                </a>
                            </li>
                            <li>
                                <a href="tel:+8801234567890" className="flex items-center gap-4 text-zinc-400 hover:text-white transition-colors group">
                                    <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-white/5 flex items-center justify-center group-hover:bg-primary/20 group-hover:border-primary/50 transition-all">
                                        <Phone className="w-4 h-4 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase font-bold text-zinc-500 tracking-tighter">Phone Line</p>
                                        <p className="text-sm">+880 1234 567890</p>
                                    </div>
                                </a>
                            </li>
                            <li className="flex items-center gap-4 text-zinc-400 group">
                                <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-white/5 flex items-center justify-center group-hover:bg-primary/20 group-hover:border-primary/50 transition-all">
                                    <MapPin className="w-4 h-4 text-primary" />
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase font-bold text-zinc-500 tracking-tighter">Location</p>
                                    <p className="text-sm">Dhaka, Bangladesh</p>
                                </div>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="text-white font-bold mb-8 text-lg uppercase tracking-wider">Stay Updated</h4>
                        <div className="bg-zinc-900/50 p-6 rounded-2xl border border-white/5 backdrop-blur-sm">
                            <p className="text-zinc-400 text-sm mb-4">Subscribe to get latest food deals and new menu alerts.</p>
                            <form onSubmit={handleSubscribe} className="flex gap-2">
                                <input
                                    type="email"
                                    required
                                    placeholder="your@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="bg-zinc-800 border-none rounded-xl px-4 py-2 text-sm w-full outline-hidden focus:ring-1 focus:ring-primary/50"
                                    disabled={isSubmitting}
                                />
                                <Button size="icon" className="rounded-xl shrink-0" type="submit" disabled={isSubmitting || !email}>
                                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <MoveRight className="w-4 h-4" />}
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-zinc-500 text-sm italic font-medium">
                        Crafted with <span className="text-red-500 animate-pulse">❤️</span> in Dhaka
                    </p>
                    <div className="flex flex-wrap justify-center gap-8 text-sm text-zinc-500">
                        <Link href="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link>
                        <Link href="/terms-of-service" className="hover:text-primary transition-colors">Terms of Service</Link>
                        <Link href="/shipping-policy" className="hover:text-primary transition-colors">Shipping Policy</Link>
                    </div>
                    <p className="text-zinc-500 text-sm">
                        © {new Date().getFullYear()} FoodHub. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}

