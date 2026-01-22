"use client";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  TransformationType,
  PassportMode,
  LINKEDIN_STYLES,
  BACKGROUND_CATEGORIES,
} from "./TransformationSelector";

interface TransformationOptionsPanelProps {
  selectedType: TransformationType;
  prompt: string;
  onPromptChange: (value: string) => void;
  passportMode: PassportMode;
  onPassportModeChange: (mode: PassportMode) => void;
  suitColor: string;
  onSuitColorChange: (color: string) => void;
  tieColor: string;
  onTieColorChange: (color: string) => void;
  selectedStyle?: string;
  onStyleSelect?: (style: string) => void;
  bgCategory?: string;
  onBgCategoryChange?: (category: string) => void;
}

export function TransformationOptionsPanel({
  selectedType,
  prompt,
  onPromptChange,
  passportMode,
  onPassportModeChange,
  suitColor,
  onSuitColorChange,
  tieColor,
  onTieColorChange,
  selectedStyle,
  onStyleSelect,
  bgCategory,
  onBgCategoryChange,
}: TransformationOptionsPanelProps) {
  return (
    <div className="h-full">
      <AnimatePresence mode="wait">
        {selectedType === "passport" && (
          <motion.div
            key="passport"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <h3 className="text-lg font-medium">Passport Details</h3>
            <div className="space-y-4 p-4 bg-muted/30 rounded-xl border border-border">
              <Label>Passport Mode</Label>
              <RadioGroup
                value={passportMode}
                onValueChange={(v) => onPassportModeChange(v as PassportMode)}
                className="flex flex-wrap gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="standard" id="mode-standard" />
                  <Label
                    htmlFor="mode-standard"
                    className="text-sm font-normal cursor-pointer"
                  >
                    Standard
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="suit" id="mode-suit" />
                  <Label
                    htmlFor="mode-suit"
                    className="text-sm font-normal cursor-pointer"
                  >
                    Pro Suit
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="custom" id="mode-custom" />
                  <Label
                    htmlFor="mode-custom"
                    className="text-sm font-normal cursor-pointer"
                  >
                    Custom
                  </Label>
                </div>
              </RadioGroup>

              {passportMode === "suit" && (
                <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">
                      Suit Color
                    </Label>
                    <select
                      className="w-full text-sm rounded-lg border border-input bg-background px-3 py-2"
                      value={suitColor}
                      onChange={(e) => onSuitColorChange(e.target.value)}
                    >
                      <option value="Navy Blue">Navy Blue</option>
                      <option value="Black">Black</option>
                      <option value="Dark Grey">Dark Grey</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">
                      Tie Color
                    </Label>
                    <select
                      className="w-full text-sm rounded-lg border border-input bg-background px-3 py-2"
                      value={tieColor}
                      onChange={(e) => onTieColorChange(e.target.value)}
                    >
                      <option value="Red">Red</option>
                      <option value="Blue">Blue</option>
                      <option value="Black">Black</option>
                      <option value="Striped">Striped</option>
                    </select>
                  </div>
                </div>
              )}

              {passportMode === "custom" && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                  <Label htmlFor="passport-custom-prompt">
                    Custom Instructions
                  </Label>
                  <Textarea
                    id="passport-custom-prompt"
                    placeholder="e.g. wearing a tuxedo"
                    className="resize-none h-24"
                    value={prompt}
                    onChange={(e) =>
                      onPromptChange(e.target.value.slice(0, 500))
                    }
                  />
                  <div className="text-right text-xs text-muted-foreground">
                    {prompt.length}/500
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {selectedType === "linkedin" && (
          <motion.div
            key="linkedin"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <h3 className="text-lg font-medium">Select Professional Style</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3">
              {LINKEDIN_STYLES.map((style) => (
                <div
                  key={style.id}
                  className={cn(
                    "group relative aspect-square rounded-xl overflow-hidden cursor-pointer border-2 transition-all duration-200",
                    selectedStyle === style.id
                      ? "border-[#538CE8] ring-2 ring-[#538CE8]/20"
                      : "border-transparent hover:border-gray-200",
                  )}
                  onClick={() => onStyleSelect?.(style.id)}
                >
                  <Image
                    src={style.img}
                    alt={style.label}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-2 left-2 right-2 text-white text-xs md:text-sm font-medium z-10 leading-tight">
                    {style.label}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {selectedType === "prompt" && (
          <motion.div
            key="prompt"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <h3 className="text-lg font-medium">Custom Edit</h3>
            <div className="space-y-2">
              <Label htmlFor="prompt-input">Enter Prompt</Label>
              <Textarea
                id="prompt-input"
                placeholder="Describe your desired image..."
                className="resize-none h-32 focus-visible:ring-0 focus-visible:ring-offset-0"
                value={prompt}
                onChange={(e) => onPromptChange(e.target.value.slice(0, 500))}
              />
              <div className="text-right text-xs text-muted-foreground">
                {prompt.length}/500
              </div>
            </div>
          </motion.div>
        )}

        {(selectedType === "background" || selectedType === "remove") && (
          <motion.div
            key="context"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <h3 className="text-lg font-medium">
              {selectedType === "background"
                ? "Background Settings"
                : "Removal Settings"}
            </h3>

            {selectedType === "background" ? (
              <div className="space-y-4">
                <Label>Select Background Style</Label>
                <div className="grid grid-cols-4 gap-2">
                  {BACKGROUND_CATEGORIES.map((cat) => (
                    <div
                      key={cat.id}
                      className={cn(
                        "group relative aspect-square rounded-lg cursor-pointer border overflow-hidden transition-all",
                        bgCategory === cat.id
                          ? "border-primary ring-2 ring-primary/20"
                          : "border-border hover:border-gray-300",
                      )}
                      onClick={() => onBgCategoryChange?.(cat.id)}
                      title={cat.label}
                    >
                      <div
                        className="w-full h-full"
                        style={{ background: cat.color }}
                      />
                      {cat.id === "custom" && (
                        <div className="absolute inset-0 flex items-center justify-center p-1">
                          <span className="text-[10px] sm:text-base font-medium text-white drop-shadow-md leading-tight text-center">
                            Custom
                          </span>
                        </div>
                      )}
                      {bgCategory === cat.id && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                          <div className="w-2 h-2 bg-white rounded-full shadow-sm" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                {bgCategory === "custom" && (
                  <div className="space-y-2 animate-in fade-in slide-in-from-top-1">
                    <Label htmlFor="bg-prompt">
                      Custom Background Description
                    </Label>
                    <Textarea
                      id="bg-prompt"
                      placeholder="e.g. a futuristic cyberpunk city street"
                      className="resize-none h-24"
                      value={prompt}
                      onChange={(e) => onPromptChange(e.target.value)}
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="remove-input">Object to Remove</Label>
                <Textarea
                  id="remove-input"
                  placeholder="e.g. the red car"
                  className="resize-none h-24 focus-visible:ring-0 focus-visible:ring-offset-0"
                  value={prompt}
                  onChange={(e) => onPromptChange(e.target.value.slice(0, 500))}
                />
                <div className="text-right text-xs text-muted-foreground">
                  {prompt.length}/500
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
