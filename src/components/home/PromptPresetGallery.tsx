'use client';

import Image from 'next/image';
import { Shuffle, Sparkles } from 'lucide-react';

import type { PromptPreset, PromptPresetTransformation } from '@/lib/prompt-presets';
import { PROMPT_PRESETS } from '@/lib/prompt-presets';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type GalleryTransformation = PromptPresetTransformation | 'linkedin' | null;

interface PromptPresetGalleryProps {
  selectedType: GalleryTransformation;
  onSelect: (preset: PromptPreset) => void;
}

const transformationLabels: Record<PromptPresetTransformation, string> = {
  passport: 'Passport',
  background: 'Background',
  remove: 'Removal',
  prompt: 'Creative edit',
};

export function PromptPresetGallery({ selectedType, onSelect }: PromptPresetGalleryProps) {
  const presets =
    selectedType && selectedType !== 'linkedin'
      ? PROMPT_PRESETS.filter((preset) => preset.transformationType === selectedType)
      : PROMPT_PRESETS;

  const handleSurpriseMe = () => {
    if (!presets.length) return;

    const preset = presets[Math.floor(Math.random() * presets.length)];
    onSelect(preset);
  };

  if (selectedType === 'linkedin') {
    return (
      <div className="rounded-xl border border-dashed border-border bg-muted/20 p-4 text-sm text-muted-foreground">
        LinkedIn Profile already includes curated visual style examples. Select a style in the next step.
      </div>
    );
  }

  return (
    <section aria-labelledby="prompt-presets-heading" className="space-y-3">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[#538CE8]" aria-hidden="true" />
            <h3 id="prompt-presets-heading" className="text-lg font-medium">
              Start from an example
            </h3>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Choose a curated prompt, then personalise it before you generate.
          </p>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={handleSurpriseMe}>
          <Shuffle className="mr-2 h-3.5 w-3.5" aria-hidden="true" />
          Surprise me
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {presets.map((preset) => (
          <button
            key={preset.id}
            type="button"
            onClick={() => onSelect(preset)}
            className={cn(
              'group overflow-hidden rounded-xl border border-border bg-card text-left transition-all',
              'hover:-translate-y-0.5 hover:border-[#538CE8]/60 hover:shadow-md',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#538CE8] focus-visible:ring-offset-2',
            )}
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-muted">
              <Image
                src={preset.exampleImage}
                alt={`Illustrative ${preset.title} example`}
                fill
                sizes="(min-width: 1024px) 180px, 42vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <span className="absolute left-2 top-2 rounded-full bg-black/65 px-2 py-1 text-[10px] font-medium text-white backdrop-blur-sm">
                {transformationLabels[preset.transformationType]}
              </span>
            </div>
            <div className="space-y-1.5 p-3">
              <div className="line-clamp-1 text-sm font-semibold">{preset.title}</div>
              <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                {preset.description}
              </p>
              <span className="inline-flex text-xs font-medium text-[#538CE8]">Use example</span>
            </div>
          </button>
        ))}
      </div>

      <p className="text-xs text-muted-foreground">
        Illustrative examples only — your uploaded image is transformed when you generate.
      </p>
    </section>
  );
}
