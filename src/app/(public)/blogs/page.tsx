import React from "react";
import { blogsAPI } from "@/lib/api";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import Link from "next/link";
import { format } from "date-fns";
import { Calendar, ChevronRight, User } from "lucide-react";

export default async function BlogsPage() {
  let blogs: any[] = [];
  try {
    const res = await blogsAPI.getAll();
    blogs = res.data;
  } catch (error) {
    console.error("Failed to fetch blogs:", error);
  }

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <div className="max-w-3xl mx-auto text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 bg-linear-to-r from-primary to-orange-600 bg-clip-text text-transparent">
          Latest Stories & Culinary Insights
        </h1>
        <p className="text-muted-foreground text-lg leading-relaxed">
          Discover kitchen secrets, foodie tips, and the latest updates from the heart of our culinary community.
        </p>
      </div>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {blogs.map((blog) => (
          <Link key={blog.id} href={`/blogs/${blog.id}`} className="group h-full">
            <Card className="flex flex-col h-full overflow-hidden border-muted/60 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1">
              <div className="relative h-56 w-full overflow-hidden">
                <img
                  src={blog.image || "/placeholder-blog.png"}
                  alt={blog.title}
                  className="object-cover h-full w-full transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                   <span className="text-white text-sm font-semibold flex items-center gap-1">
                       Read More <ChevronRight className="h-4 w-4" />
                   </span>
                </div>
              </div>
              <CardHeader className="pt-6 pb-2">
                <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3 uppercase tracking-widest font-bold">
                   <div className="flex items-center gap-1">
                     <Calendar className="h-3 w-3" />
                     {format(new Date(blog.createdAt), "MMM dd, yyyy")}
                   </div>
                   <div className="h-1 w-1 rounded-full bg-muted-foreground/30" />
                   <div className="flex items-center gap-1">
                     <User className="h-3 w-3" />
                     Admin
                   </div>
                </div>
                <h3 className="line-clamp-2 text-xl font-bold leading-snug group-hover:text-primary transition-colors">
                  {blog.title}
                </h3>
              </CardHeader>
              <CardContent className="flex-grow">
                <div 
                   className="text-muted-foreground line-clamp-3 text-sm leading-relaxed"
                   dangerouslySetInnerHTML={{ __html: blog.content.replace(/<[^>]*>?/gm, "").slice(0, 150) + "..." }}
                />
              </CardContent>
              <CardFooter className="pt-4 border-t border-muted/30">
                 <span className="text-primary font-bold text-sm tracking-tight">CONTINUE READING</span>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>

      {blogs.length === 0 && (
        <div className="text-center py-20 bg-muted/20 rounded-3xl border-2 border-dashed border-muted">
           <p className="text-muted-foreground text-lg">No stories published yet. Stay tuned!</p>
        </div>
      )}
    </div>
  );
}
