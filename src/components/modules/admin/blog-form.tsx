"use client";

import React, { useState, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { uploadAPI, blogsAPI } from "@/lib/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2, Upload, Image as ImageIcon } from "lucide-react";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

// Dynamic import for ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

interface BlogFormProps {
  initialData?: any;
}

export function BlogForm({ initialData }: BlogFormProps) {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.image || null);

  const { register, handleSubmit, setValue, control, formState: { errors } } = useForm({
    defaultValues: {
      title: initialData?.title || "",
      content: initialData?.content || "",
      image: initialData?.image || "",
    },
  });

  const onImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const res = await uploadAPI.uploadImage(file);
      const url = res.data.url;
      setValue("image", url, { shouldDirty: true });
      setImagePreview(url);
      toast.success("Image uploaded successfully");
    } catch (error) {
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (data: any) => {
    try {
      setIsSubmitting(true);
      if (initialData) {
        await blogsAPI.update(initialData.id, data);
        toast.success("Blog updated successfully");
      } else {
        await blogsAPI.create(data);
        toast.success("Blog created successfully");
      }
      router.refresh();
      router.back();
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const modules = useMemo(() => ({
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "color", "image"],
      ["clean"],
    ],
  }), []);

  return (
    <Card className="max-w-4xl mx-auto shadow-lg border-muted/60">
      <CardHeader className="border-b bg-muted/20">
        <CardTitle className="text-2xl font-bold bg-linear-to-r from-primary to-orange-600 bg-clip-text text-transparent">
          {initialData ? "Edit Blog Post" : "Create New Post"}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="space-y-3">
            <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Blog Title</label>
            <Input
              {...register("title", { required: "Title is required" })}
              placeholder="Give your post a catchy title..."
              className="text-xl py-8 px-5 border-muted/50 focus-visible:ring-primary shadow-sm"
            />
            {errors.title && <p className="text-xs text-red-500 font-bold">{errors.title.message as string}</p>}
          </div>

          <div className="space-y-3">
            <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Featured Image</label>
            <div className="flex flex-col gap-4">
              <div className="relative h-72 w-full rounded-2xl border-2 border-dashed border-muted-foreground/30 bg-muted/10 overflow-hidden flex items-center justify-center group transition-all hover:bg-muted/20 hover:border-primary/50">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                ) : (
                  <div className="flex flex-col items-center gap-3 text-muted-foreground">
                    <div className="p-4 rounded-full bg-background/80 shadow-sm border">
                        <ImageIcon className="h-10 w-10 text-primary/60" />
                    </div>
                    <span className="font-medium">Drag and drop or click to upload</span>
                    <p className="text-xs">Recommended size: 1200x630px</p>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                  <label className="cursor-pointer bg-white text-black px-6 py-2.5 rounded-full font-bold text-sm flex items-center gap-2 shadow-xl hover:bg-primary hover:text-white transition-colors">
                    <Upload className="h-4 w-4" />
                    {imagePreview ? "Change Image" : "Upload Image"}
                    <input type="file" className="hidden" accept="image/*" onChange={onImageUpload} disabled={isUploading} />
                  </label>
                </div>
                {isUploading && (
                  <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center z-10 gap-3">
                    <Loader2 className="h-10 w-10 animate-spin text-white" />
                    <p className="text-white font-bold text-sm">Uploading...</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-3 pb-12">
            <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Post Content</label>
            <div className="quill-editor">
                 <Controller
                    name="content"
                    control={control}
                    rules={{ required: "Content is required" }}
                    render={({ field }) => (
                        <ReactQuill
                            theme="snow"
                            value={field.value}
                            onChange={field.onChange}
                            modules={modules}
                            className="bg-background rounded-xl overflow-hidden border-muted/50"
                        />
                    )}
                />
            </div>
            {errors.content && <p className="text-xs text-red-500 font-bold">{errors.content.message as string}</p>}
          </div>

          <div className="flex justify-end gap-4 pt-6 border-t sticky bottom-0 bg-background/80 backdrop-blur-sm pb-2 z-10">
            <Button type="button" variant="ghost" onClick={() => router.back()} disabled={isSubmitting} className="font-bold">
              Discard
            </Button>
            <Button type="submit" disabled={isSubmitting || isUploading} className="min-w-[180px] h-12 text-base font-bold shadow-lg shadow-primary/20">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Processing...
                </>
              ) : (
                initialData ? "Update Post" : "Publish Post"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
