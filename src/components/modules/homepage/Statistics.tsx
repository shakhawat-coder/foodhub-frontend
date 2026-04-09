"use client";

import { Users, UtensilsCrossed, Star, Truck } from 'lucide-react'
import { StaggerContainer, StaggerItemScale } from '@/components/common/MotionWrapper'
import CountUp from 'react-countup'

export default function Statistics() {
  const stats = [
    { label: "Happy Customers", prefix: "", suffix: "K+", value: 10, separator: "", icon: <Users className="w-8 h-8" /> },
    { label: "Restaurants", prefix: "", suffix: "+", value: 500, separator: "", icon: <UtensilsCrossed className="w-8 h-8" /> },
    { label: "Food Items", prefix: "", suffix: "+", value: 2000, separator: ",", icon: <Star className="w-8 h-8" /> },
    { label: "Delivery Drivers", prefix: "", suffix: "+", value: 150, separator: "", icon: <Truck className="w-8 h-8" /> }
  ]

  return (
    <div className="py-16 bg-primary text-primary-foreground relative overflow-hidden my-10">
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/food.png')]"></div>
      <div className="container px-4 mx-auto relative z-10">
        <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, i) => (
            <StaggerItemScale key={i} className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mb-4 shadow-sm">
                {stat.icon}
              </div>
              <div className="text-4xl md:text-5xl font-extrabold mb-2">
                <CountUp 
                  end={stat.value} 
                  prefix={stat.prefix} 
                  suffix={stat.suffix} 
                  separator={stat.separator}
                  enableScrollSpy 
                  scrollSpyOnce 
                  duration={2.5}
                />
              </div>
              <div className="text-sm md:text-base font-medium opacity-80 uppercase tracking-wide">{stat.label}</div>
            </StaggerItemScale>
          ))}
        </StaggerContainer>
      </div>
    </div>
  )
}
