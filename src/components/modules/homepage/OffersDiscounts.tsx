import SectionHeader from '@/components/common/SectionHeader'
import { Button } from '@/components/ui/button'
import { StaggerContainer, StaggerItemScale } from '@/components/common/MotionWrapper'
import Image from 'next/image'

export default function OffersDiscounts() {
  return (
    <div className="py-12 lg:py-20 px-3 container mx-auto">
      <SectionHeader subtitle="Special Offers" title="Best Deals & Discounts" description="Grab our exclusive offers and save more on your favorite meals." />
      <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
        {[1, 2].map(i => (
          <StaggerItemScale key={i} className={`group relative rounded-3xl overflow-hidden min-h-[250px] flex items-center shadow-sm border border-border/50 ${i === 1 ? 'bg-orange-100 dark:bg-orange-950/40' : 'bg-emerald-100 dark:bg-emerald-950/40'}`}>
            <div className="p-8 z-10 w-full md:w-2/3">
              <span className={`inline-block px-3 py-1 text-sm font-bold rounded-full mb-4 ${i === 1 ? 'bg-orange-500 text-white' : 'bg-emerald-500 text-white'}`}>
                {i === 1 ? '50% OFF' : 'FREE DELIVERY'}
              </span>
              <h3 className="text-2xl font-bold mb-2 text-foreground">
                {i === 1 ? 'Weekend Mega Sale' : 'On Your First Order'}
              </h3>
              <p className="text-muted-foreground mb-6 text-sm sm:text-base">Use code: SAVEBIG{i}</p>
              <Button variant="default" className={i === 1 ? 'bg-orange-500 hover:bg-orange-600 outline-none text-white' : 'bg-emerald-500 hover:bg-emerald-600 outline-none text-white'}>Claim Now</Button>
            </div>
            
            {/* Added Image Section */}
            <div className="absolute right-0 top-0 h-full w-2/5 hidden sm:block overflow-hidden">
               {/* Gradient overlay to seamlessly blend the image edge with the card background */}
               <div className={`absolute inset-y-0 left-0 w-16 z-10 bg-gradient-to-r ${i === 1 ? 'from-orange-100 dark:from-orange-950/40' : 'from-emerald-100 dark:from-emerald-950/40'} to-transparent`}></div>
               
               <Image 
                 src={i === 1 
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
  )
}
