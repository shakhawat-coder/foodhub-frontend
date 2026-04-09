import SectionHeader from '@/components/common/SectionHeader'
import { Calendar, User, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { StaggerContainer, StaggerItem } from '@/components/common/MotionWrapper'

export default function BlogSection() {
  const posts = [
    {
      title: "Top 10 Healthy Foods You Must Try",
      image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=600",
      category: "Health",
      date: "Oct 12, 2026",
      author: "Admin"
    },
    {
      title: "How to Cook the Perfect Steak at Home",
      image: "https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&q=80&w=600",
      category: "Recipe",
      date: "Oct 10, 2026",
      author: "Chef John"
    },
    {
      title: "The Best Street Food Spots in the City",
      image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=600",
      category: "Review",
      date: "Oct 08, 2026",
      author: "Foodie"
    }
  ]

  return (
    <div className="py-12 lg:py-20 px-3 container mx-auto">
      <SectionHeader subtitle="News & Updates" title="Our Latest Blog" description="Stay updated with our latest news, recipes, and food tips." />
      <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
        {posts.map((post, i) => (
          <StaggerItem key={i} className="bg-background rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all border border-border group">
            <div className="relative h-48 overflow-hidden bg-muted">
              <Image src={post.image} alt={post.title} fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute top-4 right-4 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full shadow-md z-10">
                {post.category}
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {post.date}</span>
                <span className="flex items-center gap-1"><User className="w-3 h-3" /> {post.author}</span>
              </div>
              <h3 className="text-xl font-bold mb-4 line-clamp-2 hover:text-primary transition-colors cursor-pointer">{post.title}</h3>
              <Link href="#" className="inline-flex items-center text-sm font-semibold text-primary hover:underline">
                Read More <ArrowRight className="ml-1 w-4 h-4" />
              </Link>
            </div>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </div>
  )
}
