'use client';

import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import Image from 'next/image';

export type TransformationType = 'passport' | 'linkedin' | 'background' | 'remove' | 'prompt';

export type PassportMode = 'standard' | 'suit' | 'custom';

export const LINKEDIN_STYLES = [
  {
    id: 'classic_corporate',
    label: 'Classic Corporate',
    img: '/linkedin/1.png',
    isPremium: false,
  },
  {
    id: 'casual_professional',
    label: 'Casual Professional',
    img: '/linkedin/2.png',
    isPremium: true,
  },
  {
    id: 'creative',
    label: 'Creative Brand',
    img: '/linkedin/3.png',
    isPremium: true,
  },
  {
    id: 'founder_leader',
    label: 'Founder / Leader',
    img: '/linkedin/4.png',
    isPremium: true,
  },
  {
    id: 'friendly_approachable',
    label: 'Friendly',
    img: '/linkedin/5.png',
    isPremium: true,
  },
  {
    id: 'monochrome_bw',
    label: 'Monochrome',
    img: '/linkedin/6.png',
    isPremium: true,
  },
  {
    id: 'studio_look',
    label: 'High-End Studio Look',
    img: '/linkedin/7.png',
    isPremium: true,
  },
  {
    id: 'outdoor_natural',
    label: 'Outdoor / Nature',
    img: '/linkedin/8.png',
    isPremium: true,
  },
  {
    id: 'tech_modern',
    label: 'Tech / Modern',
    img: '/linkedin/9.png',
    isPremium: true,
  },
];

export const BACKGROUND_CATEGORIES = [
  { id: 'white', label: 'White', color: '#FFFFFF', isPremium: false },
  { id: 'black', label: 'Black', color: '#000000', isPremium: false },
  { id: 'grey', label: 'Grey', color: '#808080', isPremium: true },
  { id: 'warm_grey', label: 'Warm Grey', color: '#A9A9A9', isPremium: true },
  { id: 'cool_grey', label: 'Cool Grey', color: '#708090', isPremium: true },
  { id: 'blue', label: 'Blue', color: '#2d4d74', isPremium: true },
  {
    id: 'gradient_blue',
    label: 'Gradient Blue',
    color: 'linear-gradient(to right, #00c6ff, #0072ff)',
    isPremium: true,
  },
  {
    id: 'gradient_grey',
    label: 'Gradient Grey',
    color: 'linear-gradient(to right, #bdc3c7, #2c3e50)',
    isPremium: true,
  },
  // { id: "office", label: "Office", color: "#F5F5DC" }, // Placeholder color
  { id: 'plain', label: 'Plain', color: '#E0E0E0', isPremium: true },
  { id: 'studio', label: 'Studio', color: '#333333', isPremium: true },
  {
    id: 'custom',
    label: 'Custom',
    color: 'linear-gradient(45deg, #ff9a9e 0%, #fad0c4 99%, #fad0c4 100%)',
    isPremium: true,
  },
];

interface TransformationSelectorProps {
  selectedType: TransformationType | null;
  onSelect: (type: TransformationType) => void;
}

const options: {
  id: TransformationType;
  title: string;
  desc: string;
  img: string;
}[] = [
  {
    id: 'passport',
    title: 'Passport Photo',
    desc: 'Professional ID Format',
    img: '/hero-1.jpg',
  },
  {
    id: 'linkedin',
    title: 'LinkedIn Profile',
    desc: 'Professional Headshots',
    img: '/hero5.jpg',
  },
  {
    id: 'background',
    title: 'Change Background',
    desc: 'Replace background',
    img: '/hero-2.jpg',
  },
  {
    id: 'remove',
    title: 'Remove Object',
    desc: 'Clean unwanted items',
    img: '/hero-3.jpg',
  },
  {
    id: 'prompt',
    title: 'Full Prompt Edit',
    desc: 'Complete customization',
    img: '/hero4.jpg',
  },
];

export function TransformationSelector({ selectedType, onSelect }: TransformationSelectorProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Select Transformation</h3>
        <RadioGroup
          value={selectedType || ''}
          onValueChange={(v) => onSelect(v as TransformationType)}
          className="grid grid-cols-2 gap-4"
        >
          {options.map((option) => {
            const isSelected = selectedType === option.id;
            return (
              <div key={option.id}>
                <RadioGroupItem value={option.id} id={option.id} className="peer sr-only" />
                <Label
                  htmlFor={option.id}
                  onClick={() => onSelect(option.id)}
                  className={cn(
                    ' flex flex-col md:flex-row items-center justify-center md:justify-start gap-2 md:gap-4 p-3 rounded-xl border-2 transition-all cursor-pointer hover:bg-accent/50 text-center md:text-left aspect-square md:aspect-auto',
                    isSelected
                      ? 'border-primary bg-primary/5 ring-1 ring-primary/20'
                      : 'border-border bg-card',
                  )}
                >
                  <div className="relative w-16 h-16 md:w-12 md:h-12 aspect-square rounded-lg overflow-hidden shrink-0 bg-muted">
                    <Image src={option.img} alt={option.title} fill className="object-cover" />
                  </div>
                  <div className="space-y-1">
                    <div className="font-semibold leading-none">{option.title}</div>
                    <div className="hidden md:block text-xs text-muted-foreground">
                      {option.desc}
                    </div>
                  </div>
                </Label>
              </div>
            );
          })}
        </RadioGroup>
      </div>
    </div>
  );
}
