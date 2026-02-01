"use client";

import React, { useState } from "react";
import { uploadAPI } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Loader2, UploadCloud, X } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

interface ImageUploadProps {
    onUploadComplete: (url: string) => void;
    defaultValue?: string;
    label?: string;
}

export default function ImageUpload({
    onUploadComplete,
    defaultValue = "",
    label = "Upload Image",
}: ImageUploadProps) {
    const [preview, setPreview] = useState<string>(defaultValue);
    const [isUploading, setIsUploading] = useState(false);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Local preview
        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);

        setIsUploading(true);
        try {
            const response = await uploadAPI.uploadImage(file);
            toast.success("Image uploaded successfully");
            onUploadComplete(response.url);
            setPreview(response.url);
        } catch (error: any) {
            console.error("Upload error:", error);
            toast.error(error.message || "Failed to upload image");
            setPreview(defaultValue);
        } finally {
            setIsUploading(false);
        }
    };

    const removeImage = () => {
        setPreview("");
        onUploadComplete("");
    };

    return (
        <div className="space-y-4 w-full">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                {label}
            </label>

            <div className="flex items-center gap-4">
                {preview ? (
                    <div className="relative w-32 h-32 rounded-lg overflow-hidden border">
                        <Image
                            src={preview}
                            alt="Preview"
                            fill
                            className="object-cover"
                        />
                        <button
                            onClick={removeImage}
                            className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                            type="button"
                        >
                            <X size={14} />
                        </button>
                        {isUploading && (
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                <Loader2 className="w-6 h-6 text-white animate-spin" />
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="relative w-32 h-32 rounded-lg border-2 border-dashed border-muted-foreground/25 flex flex-col items-center justify-center gap-2 hover:bg-muted/50 transition-colors cursor-pointer group">
                        <UploadCloud className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" />
                        <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                            Choose File
                        </span>
                        <input
                            type="file"
                            accept="image/*"
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            onChange={handleFileChange}
                            disabled={isUploading}
                        />
                    </div>
                )}

                <div className="flex-1 space-y-1">
                    <p className="text-xs text-muted-foreground">
                        Maximum file size 5MB.
                    </p>
                    <p className="text-xs text-muted-foreground">
                        Allowed formats: JPG, PNG, WEBP.
                    </p>
                </div>
            </div>
        </div>
    );
}
