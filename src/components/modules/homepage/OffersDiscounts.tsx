"use client";

import React, { useEffect, useState } from 'react';
import SectionHeader from '@/components/common/SectionHeader';
import { Button } from '@/components/ui/button';
import { StaggerContainer, StaggerItemScale } from '@/components/common/MotionWrapper';
import Image from 'next/image';
import { couponsAPI } from '@/lib/api';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Loader2, Ticket } from 'lucide-react';

export default function OffersDiscounts() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [myCoupons, setMyCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [claimingId, setClaimingId] = useState<string | null>(null);
  const { data: session } = authClient.useSession();
  const router = useRouter();

  const fetchMyCoupons = async () => {
    if (!session) return;
    try {
      const res = await couponsAPI.getMy();
      setMyCoupons(res.data || []);
    } catch (error) {
      console.error("Failed to fetch my coupons", error);
    }
  };

  useEffect(() => {
    const dataFetch = async () => {
      setLoading(true);
      try {
        const res = await couponsAPI.getActive();
        setCoupons(res.data || []);
        if (session) {
          await fetchMyCoupons();
        }
      } catch (error) {
        console.error("Failed to fetch coupon data", error);
      } finally {
        setLoading(false);
      }
    };
    dataFetch();
  }, [session]);

  const handleClaim = async (couponId: string) => {
    if (!session) {
      toast.error("Please login to collect coupons");
      router.push('/login');
      return;
    }

    setClaimingId(couponId);
    try {
      await couponsAPI.collect(couponId);
      toast.success("Coupon collected successfully! Use it in your cart.");
      await fetchMyCoupons();
    } catch (error: any) {
      toast.error(error.message || "Failed to collect coupon");
    } finally {
      setClaimingId(null);
    }
  };

  const isClaimed = (couponId: string) => {
    return myCoupons.some((mc: any) => mc.couponId === couponId);
  };

  if (loading) {
    return (
      <div className="py-8 sm:py-12 lg:py-16 container mx-auto px-4">
         <SectionHeader subtitle="Special Offers" title="Best Deals & Discounts" description="Grab our exclusive offers and save more on your favorite meals." />
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 md:mt-8">
            {[1, 2].map(i => (
              <div key={i} className="h-48 sm:h-64 bg-muted animate-pulse rounded-3xl" />
            ))}
         </div>
      </div>
    );
  }

  if (coupons.length === 0) return null;

  return (
    <div className="py-8 sm:py-12 lg:py-16 container mx-auto px-4">
      <SectionHeader subtitle="Special Offers" title="Best Deals & Discounts" description="Grab our exclusive offers and save more on your favorite meals." />
      <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 md:mt-8">
        {coupons.map((coupon, index) => (
          <StaggerItemScale key={coupon.id} className={`group relative rounded-3xl overflow-hidden min-h-[200px] sm:min-h-[250px] flex items-center shadow-sm border border-border/50 ${index % 2 === 0 ? 'bg-orange-100 dark:bg-orange-950/40' : 'bg-emerald-100 dark:bg-emerald-950/40'}`}>
            <div className="p-6 sm:p-8 z-10 w-full md:w-2/3">
              <span className={`inline-flex items-center gap-2 px-3 py-1 text-[10px] sm:text-xs lg:text-sm font-bold rounded-full mb-3 sm:mb-4 ${index % 2 === 0 ? 'bg-orange-500 text-white' : 'bg-emerald-500 text-white'}`}>
                <Ticket className="w-3 h-3 sm:w-4 h-4" />
                {coupon.discountPercent}% OFF
              </span>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-1 sm:mb-2 text-foreground">
                {coupon.code}
              </h3>
              <p className="text-muted-foreground mb-4 sm:mb-6 text-[11px] sm:text-sm lg:text-base leading-relaxed">{coupon.description}</p>
              <div className="flex flex-col gap-1 sm:gap-2">
                <p className="text-[10px] sm:text-xs text-muted-foreground font-medium italic">Min order: ${coupon.minOrderAmount}</p>
                <Button 
                  variant="default" 
                  disabled={claimingId === coupon.id || isClaimed(coupon.id)}
                  onClick={() => handleClaim(coupon.id)}
                  className={`w-fit h-9 sm:h-11 px-6 sm:px-8 rounded-xl text-xs sm:text-sm font-bold transition-all hover:scale-105 active:scale-95 ${isClaimed(coupon.id) ? 'bg-gray-400 cursor-not-allowed opacity-80' : (index % 2 === 0 ? 'bg-orange-500 hover:bg-orange-600 text-white' : 'bg-emerald-500 hover:bg-emerald-600 text-white')}`}
                >
                  {claimingId === coupon.id ? <><Loader2 className="w-3 h-3 sm:w-4 h-4 mr-2 animate-spin" /> Claiming...</> : (isClaimed(coupon.id) ? "Claimed" : "Claim Now")}
                </Button>
              </div>
            </div>
            
            <div className="absolute right-0 top-0 h-full w-2/5 hidden sm:block overflow-hidden">
               <div className={`absolute inset-y-0 left-0 w-16 z-10 bg-gradient-to-r ${index % 2 === 0 ? 'from-orange-100 dark:from-orange-950/40' : 'from-emerald-100 dark:from-emerald-950/40'} to-transparent`}></div>
               
               <Image 
                 src={index % 2 === 0
                   ? 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=400' 
                   : 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=400'
                 }
                 alt="Special Offer"
                 fill
                 className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
               />
            </div>
          </StaggerItemScale>
        ))}
      </StaggerContainer>
    </div>
  );
}
