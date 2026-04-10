import React from "react";
import { BlogForm } from "@/components/modules/admin/blog-form";

export default function CreateBlogPage() {
  return (
    <div className="p-4 md:p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight bg-linear-to-r from-primary to-orange-600 bg-clip-text text-transparent">
          Publish a Story
        </h1>
        <p className="text-muted-foreground mt-2">
          Share your culinary news and insights with the FoodHub community.
        </p>
      </div>
      <BlogForm />
    </div>
  );
}
