import Image from 'next/image'
import Link from 'next/link'
import { format } from 'date-fns'
import { Calendar, User, ArrowRight } from 'lucide-react'

interface Blog {
  id: string;
  title: string;
  content: string;
  image: string;
  createdAt: string;
}

interface BlogCardProps {
  blog: Blog;
}

export default function BlogCard({ blog }: BlogCardProps) {
  const dateFormatted = blog.createdAt ? format(new Date(blog.createdAt), 'MMM dd, yyyy') : 'Recently';
  const contentSnippet = blog.content 
    ? blog.content
        .replace(/<[^>]*>?/gm, "")
        .replace(/&nbsp;/g, " ")
        .replace(/&quot;/g, '"')
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .slice(0, 120) + "..."
    : "";

  return (
    <div className="bg-background rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-border group flex flex-col h-full">
      {/* Image Link */}
      <Link href={`/blogs/${blog.id}`} className="relative h-56 overflow-hidden block">
        {blog.image ? (
          <Image 
            src={blog.image} 
            alt={blog.title} 
            fill 
            className="object-cover transition-transform duration-700 group-hover:scale-110" 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground italic text-xs">No image</div>
        )}
        <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </Link>
      
      <div className="p-6 flex flex-col flex-grow">
        {/* Meta Info */}
        <div className="flex items-center gap-4 text-[10px] text-muted-foreground mb-4 font-bold uppercase tracking-widest">
          <span className="flex items-center gap-1.5 px-2 py-1 bg-muted rounded-full">
            <Calendar className="w-3 h-3 text-primary" /> 
            {dateFormatted}
          </span>
          <span className="flex items-center gap-1.5 px-2 py-1 bg-muted rounded-full">
            <User className="w-3 h-3 text-primary" /> 
            Admin
          </span>
        </div>
        
        {/* Title Link */}
        <Link href={`/blogs/${blog.id}`} className="block mb-3 group/title">
          <h3 className="text-xl font-extrabold line-clamp-2 group-hover/title:text-primary transition-colors leading-tight tracking-tight">
            {blog.title}
          </h3>
        </Link>
        
        {/* Content Snippet */}
        <p className="text-muted-foreground text-sm line-clamp-3 mb-6 flex-grow leading-relaxed">
          {contentSnippet}
        </p>
        
        {/* Bottom Link */}
        <div className="pt-4 border-t border-border/50">
          <Link 
            href={`/blogs/${blog.id}`} 
            className="inline-flex items-center text-xs font-black text-primary uppercase tracking-widest group/btn"
          >
            Read Full Story 
            <div className="ml-2 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center transition-all group-hover/btn:bg-primary group-hover/btn:text-white">
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
