import React from "react";
import { blogsAPI } from "@/lib/api";
import BlogCard from "@/components/common/BlogCard";

export default async function BlogsPage() {
  let blogs: any[] = [];
  try {
    const res = await blogsAPI.getAll();
    blogs = res.data;
  } catch (error) {
    console.error("Failed to fetch blogs:", error);
  }

  return (
    <div className="container mx-auto pt-20 md:pt-32 pb-20 px-4 md:px-6">
      <div className="max-w-3xl mx-auto text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
          Latest Stories & Culinary Insights
        </h1>
        <p className="text-muted-foreground text-lg leading-relaxed">
          Discover kitchen secrets, foodie tips, and the latest updates from the heart of our culinary community.
        </p>
      </div>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {blogs.map((blog: any) => (
          <BlogCard key={blog.id} blog={blog} />
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
