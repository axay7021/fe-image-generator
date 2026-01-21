"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { generateImageAction } from "@/actions/generate-image";
import { Header } from "@/components/layout/Header";
import { PhotoUploadCard } from "@/components/home/PhotoUploadCard";
import {
  TransformationSelector,
  TransformationType,
  PassportMode,
  LINKEDIN_STYLES,
} from "@/components/home/TransformationSelector";
import { TransformationOptionsPanel } from "@/components/home/TransformationOptionsPanel";
import { ResultsPanel } from "@/components/home/ResultsPanel";
import { Button } from "@/components/ui/button";
import { Wand2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { FeatureSection } from "@/components/home/FeatureSection";
import { HowItWorks } from "@/components/home/HowItWorks";
import { FAQSection } from "@/components/home/FAQ";
import { toast } from "react-hot-toast";

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedType, setSelectedType] =
    useState<TransformationType>("passport");
  const [prompts, setPrompts] = useState<Record<string, string>>({});
  const [resultUrl, setResultUrl] = useState<string | null>(null);

  // Helper to get/set current prompt
  const currentPrompt = prompts[selectedType] || "";
  const handlePromptChange = (value: string) => {
    setPrompts((prev) => ({
      ...prev,
      [selectedType]: value,
    }));
  };

  // New States for LinkedIn Feature
  const [selectedStyle, setSelectedStyle] = useState<string>(
    LINKEDIN_STYLES[0].id,
  );

  // Advanced Passport Options State
  const [passportMode, setPassportMode] = useState<PassportMode>("standard");
  const [suitColor, setSuitColor] = useState("Navy Blue");
  const [tieColor, setTieColor] = useState("Red");

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const formData = new FormData();
      if (selectedImage) formData.append("image", selectedImage);

      if (selectedType === "linkedin") {
        formData.append("type", "linkedin-profile"); // Backend implies this or handling logic
        formData.append("action", "linkedin-profile"); // Just to be safe based on request
        formData.append("style", selectedStyle);
      } else {
        formData.append("type", selectedType);
        formData.append("prompt", currentPrompt);

        // Passport Specific Data
        if (selectedType === "passport") {
          formData.append("passport_mode", passportMode);
          if (passportMode === "suit") {
            formData.append("suit_color", suitColor);
            formData.append("tie_color", tieColor);
          }
        }
      }

      return await generateImageAction(formData);
    },
    onSuccess: (data) => {
      setResultUrl(data.imageUrl);
      toast.success("Image generated successfully!");
    },
    onError: (error) => {
      console.log(error);
      toast.error(`Generation failed: ${error.message}`);
    },
  });

  const handleImageSelect = (file: File | null) => {
    setSelectedImage(file);
    if (!file) {
      setResultUrl(null);
    }
  };

  const handleGenerate = () => {
    if (!selectedImage) return;
    mutate();
  };

  const showResults = !!resultUrl || isPending;

  return (
    <div className="min-h-screen overflow-x-hidden relative">
      {/* Hero Background - targeted to top section */}
      <div
        className="absolute top-0 left-0 w-full h-[25%] z-0 pointer-events-none"
        style={{
          backgroundImage: "url('/hero-bg-design.png')",
          backgroundSize: "cover",
          backgroundPosition: "top center",
          backgroundRepeat: "no-repeat",
        }}
      />

      <div className="relative z-10">
        <Header />

        <main className="container px-4 md:px-6 py-5 mx-auto max-w-[1392px]">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
            <h1 className="text-3xl md:text-[40px] font-bold tracking-tight bg-clip-text text-transparent bg-[#538CE8]">
              Free AI Photo Generator
            </h1>
            <p className="text-lg md:text-2xl max-w-2xl">
              Transform your images with natural language AI.
            </p>
          </div>

          <motion.div
            layout
            transition={{ type: "spring", bounce: 0.1, duration: 0.8 }}
            className="mx-auto max-w-6xl transition-all duration-700 ease-in-out mb-12 md:mb-24"
          >
            <div className="backdrop-blur-xl p-4 md:p-8 rounded-2xl shadow-2xl border-2 border-transparent bg-origin-border [background-clip:padding-box,border-box] bg-[linear-gradient(to_right,#F1F6FF,#FFFFFF),linear-gradient(to_right,#E6E6FA,#D6E7FF)] ring-1 ring-black/5">
              <div className="grid gap-8 grid-cols-1 lg:grid-cols-2 transition-all duration-700 ease-in-out">
                {/* Left Column: Controls */}
                <div className="space-y-6 pr-2">
                  <PhotoUploadCard
                    onImageSelect={handleImageSelect}
                    selectedImage={selectedImage}
                  />

                  <TransformationSelector
                    selectedType={selectedType}
                    onSelect={setSelectedType}
                  />

                  {/* Mobile Only: Options Panel */}
                  <div className="block lg:hidden">
                    <TransformationOptionsPanel
                      selectedType={selectedType}
                      prompt={currentPrompt}
                      onPromptChange={handlePromptChange}
                      passportMode={passportMode}
                      onPassportModeChange={setPassportMode}
                      suitColor={suitColor}
                      onSuitColorChange={setSuitColor}
                      tieColor={tieColor}
                      onTieColorChange={setTieColor}
                      selectedStyle={selectedStyle}
                      onStyleSelect={setSelectedStyle}
                    />
                  </div>

                  <Button
                    size="lg"
                    className="w-full text-lg h-14 bg-[#538CE8] hover:bg-[#538CE8]/80 cursor-pointer shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.02]"
                    onClick={handleGenerate}
                    disabled={!selectedImage || isPending}
                  >
                    {isPending ? (
                      <span className="flex items-center gap-2">
                        Generating Magic...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Wand2 className="h-5 w-5" /> Generate Magic
                      </span>
                    )}
                  </Button>
                </div>

                {/* Right Column: Options or Results */}
                <div
                  className={cn(
                    "h-full border-l-0 lg:border-l border-border/50 pl-0 lg:pl-8 lg:min-h-[400px]",
                    !showResults && "hidden lg:block",
                  )}
                >
                  <AnimatePresence mode="wait">
                    {showResults ? (
                      <motion.div
                        key="results"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.5 }}
                        className="h-full"
                      >
                        <ResultsPanel
                          isLoading={isPending}
                          resultUrl={resultUrl}
                          onClose={() => setResultUrl(null)}
                        />
                      </motion.div>
                    ) : (
                      <div className="hidden lg:block">
                        <motion.div
                          key="options"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.3 }}
                        >
                          <TransformationOptionsPanel
                            selectedType={selectedType}
                            prompt={currentPrompt}
                            onPromptChange={handlePromptChange}
                            passportMode={passportMode}
                            onPassportModeChange={setPassportMode}
                            suitColor={suitColor}
                            onSuitColorChange={setSuitColor}
                            tieColor={tieColor}
                            onTieColorChange={setTieColor}
                            selectedStyle={selectedStyle}
                            onStyleSelect={setSelectedStyle}
                          />
                        </motion.div>
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Content Sections */}
          <FeatureSection />
          <HowItWorks />
          <FAQSection />
        </main>
      </div>
    </div>
  );
}
