import React from "react";
import { blogsAPI } from "@/lib/api";
import { AdminBlogsTable } from "../../../../../components/modules/admin/blogs-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

export default async function AdminBlogsPage() {
  let blogs: any[] = [];
  try {
    const res = await blogsAPI.getAll();
    blogs = res.data;
  } catch (error) {
    console.error("Failed to fetch blogs:", error);
  }

  return (
    <div className="space-y-8 p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-linear-to-r from-primary to-orange-600 bg-clip-text text-transparent">
            Blog Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Create, edit, and manage all blog posts published on the platform.
          </p>
        </div>
        <Link href="/admin-dashboard/blogs/create">
          <Button className="font-bold gap-2 shadow-lg shadow-primary/20 bg-linear-to-r from-primary to-orange-600 border-0 hover:opacity-90">
            <Plus className="h-5 w-5" /> Write New Post
          </Button>
        </Link>
      </div>

      <AdminBlogsTable initialBlogs={blogs} />
    </div>
  );
}
