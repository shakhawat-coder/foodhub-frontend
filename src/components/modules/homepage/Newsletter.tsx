"use client";

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Mail } from 'lucide-react'
import { FadeInScale } from '@/components/common/MotionWrapper'
import { subscribersAPI } from '@/lib/api'
import { toast } from 'sonner'
import React, { useState } from 'react'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    try {
      await subscribersAPI.subscribe(email)
      toast.success('Subscribed successfully!')
      setEmail('')
    } catch (error: any) {
      toast.error(error.message || 'Failed to subscribe')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="py-8 sm:py-12 lg:py-16 container mx-auto px-4">
      <FadeInScale className="bg-gradient-to-r from-orange-500 to-rose-500 rounded-3xl p-6 sm:p-10 md:p-12 text-center text-white relative overflow-hidden shadow-xl">
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-white/10 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-2xl"></div>
        
        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
            <Mail className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
          </div>
          <h2 className="text-xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">Subscribe to Our Newsletter</h2>
          <p className="text-white/80 text-xs sm:text-sm lg:text-base mb-6 sm:mb-8">
            Get the latest updates, special offers, and exclusive discounts right into your inbox.
          </p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto" onSubmit={handleSubscribe}>
            <Input 
              type="email" 
              placeholder="Enter your email" 
              className="bg-white/20 border-white/30 text-white placeholder:text-white/60 h-10 sm:h-12 rounded-full px-6 focus-visible:ring-white text-xs sm:text-sm"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button type="submit" size="lg" disabled={loading} className="h-10 sm:h-12 rounded-full bg-white text-orange-600 hover:bg-gray-100 font-bold px-8 text-xs sm:text-sm">
              {loading ? 'Subscribing...' : 'Subscribe'}
            </Button>
          </form>
        </div>
      </FadeInScale>
    </div>
  )
}
