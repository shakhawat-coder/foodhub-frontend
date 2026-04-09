"use client";

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Mail } from 'lucide-react'
import { FadeInScale } from '@/components/common/MotionWrapper'

export default function Newsletter() {
  return (
    <div className="py-16 px-3 container mx-auto mb-10">
      <FadeInScale className="bg-gradient-to-r from-orange-500 to-rose-500 rounded-3xl p-8 md:p-12 text-center text-white relative overflow-hidden shadow-xl">
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-white/10 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-2xl"></div>
        
        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Subscribe to Our Newsletter</h2>
          <p className="text-white/80 text-lg mb-8">
            Get the latest updates, special offers, and exclusive discounts right into your inbox.
          </p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto" onSubmit={(e) => e.preventDefault()}>
            <Input 
              type="email" 
              placeholder="Enter your email address" 
              className="bg-white/20 border-white/30 text-white placeholder:text-white/60 h-12 rounded-full px-6 focus-visible:ring-white"
              required
            />
            <Button type="submit" size="lg" className="h-12 rounded-full bg-white text-orange-600 hover:bg-gray-100 font-bold px-8">
              Subscribe
            </Button>
          </form>
        </div>
      </FadeInScale>
    </div>
  )
}
