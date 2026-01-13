"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { UploadCloud, X } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

interface PhotoUploadCardProps {
  onImageSelect: (file: File | null) => void;
  selectedImage: File | null;
}

export function PhotoUploadCard({
  onImageSelect,
  selectedImage,
}: PhotoUploadCardProps) {
  const [preview, setPreview] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles && acceptedFiles.length > 0) {
        const file = acceptedFiles[0];

        // Check for HEIC/HEIF
        if (
          file.name.toLowerCase().endsWith(".heic") ||
          file.type === "image/heic" ||
          file.type === "image/heif"
        ) {
          toast.error(
            "HEIC format is not supported. Please use PNG, JPG, or WebP."
          );
          return;
        }

        onImageSelect(file);
        setPreview(URL.createObjectURL(file));
      }
    },
    [onImageSelect]
  );

  const clearImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    onImageSelect(null);
    setPreview(null);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDropRejected: (fileRejections) => {
      const error = fileRejections[0]?.errors[0];
      if (error) {
        // Custom message for file type errors
        if (error.code === "file-invalid-type") {
          toast.error("File type not supported. Please use PNG, JPG, or WebP.");
        } else {
          toast.error(`Upload failed: ${error.message}`);
        }
      }
    },
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".webp"],
    },
    maxFiles: 1,
    disabled: !!selectedImage,
  });

  return (
    <Card
      className={cn(
        "border-2 border-dashed transition-all duration-300 relative overflow-hidden group",
        isDragActive
          ? "border-primary bg-primary/5"
          : "border-muted-foreground/25",
        selectedImage
          ? "border-solid border-border p-0"
          : "hover:border-primary/50"
      )}
    >
      <CardContent className="p-0">
        <div
          {...getRootProps()}
          className={cn(
            "flex flex-col items-center justify-center min-h-[220px] cursor-pointer p-4 text-center transition-colors",
            selectedImage ? "cursor-default" : ""
          )}
        >
          <input {...getInputProps()} />

          {selectedImage && preview ? (
            <div className="relative w-full h-[220px] flex items-center justify-center">
              <Image
                src={preview}
                alt="Preview"
                fill
                className="object-contain"
              />
              <div className="absolute top-2 right-2">
                <button
                  onClick={clearImage}
                  className="rounded-full bg-background/80 p-1 hover:bg-destructive hover:text-white transition-colors shadow-sm ring-1 ring-border"
                  type="button"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <div className="rounded-full bg-primary/10 p-4 ring-1 ring-primary/20 group-hover:scale-110 transition-transform duration-300">
                <UploadCloud className="h-8 w-8 text-primary" />
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold text-lg">
                  Drop image here or click to browse
                </h3>
                <p className="text-sm text-muted-foreground">
                  PNG, JPG, WebP up to 10MB
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
