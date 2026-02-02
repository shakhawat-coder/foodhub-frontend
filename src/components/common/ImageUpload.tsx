"use client";

import React, { useState } from "react";
import { uploadAPI } from "@/lib/api";
import { Loader2, UploadCloud, X } from "lucide-react";
import { toast } from "sonner";
import { useDropzone } from "react-dropzone";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
    onUploadComplete: (url: string) => void;
    defaultValue?: string;
    label?: string;
    className?: string;
}

export default function ImageUpload({
    onUploadComplete,
    defaultValue = "",
    label = "Upload Image",
    className,
}: ImageUploadProps) {
    const [preview, setPreview] = useState<string>(defaultValue);
    const [isUploading, setIsUploading] = useState(false);

    const onDrop = async (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (!file) return;

        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);
        setIsUploading(true);

        try {
            const response = await uploadAPI.uploadImage(file);
            toast.success("Image uploaded successfully");
            onUploadComplete(response.data.url);
            // Update preview to the remote URL to be sure
            setPreview(response.data.url);
        } catch (error: any) {
            console.error("Upload error:", error);
            toast.error(error.message || "Failed to upload image");
            setPreview(defaultValue); // Revert
        } finally {
            setIsUploading(false);
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            "image/*": [".png", ".jpg", ".jpeg", ".webp"],
        },
        maxFiles: 1,
        disabled: isUploading,
    });

    const removeImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setPreview("");
        onUploadComplete("");
    };

    return (
        <div className={cn("space-y-4 w-full", className)}>
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                {label}
            </label>

            <div
                {...getRootProps()}
                className={cn(
                    "relative w-full mt-3 min-h-[200px] rounded-lg border-2 border-dashed border-muted-foreground/25 flex flex-col items-center justify-center gap-2 transition-colors cursor-pointer group",
                    isDragActive && "border-primary bg-primary/5",
                    preview ? "border-none" : "hover:bg-muted/50"
                )}
            >
                <input {...getInputProps()} />

                {preview ? (
                    <div className="relative w-full h-full min-h-[200px] overflow-hidden rounded-lg border">
                        <img
                            src={preview}
                            alt="Preview"
                            className="object-cover w-full h-full max-h-[300px]"
                        />
                        <button
                            onClick={removeImage}
                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors z-10"
                            type="button"
                        >
                            <X size={16} />
                        </button>
                        {isUploading && (
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-20">
                                <Loader2 className="w-8 h-8 text-white animate-spin" />
                            </div>
                        )}
                    </div>
                ) : (
                    <>
                        <div className="p-4 bg-muted rounded-full">
                            {isUploading ? (
                                <Loader2 className="w-8 h-8 text-muted-foreground animate-spin" />
                            ) : (
                                <UploadCloud className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" />
                            )}
                        </div>
                        <div className="text-center">
                            <span className="text-sm font-medium text-foreground">
                                {isDragActive ? "Drop the image here" : "Click to upload"}
                            </span>
                            <span className="text-xs text-muted-foreground block mt-1">
                                or drag and drop
                            </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                            SVG, PNG, JPG or WEBP (max. 5MB)
                        </p>
                    </>
                )}
            </div>
        </div>
    );
}
