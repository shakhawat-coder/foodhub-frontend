import React from "react";
import { blogsAPI } from "@/lib/api";
import { format } from "date-fns";
import { Calendar, User, ArrowLeft, Share2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function BlogDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let blog: any = null;

  try {
    const res = await blogsAPI.getById(id);
    blog = res.data;
  } catch (error) {
    console.error("Failed to fetch blog details:", error);
  }

  if (!blog) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <h1 className="text-2xl font-bold">Blog not found</h1>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      <div className="relative h-[400px] md:h-[500px] w-full">
        <img
          src={blog.image || "/placeholder-blog.png"}
          alt={blog.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-background via-background/40 to-transparent" />
        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-4 md:px-6 pb-12">
            <Link href="/blogs" className="inline-flex items-center text-primary font-bold gap-2 mb-6 hover:-translate-x-1 transition-transform">
              <ArrowLeft className="h-5 w-5" /> Back to Stories
            </Link>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight max-w-4xl drop-shadow-sm">
              {blog.title}
            </h1>
            <div className="flex flex-wrap items-center gap-6 mt-8 text-sm font-medium uppercase tracking-widest text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                    <User className="h-5 w-5 text-primary" />
                </div>
                <span>By Administrator</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                <span>{format(new Date(blog.createdAt), "MMMM dd, yyyy")}</span>
              </div>
              <Button variant="outline" size="sm" className="rounded-full gap-2 border-muted/50">
                <Share2 className="h-4 w-4" /> Share Post
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-16">
        <div className="max-w-4xl mx-auto overflow-visible">
          <div 
            className="prose prose-lg dark:prose-invert max-w-none break-words ql-editor rich-text-content
              prose-headings:font-extrabold prose-headings:tracking-tight
              prose-p:leading-relaxed prose-p:text-muted-foreground
              prose-img:rounded-3xl prose-img:shadow-2xl prose-img:mx-auto
              prose-blockquote:border-l-primary prose-blockquote:bg-muted/30 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:rounded-r-xl"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </div>
      </div>
    </div>
  );
}
