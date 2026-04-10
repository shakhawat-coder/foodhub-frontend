import React from "react";
import { BlogForm } from "@/components/modules/admin/blog-form";

export default function ManagerCreateBlogPage() {
  return (
    <div className="p-4 md:p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight bg-linear-to-r from-primary to-orange-600 bg-clip-text text-transparent">
          New Blog Draft
        </h1>
        <p className="text-muted-foreground mt-2">
          Create fresh content for our community of food lovers.
        </p>
      </div>
      <BlogForm />
    </div>
  );
}
