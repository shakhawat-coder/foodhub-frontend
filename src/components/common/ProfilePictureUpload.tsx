"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { uploadAPI } from "@/lib/api";
import { toast } from "sonner";
import { useDropzone } from "react-dropzone";
import { Camera, Loader2, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProfilePictureUploadProps {
  currentImage?: string | null;
  userName?: string;
  size?: "sm" | "md" | "lg";
  onUpdate?: (url: string) => void;
}

export default function ProfilePictureUpload({
  currentImage,
  userName,
  size = "lg",
  onUpdate,
}: ProfilePictureUploadProps) {
  const [preview, setPreview] = useState<string>(currentImage || "");
  const [isUploading, setIsUploading] = useState(false);

  const sizeClasses = {
    sm: "h-16 w-16",
    md: "h-24 w-24",
    lg: "h-32 w-32",
  };

  const iconSizes = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  const onDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    setIsUploading(true);

    try {
      // Upload to Cloudinary via the existing upload endpoint
      const response = await uploadAPI.uploadImage(file);
      const imageUrl = response.data.url;

      // Update the user's image in better-auth
      const { error } = await authClient.updateUser({ image: imageUrl });
      if (error) throw new Error(error.message);

      setPreview(imageUrl);
      onUpdate?.(imageUrl);
      toast.success("Profile picture updated!");
    } catch (error: any) {
      console.error("Failed to update profile picture:", error);
      toast.error(error.message || "Failed to update profile picture");
      setPreview(currentImage || ""); // revert
    } finally {
      setIsUploading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".png", ".jpg", ".jpeg", ".webp"] },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024, // 5MB
    disabled: isUploading,
  });

  const initials = userName
    ? userName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        {...getRootProps()}
        className={cn(
          "relative rounded-full cursor-pointer group ring-4 ring-background shadow-xl overflow-hidden transition-all duration-200",
          sizeClasses[size],
          isDragActive && "ring-primary scale-105",
          isUploading && "cursor-not-allowed opacity-80"
        )}
        title="Click to change profile picture"
      >
        <input {...getInputProps()} />

        {/* Avatar */}
        {preview ? (
          <img
            src={preview}
            alt={userName || "Profile"}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/40">
            {userName ? (
              <span className="text-primary font-bold text-2xl select-none">
                {initials}
              </span>
            ) : (
              <User className={cn(iconSizes[size], "text-primary/60")} />
            )}
          </div>
        )}

        {/* Overlay on hover */}
        <div
          className={cn(
            "absolute inset-0 flex flex-col items-center justify-center bg-black/50 text-white transition-opacity duration-200",
            isUploading ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          )}
        >
          {isUploading ? (
            <Loader2 className="h-6 w-6 animate-spin" />
          ) : (
            <>
              <Camera className="h-5 w-5 mb-0.5" />
              <span className="text-[10px] font-medium">Change</span>
            </>
          )}
        </div>
      </div>

      <p className="text-xs text-muted-foreground text-center">
        {isUploading ? "Uploading..." : "Click photo to change · PNG, JPG up to 5MB"}
      </p>
    </div>
  );
}
