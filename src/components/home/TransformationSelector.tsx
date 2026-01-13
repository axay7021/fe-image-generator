"use client";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import Image from "next/image";

export type TransformationType =
  | "passport"
  | "linkedin"
  | "background"
  | "remove"
  | "prompt";

export type PassportMode = "standard" | "suit" | "custom";

export const LINKEDIN_STYLES = [
  {
    id: "classic_corporate",
    label: "Classic Corporate",
    img: "/linkedin/1.png",
  },
  {
    id: "casual_professional",
    label: "Casual Professional",
    img: "/linkedin/2.png",
  },
  { id: "creative", label: "Creative Brand", img: "/linkedin/3.png" },
  { id: "founder_leader", label: "Founder / Leader", img: "/linkedin/4.png" },
  { id: "friendly_approachable", label: "Friendly", img: "/linkedin/5.png" },
  { id: "monochrome_bw", label: "Monochrome", img: "/linkedin/6.png" },
  {
    id: "studio_look",
    label: "High-End Studio Look",
    img: "/linkedin/7.png",
  },
  { id: "outdoor_natural", label: "Outdoor / Nature", img: "/linkedin/8.png" },
  { id: "tech_modern", label: "Tech / Modern", img: "/linkedin/9.png" },
];

interface TransformationSelectorProps {
  selectedType: TransformationType;
  onSelect: (type: TransformationType) => void;
}

const options: {
  id: TransformationType;
  title: string;
  desc: string;
  img: string;
}[] = [
  {
    id: "passport",
    title: "Passport Photo",
    desc: "Professional ID Format",
    img: "/hero1.jpg",
  },
  {
    id: "linkedin",
    title: "LinkedIn Profile",
    desc: "Professional Headshots",
    img: "/hero5.jpg",
  },
  {
    id: "background",
    title: "Change Background",
    desc: "Replace background",
    img: "/hero2.jpg",
  },
  {
    id: "remove",
    title: "Remove Object",
    desc: "Clean unwanted items",
    img: "/hero3.jpg",
  },
  {
    id: "prompt",
    title: "Full Prompt Edit",
    desc: "Complete customization",
    img: "/hero4.jpg",
  },
];

export function TransformationSelector({
  selectedType,
  onSelect,
}: TransformationSelectorProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Select Transformation</h3>
        <RadioGroup
          defaultValue={selectedType}
          onValueChange={(v) => onSelect(v as TransformationType)}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {options.map((option) => {
            const isSelected = selectedType === option.id;
            return (
              <div key={option.id}>
                <RadioGroupItem
                  value={option.id}
                  id={option.id}
                  className="peer sr-only"
                />
                <Label
                  htmlFor={option.id}
                  className={cn(
                    "flex items-center gap-4 p-3 rounded-xl border-2 transition-all cursor-pointer hover:bg-accent/50",
                    isSelected
                      ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                      : "border-border bg-card"
                  )}
                >
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-muted">
                    <Image
                      src={option.img}
                      alt={option.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="font-semibold leading-none">
                      {option.title}
                    </div>
                    <div className="text-xs text-muted-foreground">
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
