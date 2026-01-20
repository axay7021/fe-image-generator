"use client";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import Image from "next/image";
import { Download, ChevronDown, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { upscaleImageAction } from "@/actions/upscale-image";
import { toast } from "react-hot-toast";

interface ResultsPanelProps {
  isLoading: boolean;
  resultUrl: string | null;
  onClose?: () => void;
}

function DownloadDropdown({ resultUrl }: { resultUrl: string }) {
  const [isUpscaling, setIsUpscaling] = useState(false);

  const handleDownload = async (size: number | "original") => {
    if (!resultUrl) return;

    try {
      if (size === "original") {
        const link = document.createElement("a");
        link.download = `gemini-magic-original.png`;
        link.href = resultUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        return;
      }

      setIsUpscaling(true);

      // Fetch current image as blob
      const response = await fetch(resultUrl);
      const blob = await response.blob();
      const file = new File([blob], "image.png", { type: "image/png" });

      const formData = new FormData();
      formData.append("file", file);
      formData.append("target_width", size.toString());

      const data = await upscaleImageAction(formData);

      if (data.success && data.imageUrl) {
        toast.success("Image enhanced and downloaded!");
        const link = document.createElement("a");
        link.download = `gemini-magic-${size}px-enhanced.png`;
        link.href = data.imageUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error("Download failed", error);
      toast.error("Failed to process high-resolution download.");
    } finally {
      setIsUpscaling(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className="flex-1 gap-2"
          variant="default"
          disabled={isUpscaling}
        >
          {isUpscaling ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Download className="h-4 w-4" />
          )}
          {isUpscaling ? "Enhancing..." : "Download"}
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem
          onClick={() => handleDownload("original")}
          className="justify-between"
        >
          <span>Original</span>
          <span className="text-xs text-muted-foreground">Max</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleDownload(1280)}
          className="justify-between"
        >
          <span>HD</span>
          <span className="text-xs text-muted-foreground">1280px</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleDownload(1920)}
          className="justify-between"
        >
          <span>Full HD</span>
          <span className="text-xs text-muted-foreground">1920px</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleDownload(2560)}
          className="justify-between"
        >
          <span>2K</span>
          <span className="text-xs text-muted-foreground">2560px</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleDownload(3840)}
          className="justify-between"
        >
          <span>4K</span>
          <span className="text-xs text-muted-foreground">3840px</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function ResultsPanel({
  isLoading,
  resultUrl,
  onClose,
}: ResultsPanelProps) {
  return (
    <Card className="h-full min-h-[400px] border-border relative overflow-hidden flex flex-col items-center justify-center p-6 bg-muted/20">
      {isLoading ? (
        <div className="w-full h-full flex flex-col items-center justify-center gap-4">
          <Skeleton className="w-full h-[80%] rounded-xl" />
          <div className="w-full flex gap-4">
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
          <p className="text-sm text-muted-foreground animate-pulse">
            Generating magic...
          </p>
        </div>
      ) : resultUrl ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative w-full h-full flex flex-col gap-4"
        >
          <div className="relative flex-1 rounded-xl overflow-hidden border border-border shadow-sm group">
            <Image
              src={resultUrl}
              alt="Generated Result"
              fill
              className="object-cover"
              unoptimized
            />
            {/* Close Button */}
            {onClose && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 h-8 w-8 bg-black/50 hover:bg-black/50 hover:text-white text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={onClose}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <DownloadDropdown resultUrl={resultUrl} />
          </div>
        </motion.div>
      ) : (
        <div className="text-center space-y-2 text-muted-foreground">
          <div className="bg-muted/50 p-6 rounded-full inline-block mb-2">
            <Image
              src="/globe.svg"
              alt="Placeholder"
              width={40}
              height={40}
              className="opacity-20 grayscale"
            />
          </div>
          <p>Your generated image will appear here.</p>
        </div>
      )}
    </Card>
  );
}
