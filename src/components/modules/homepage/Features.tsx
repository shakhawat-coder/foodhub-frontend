import SectionHeader from '@/components/common/SectionHeader'
import { Leaf, Clock, Award, Headphones } from 'lucide-react'
import { StaggerContainer, StaggerItem } from '@/components/common/MotionWrapper'

export default function Features() {
  const features = [
    {
      icon: <Leaf className="w-8 h-8 text-emerald-500" />,
      title: "Fresh Ingredients",
      description: "We use only the best, fresh ingredients sourced locally."
    },
    {
      icon: <Clock className="w-8 h-8 text-blue-500" />,
      title: "Fast Delivery",
      description: "Hot food delivered quickly right to your doorstep."
    },
    {
      icon: <Award className="w-8 h-8 text-amber-500" />,
      title: "Top Quality",
      description: "Highly rated chefs bringing you the ultimate culinary experience."
    },
    {
      icon: <Headphones className="w-8 h-8 text-rose-500" />,
      title: "24/7 Support",
      description: "Our dedicated support team is always ready to assist you."
    }
  ]

  return (
    <div className="py-8 sm:py-12 lg:py-16 px-3 container mx-auto">
      <SectionHeader subtitle="Why Choose Us" title="Our Best Features" description="We provide the best service to make your food ordering experience delightful." />
      <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-4 md:mt-8">
        {features.map((item, index) => (
          <StaggerItem key={index} className="flex flex-col items-center text-center p-6 rounded-2xl bg-background border border-border shadow-sm hover:-translate-y-2 transition-transform duration-300">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-muted mb-6 shadow-xs">
              {item.icon}
            </div>
            <h3 className="text-xl font-bold mb-3">{item.title}</h3>
            <p className="text-muted-foreground">{item.description}</p>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </div>
  )
}
