"use client";

import React, { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { blogsAPI } from "@/lib/api";
import { format } from "date-fns";
import { SquarePen, Trash2, Search, Eye, FileText, Calendar, Layout } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface BlogsTableProps {
  initialBlogs: any[];
  role?: "admin" | "manager";
}

export function AdminBlogsTable({ initialBlogs, role = "admin" }: BlogsTableProps) {
  const [blogs, setBlogs] = useState(initialBlogs);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const dashboardPath = role === "admin" ? "admin-dashboard" : "manager-dashboard";

  const filteredBlogs = useMemo(() => {
    return blogs.filter((blog: any) =>
      blog.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [blogs, searchTerm]);

  const stats = useMemo(() => ({
    total: blogs.length,
    thisMonth: blogs.filter(b => {
        const date = new Date(b.createdAt);
        const now = new Date();
        return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    }).length
  }), [blogs]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog?")) return;

    try {
      await blogsAPI.delete(id);
      setBlogs(blogs.filter((b) => b.id !== id));
      toast.success("Blog deleted successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete blog");
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-sm border-muted/60 transition-all hover:shadow-md">
           <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 text-muted-foreground uppercase tracking-tight text-[10px] font-bold">
              <span>Total Posts</span>
              <FileText className="h-4 w-4 text-primary" />
           </CardHeader>
           <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
           </CardContent>
        </Card>
        <Card className="shadow-sm border-muted/60 transition-all hover:shadow-md">
           <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 text-muted-foreground uppercase tracking-tight text-[10px] font-bold">
              <span>Published This Month</span>
              <Calendar className="h-4 w-4 text-green-600" />
           </CardHeader>
           <CardContent>
              <div className="text-2xl font-bold">{stats.thisMonth}</div>
           </CardContent>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between bg-muted/20 p-4 rounded-xl border border-muted/40 shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by title..."
            className="pl-10 bg-background border-muted/60"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-2xl border border-muted/40 bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-[100px]">Thumbnail</TableHead>
              <TableHead>Blog Title</TableHead>
              <TableHead>Date Published</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBlogs.length > 0 ? (
              filteredBlogs.map((blog) => (
                <TableRow key={blog.id} className="hover:bg-muted/30 transition-colors">
                  <TableCell>
                    <div className="relative h-14 w-20 overflow-hidden rounded-lg border bg-muted shadow-sm">
                      <img
                        src={blog.image || "/placeholder-blog.png"}
                        alt={blog.title}
                        className="object-cover h-full w-full"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="font-bold">
                    <div className="max-w-[400px] truncate" title={blog.title}>
                      {blog.title}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {format(new Date(blog.createdAt), "MMM dd, yyyy")}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                       <Link href={`/blogs/${blog.id}`} target="_blank">
                        <Button variant="ghost" size="icon" title="View Public Page" className="hover:text-blue-600">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link href={`/${dashboardPath}/blogs/edit/${blog.id}`}>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="hover:text-primary"
                          title="Edit Blog"
                        >
                          <SquarePen className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="hover:text-red-600"
                        onClick={() => handleDelete(blog.id)}
                        title="Delete Blog"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-32 text-center text-muted-foreground italic">
                  No blog posts found matching your search.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
