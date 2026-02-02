'use client';

import axios from 'axios';

import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Download, ChevronDown, Loader2, X, Coins, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { upscaleImageAction } from '@/actions/upscale-image';
import { toast } from 'react-hot-toast';
import { useSubscription } from '@/hooks/use-subscription';
import { cn } from '@/lib/utils';
import { useMutation } from '@tanstack/react-query';

interface ResultsPanelProps {
  isLoading: boolean;
  resultUrl: string | null;
  onClose?: () => void;
}

function DownloadDropdown({ resultUrl }: { resultUrl: string }) {
  const { activePlanId, refreshSubscription } = useSubscription();

  // If activePlanId is present, user has a subscription
  const isSubscribed = !!activePlanId;

  const { mutate: upscaleImage, isPending: isUpscaling } = useMutation({
    mutationFn: async (size: number) => {
      // Fetch current image as blob
      const response = await axios.get(resultUrl, { responseType: 'blob' });
      const blob = response.data;
      const file = new File([blob], 'image.png', { type: 'image/png' });

      const formData = new FormData();
      formData.append('file', file);
      formData.append('target_width', size.toString());

      return await upscaleImageAction(formData);
    },
    onSuccess: async (data, size) => {
      if (data.success && data.imageUrl) {
        await refreshSubscription();
        toast.success('Image enhanced and downloaded!');
        const link = document.createElement('a');
        link.download = `gemini-magic-${size}px-enhanced.png`;
        link.href = data.imageUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        toast.error('Failed to enhance image.');
      }
    },
    onError: (error) => {
      console.error('Download failed', error);
      toast.error('Failed to process high-resolution download.');
    },
  });

  const handleDownload = async (size: number | 'original') => {
    if (!resultUrl) return;

    if (size !== 'original' && !isSubscribed) {
      toast.error('Please upgrade to a plan to download high-resolution images.');
      return;
    }

    if (size === 'original') {
      const link = document.createElement('a');
      link.download = `gemini-magic-original.png`;
      link.href = resultUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }

    // Trigger mutation for upscale
    upscaleImage(size);
  };

  const resolutions = [
    { label: '2K', size: 2560, credits: 2 },
    { label: '4K', size: 3840, credits: 4 },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="flex-1 gap-2" variant="default" disabled={isUpscaling}>
          {isUpscaling ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Download className="h-4 w-4" />
          )}
          {isUpscaling ? 'Enhancing...' : 'Download'}
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuItem onClick={() => handleDownload('original')} className="justify-between">
          <div className="flex flex-col">
            <span className="font-medium">Original</span>
            <span className="text-xs text-muted-foreground">Original quality</span>
          </div>
          <span className="text-xs text-muted-foreground">Free</span>
        </DropdownMenuItem>

        {resolutions.map((res) => (
          <DropdownMenuItem
            key={res.size}
            onClick={() => handleDownload(res.size)}
            className={cn(
              'justify-between cursor-pointer',
              !isSubscribed && 'opacity-50 cursor-not-allowed',
            )}
            disabled={!isSubscribed}
          >
            <div className="flex flex-col">
              <span className="font-medium flex items-center gap-2">
                {res.label}
                {!isSubscribed && <Lock className="h-3 w-3 text-muted-foreground" />}
              </span>
              <span className="text-xs text-muted-foreground">{res.size}px</span>
            </div>
            <div className="flex items-center gap-1 text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
              <Coins className="h-3 w-3" />
              {res.credits} Credit{res.credits > 1 ? 's' : ''}
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function ResultsPanel({ isLoading, resultUrl, onClose }: ResultsPanelProps) {
  return (
    <Card className="h-full min-h-[500px] border-border relative overflow-hidden flex flex-col items-center justify-center p-6 bg-muted/20">
      {isLoading ? (
        <div className="w-full h-full flex flex-col items-center justify-center gap-4">
          <Skeleton className="w-full h-[80%] rounded-xl" />
          <div className="w-full flex gap-4">
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
          <p className="text-sm text-muted-foreground animate-pulse">Generating magic...</p>
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
