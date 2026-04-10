import React from "react";
import { BlogForm } from "@/components/modules/admin/blog-form";
import { blogsAPI } from "@/lib/api";

export default async function ManagerEditBlogPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let blog: any = null;

  try {
    const res = await blogsAPI.getById(id);
    blog = res.data;
  } catch (error) {
    console.error("Failed to fetch blog for editing:", error);
  }

  if (!blog) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">Blog post not found.</h1>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight bg-linear-to-r from-primary to-orange-600 bg-clip-text text-transparent">
          Edit Manager Post
        </h1>
        <p className="text-muted-foreground mt-2">
          Revise your contribution to ensure the highest quality for our readers.
        </p>
      </div>
      <BlogForm initialData={blog} />
    </div>
  );
}
