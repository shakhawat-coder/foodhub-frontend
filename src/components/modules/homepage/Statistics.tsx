"use client";
import React, { useEffect, useState } from 'react';
import { Users, UtensilsCrossed, Star, Truck } from 'lucide-react';
import { StaggerContainer, StaggerItemScale } from '@/components/common/MotionWrapper';
import CountUp from 'react-countup';
import { analyticsAPI, type PublicStats } from '@/lib/api';

export default function Statistics() {
  const [data, setData] = useState<PublicStats | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const stats = await analyticsAPI.getPublic();
        setData(stats);
      } catch (error) {
        console.error("Failed to fetch public stats", error);
      }
    };
    fetchStats();
  }, []);

  const stats = [
    { 
      label: "Happy Customers", 
      prefix: "", 
      suffix: data?.customers && data.customers >= 1000 ? "K+" : "+", 
      value: data ? (data.customers >= 1000 ? data.customers / 1000 : data.customers) : 0, 
      separator: "", 
      icon: <Users className="w-8 h-8" />,
      decimals: data?.customers && data.customers >= 1000 ? 1 : 0
    },
    { 
      label: "Restaurants", 
      prefix: "", 
      suffix: "+", 
      value: data?.restaurants ?? 0, 
      separator: "", 
      icon: <UtensilsCrossed className="w-8 h-8" /> 
    },
    { 
      label: "Food Items", 
      prefix: "", 
      suffix: "+", 
      value: data?.meals ?? 0, 
      separator: ",", 
      icon: <Star className="w-8 h-8" /> 
    },
    { 
      label: "Delivery Drivers", 
      prefix: "", 
      suffix: "+", 
      value: data?.riders ?? 0, 
      separator: "", 
      icon: <Truck className="w-8 h-8" /> 
    }
  ];

  return (
    <div className="py-8 sm:py-12 lg:py-16 bg-primary text-primary-foreground relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/food.png')]"></div>
      <div className="container px-4 mx-auto relative z-10">
        <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 text-center">
          {stats.map((stat, i) => (
            <StaggerItemScale key={i} className="flex flex-col items-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-white/20 flex items-center justify-center mb-4 shadow-sm">
                <div className="scale-75 sm:scale-100">{stat.icon}</div>
              </div>
              <div className="text-2xl sm:text-4xl lg:text-5xl font-extrabold mb-1 sm:mb-2 text-white">
                <CountUp 
                  end={stat.value} 
                  prefix={stat.prefix} 
                  suffix={stat.suffix} 
                  separator={stat.separator}
                  decimals={stat.decimals ?? 0}
                  enableScrollSpy 
                  scrollSpyOnce 
                  duration={2.5}
                />
              </div>
              <div className="text-[10px] sm:text-xs lg:text-sm font-bold opacity-90 uppercase tracking-widest">{stat.label}</div>
            </StaggerItemScale>
          ))}
        </StaggerContainer>
      </div>
    </div>
  );
}
