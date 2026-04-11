import SectionHeader from '@/components/common/SectionHeader'
import { Calendar, User, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { StaggerContainer, StaggerItem } from '@/components/common/MotionWrapper'
import { format } from 'date-fns'

interface BlogSectionProps {
  blogs: any[]
}

export default function BlogSection({ blogs }: BlogSectionProps) {
  return (
    <div className="py-12 lg:py-20 px-3 container mx-auto">
      <SectionHeader subtitle="News & Updates" title="Our Latest Blog" description="Stay updated with our latest news, recipes, and food tips." />

      {blogs.length > 0 ? (
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {blogs.map((blog, i) => (
            <StaggerItem key={blog.id} className="bg-background rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all border border-border group">
              <div className="relative h-48 overflow-hidden bg-muted">
                {blog.image ? (
                  <Image src={blog.image} alt={blog.title} fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground italic text-xs">No image</div>
                )}
                <div className="absolute top-4 right-4 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full shadow-md z-10 uppercase">
                  Community
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3 font-semibold uppercase tracking-wider">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3 text-primary/70" /> {format(new Date(blog.createdAt), 'MMM dd, yyyy')}</span>
                  <span className="flex items-center gap-1"><User className="w-3 h-3 text-primary/70" /> Admin</span>
                </div>
                <h3 className="text-xl font-bold mb-4 line-clamp-2 hover:text-primary transition-colors cursor-pointer">{blog.title}</h3>
                <Link href={`/blogs/${blog.id}`} className="inline-flex items-center text-sm font-bold text-primary group-hover:translate-x-1 transition-transform uppercase tracking-tighter">
                  Read Full Story <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      ) : (
        <div className="text-center py-12 text-muted-foreground italic">
          New culinary stories are coming soon!
        </div>
      )}

      {blogs.length > 0 && (
        <div className="mt-12 text-center">
          <Link href="/blogs">
            <Button variant="outline" className="rounded-full px-8 py-6 font-bold uppercase tracking-widest text-xs hover:bg-primary hover:text-white transition-all shadow-md">
              View All Blog Posts
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}

// Internal Button component if not imported from UI
function Button({ children, className, variant, ...props }: any) {
  const base = "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50";
  const variants: any = {
    outline: "border border-input bg-background shadow-xs hover:bg-accent hover:text-accent-foreground"
  };
  return (
    <button className={`${base} ${variants[variant] || ""} ${className}`} {...props}>
      {children}
    </button>
  );
}
