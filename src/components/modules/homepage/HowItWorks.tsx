import SectionHeader from '@/components/common/SectionHeader'
import { MapPin, Utensils, Truck } from 'lucide-react'
import { StaggerContainer, StaggerItem } from '@/components/common/MotionWrapper'

export default function HowItWorks() {
  const steps = [
    {
      icon: <MapPin className="w-10 h-10 text-primary" />,
      title: "Choose Location",
      description: "Enter your address to see available restaurants and meals in your area."
    },
    {
      icon: <Utensils className="w-10 h-10 text-primary" />,
      title: "Order Your Food",
      description: "Browse menus, select your favorite dishes, and checkout easily."
    },
    {
      icon: <Truck className="w-10 h-10 text-primary" />,
      title: "Fast Delivery",
      description: "Enjoy fast and trackable delivery right to your doorstep."
    }
  ]

  return (
    <div className="py-8 sm:py-12 lg:py-16 bg-muted/30">
      <div className="container px-4 mx-auto">
        <SectionHeader subtitle="Simple process" title="How It Works" description="Get your favorite food delivered in just three simple steps." />
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mt-4 md:mt-8 relative">
          {/* Connecting line for desktop */}
          <div className="hidden md:block absolute top-[40px] left-[15%] right-[15%] h-0.5 bg-primary/20 -z-10 border-t-2 border-dashed border-primary/20"></div>
          
          {steps.map((step, index) => (
            <StaggerItem key={index} className="flex flex-col items-center text-center p-6 bg-background rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-border">
              <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full bg-primary/10 flex items-center justify-center mb-4 sm:mb-6 relative">
                <div className="scale-75 sm:scale-90 lg:scale-100">
                  {step.icon}
                </div>
                <div className="absolute top-0 right-0 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-primary text-primary-foreground text-xs sm:text-sm font-bold flex items-center justify-center border-2 sm:border-4 border-background">
                  {index + 1}
                </div>
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">{step.title}</h3>
              <p className="text-xs sm:text-sm lg:text-base text-muted-foreground leading-relaxed">{step.description}</p>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </div>
  )
}
