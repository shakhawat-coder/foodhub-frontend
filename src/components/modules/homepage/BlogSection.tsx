import SectionHeader from '@/components/common/SectionHeader'
import BlogCard from '@/components/common/BlogCard'
import { FadeInUp, StaggerContainer, StaggerItem } from '@/components/common/MotionWrapper'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface BlogSectionProps {
  blogs: any[]
}

export default function BlogSection({ blogs }: BlogSectionProps) {
  return (
    <div className="py-8 sm:py-12 lg:py-16 container mx-auto px-4">
      <SectionHeader subtitle="News & Updates" title="Our Latest Blog" description="Stay updated with our latest news, recipes, and food tips." />

      {blogs.length > 0 ? (
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {blogs.map((blog: any) => (
            <StaggerItem key={blog.id}>
              <BlogCard blog={blog} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      ) : (
        <div className="text-center py-12 text-muted-foreground italic">
          New culinary stories are coming soon!
        </div>
      )}

      {blogs.length > 0 && (
        <FadeInUp delay={0.6} className='flex justify-center mt-8'>
          <Link
            href="/blogs"
          >
            <Button variant="outline" className="rounded-full px-8 py-6 font-bold uppercase tracking-widest text-xs hover:bg-primary hover:text-white transition-all shadow-md">
              View All Blog Posts
            </Button>

          </Link>
        </FadeInUp>
      )}
    </div>
  )
}

