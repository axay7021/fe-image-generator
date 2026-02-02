'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '@clerk/nextjs';
import { generateImageAction } from '@/actions/generate-image';
import { Header } from '@/components/layout/Header';
import { PhotoUploadCard } from '@/components/home/PhotoUploadCard';
import {
  TransformationSelector,
  TransformationType,
  PassportMode,
  LINKEDIN_STYLES,
  BACKGROUND_CATEGORIES,
} from '@/components/home/TransformationSelector';
import { TransformationOptionsPanel } from '@/components/home/TransformationOptionsPanel';
import { ResultsPanel } from '@/components/home/ResultsPanel';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Wand2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FeatureSection } from '@/components/home/FeatureSection';
import { HowItWorks } from '@/components/home/HowItWorks';
import { FAQSection } from '@/components/home/FAQ';
import { toast } from 'react-hot-toast';
import { useSubscription } from '@/hooks/use-subscription';
import { usePersistentGenerationState } from '@/hooks/use-persistent-state';

export default function Home() {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedType, setSelectedType] = useState<TransformationType | null>(null);
  const [prompts, setPrompts] = useState<Record<string, string>>({});
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [step, setStep] = useState(1);

  // Persistent State Hook
  const { saveState, loadState, clearState } = usePersistentGenerationState();

  // New States for LinkedIn Feature
  const [selectedStyle, setSelectedStyle] = useState<string>(LINKEDIN_STYLES[0].id);

  // Advanced Passport Options State
  const [passportMode, setPassportMode] = useState<PassportMode>('standard');
  const [suitColor, setSuitColor] = useState('Navy Blue');
  const [tieColor, setTieColor] = useState('Red');
  const [bgCategory, setBgCategory] = useState<string>(BACKGROUND_CATEGORIES[0].id);

  // Load state on mount if user is just logging in
  const { isSignedIn, isLoaded: isAuthLoaded } = useUser();

  useEffect(() => {
    const restoreSession = async () => {
      if (!isAuthLoaded) return;
      const savedState = await loadState();
      if (savedState) {
        if (savedState.image) setSelectedImage(savedState.image);
        if (savedState.selectedType) setSelectedType(savedState.selectedType);
        if (savedState.prompts) setPrompts(savedState.prompts);
        if (savedState.step) setStep(savedState.step);
        if (savedState.selectedStyle) setSelectedStyle(savedState.selectedStyle);
        if (savedState.passportMode) setPassportMode(savedState.passportMode);
        if (savedState.suitColor) setSuitColor(savedState.suitColor);
        if (savedState.tieColor) setTieColor(savedState.tieColor);
        if (savedState.bgCategory) setBgCategory(savedState.bgCategory);

        // Only show toast if we actually restored something and user is signed in (likely returned from login)
        if (isSignedIn) {
          // toast.success("Restored your previous session");
          // Clear it so it doesn't persist forever
          await clearState();
        }
      }
    };
    restoreSession();
  }, [isAuthLoaded, isSignedIn, loadState, clearState]);

  // Default to Passport on Desktop (lg breakpoint)
  useEffect(() => {
    if (window.innerWidth >= 1024) {
      setTimeout(() => setSelectedType('passport'), 0);
    }
  }, []);

  // Helper to get/set current prompt
  const currentPrompt = selectedType ? prompts[selectedType] || '' : '';
  const handlePromptChange = (value: string) => {
    if (!selectedType) return;
    setPrompts((prev) => ({
      ...prev,
      [selectedType]: value,
    }));
  };

  // const { isSignedIn } = useUser(); // Removed duplicate declaration

  const { refreshSubscription } = useSubscription();

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const formData = new FormData();
      if (selectedImage) formData.append('image', selectedImage);

      if (!selectedType) throw new Error('Please select a transformation type');

      if (selectedType === 'linkedin') {
        formData.append('type', 'linkedin-profile'); // Backend implies this or handling logic
        formData.append('action', 'linkedin-profile'); // Just to be safe based on request
        formData.append('style', selectedStyle);
      } else if (selectedType === 'background') {
        formData.append('type', 'background');
        formData.append('category', bgCategory);
        if (bgCategory === 'custom') {
          formData.append('prompt', currentPrompt);
        }
      } else {
        formData.append('type', selectedType);
        formData.append('prompt', currentPrompt);

        // Passport Specific Data
        if (selectedType === 'passport') {
          formData.append('passport_mode', passportMode);
          if (passportMode === 'suit') {
            formData.append('suit_color', suitColor);
            formData.append('tie_color', tieColor);
          }
        }
      }

      return await generateImageAction(formData);
    },
    onSuccess: async (data) => {
      if (!data.success) {
        if (data.error?.includes('Daily limit reached')) {
          if (!isSignedIn) {
            // SAVE STATE BEFORE REDIRECT
            await saveState({
              selectedType,
              prompts,
              step,
              selectedStyle,
              passportMode,
              suitColor,
              tieColor,
              bgCategory,
              image: selectedImage,
              timestamp: Date.now(),
            });

            router.push('/login');
            toast.error('Please login to generate more images');
          } else {
            toast.error(
              'Your plan quota is full. Please upgrade your plan to generate more images',
            );
          }
          return;
        }
        toast.error(`Generation failed: ${data.error}`);
        return;
      }

      await refreshSubscription();
      setResultUrl(data.imageUrl!);
      setResultUrl(data.imageUrl!);
      toast.success('Image generated successfully!');
      // Clear state on success to avoid stale restoration later
      await clearState();
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
    if (!selectedImage || !selectedType) return;
    mutate();
  };

  const showResults = !!resultUrl || isPending;

  // Scroll to results on mobile when generation starts
  useEffect(() => {
    if (showResults && window.innerWidth < 1024) {
      setTimeout(() => {
        const resultsElement = document.getElementById('results-section');
        if (resultsElement) {
          resultsElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, [showResults]);

  return (
    <div className="min-h-screen overflow-x-hidden relative">
      {/* Hero Background - targeted to top section */}
      <div
        className="absolute top-0 left-0 w-full h-[25%] z-0 pointer-events-none"
        style={{
          backgroundImage: "url('/hero-bg-design.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'top center',
          backgroundRepeat: 'no-repeat',
        }}
      />

      <div className="relative z-10">
        <Header />

        <main>
          <section className="px-4 md:px-6 md:py-5 mx-auto mt-20 container max-w-[1392px]">
            <div className="flex flex-col items-center justify-center space-y-2 text-center mb-6">
              <h1 className="text-2xl md:text-[40px] font-bold tracking-tight bg-clip-text text-transparent bg-[#538CE8]">
                Free AI Photo Generator
              </h1>
              <p className="text-lg md:text-2xl max-w-2xl">
                Transform your images with natural language AI.
              </p>
            </div>

            <motion.div
              layout
              transition={{ type: 'spring', bounce: 0.1, duration: 0.8 }}
              className="mx-auto max-w-6xl transition-all duration-700 ease-in-out mb-12 md:mb-24"
            >
              <div className="backdrop-blur-xl p-4 md:p-8 rounded-2xl shadow-2xl border-2 border-transparent bg-origin-border [background-clip:padding-box,border-box] bg-[linear-gradient(to_right,#F1F6FF,#FFFFFF),linear-gradient(to_right,#E6E6FA,#D6E7FF)] ring-1 ring-black/5">
                {/* Stepper Header (Mobile Only) */}
                <div
                  className={cn(
                    'flex items-center mb-6 lg:hidden relative',
                    step === 1 ? 'justify-center' : 'justify-between',
                  )}
                >
                  {/* Back Button (Left - Only visible step > 1) */}
                  {step > 1 && (
                    <Button
                      variant="ghost"
                      size="default"
                      onClick={() => setStep((s) => Math.max(1, s - 1))}
                      className="flex items-center gap-2 p-1 font-medium active:scale-95 transition-all"
                    >
                      <ArrowLeft className="h-5! w-5!" /> Back
                    </Button>
                  )}

                  {/* Stepper Indicators */}
                  <div
                    className={cn(
                      'flex items-center gap-2 transition-all duration-300',
                      step === 1 ? 'flex-1 justify-center' : '',
                    )}
                  >
                    <div
                      className={cn(
                        'w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300',
                        step >= 1
                          ? 'bg-[#538CE8] text-white shadow-md shadow-blue-500/20'
                          : 'bg-gray-100 text-gray-400',
                      )}
                    >
                      1
                    </div>
                    <div
                      className={cn(
                        'w-6 h-0.5 transition-colors duration-300',
                        step >= 2 ? 'bg-[#538CE8]' : 'bg-gray-200',
                      )}
                    />
                    <div
                      className={cn(
                        'w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300',
                        step >= 2
                          ? 'bg-[#538CE8] text-white shadow-md shadow-blue-500/20'
                          : 'bg-gray-100 text-gray-400',
                      )}
                    >
                      2
                    </div>
                    <div
                      className={cn(
                        'w-6 h-0.5 transition-colors duration-300',
                        step >= 3 ? 'bg-[#538CE8]' : 'bg-gray-200',
                      )}
                    />
                    <div
                      className={cn(
                        'w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300',
                        step >= 3
                          ? 'bg-[#538CE8] text-white shadow-md shadow-blue-500/20'
                          : 'bg-gray-100 text-gray-400',
                      )}
                    >
                      3
                    </div>
                  </div>
                </div>

                <div className="grid gap-8 grid-cols-1 lg:grid-cols-2 relative">
                  {/* Left Column: Mobile Steps / Desktop Controls */}
                  <div className="space-y-6 pr-2">
                    {/* MOBILE & DESKTOP LOGIC DIVERGENCE */}
                    {/* To handle animations cleanly on mobile without messing up desktop layout, 
                      we conditionally render separate structures or use specific display logic. 
                      Since user wants smooth animations, AnimatePresence is best.
                      But Desktop has no animations/steps.
                  */}

                    {/* DESKTOP VIEW (Always visible controls) */}
                    <div className="hidden lg:block space-y-6">
                      <PhotoUploadCard
                        onImageSelect={(file) => {
                          handleImageSelect(file);
                          if (file) setStep(2);
                        }}
                        selectedImage={selectedImage}
                      />
                      <TransformationSelector
                        selectedType={selectedType}
                        onSelect={(type) => {
                          setSelectedType(type);
                          setStep(3);
                        }}
                      />
                      <Button
                        size="lg"
                        className="w-full text-lg h-14 bg-[#538CE8] hover:bg-[#538CE8]/80 cursor-pointer shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.02]"
                        onClick={handleGenerate}
                        disabled={!selectedImage || isPending}
                      >
                        {isPending ? (
                          <span className="flex items-center gap-2">Generating Magic...</span>
                        ) : (
                          <span className="flex items-center gap-2">
                            <Wand2 className="h-5 w-5" /> Generate Magic
                          </span>
                        )}
                      </Button>
                    </div>

                    {/* MOBILE VIEW (Animated Steps) */}
                    <div className="block lg:hidden relative">
                      <AnimatePresence mode="wait" initial={false}>
                        {step === 1 && (
                          <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-6"
                          >
                            <PhotoUploadCard
                              onImageSelect={(file) => {
                                handleImageSelect(file);
                                // Auto-advance disabled to prioritize manual "Next Step" navigation
                              }}
                              selectedImage={selectedImage}
                            />
                            <div className="pt-4">
                              <Button
                                className="w-full h-12 text-lg shadow-md"
                                onClick={() => setStep(2)}
                                size="lg"
                                disabled={!selectedImage}
                              >
                                Next Step
                              </Button>
                            </div>
                          </motion.div>
                        )}

                        {step === 2 && (
                          <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                          >
                            <TransformationSelector
                              selectedType={selectedType}
                              onSelect={(type) => {
                                setSelectedType(type);
                                setStep(3);
                              }}
                            />
                          </motion.div>
                        )}

                        {step === 3 && (
                          <motion.div
                            key="step3"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-6"
                          >
                            {selectedType && (
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
                                bgCategory={bgCategory}
                                onBgCategoryChange={setBgCategory}
                              />
                            )}
                            <Button
                              size="lg"
                              className="w-full text-lg h-14 bg-[#538CE8] hover:bg-[#538CE8]/80 cursor-pointer shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.02]"
                              onClick={handleGenerate}
                              disabled={!selectedImage || !selectedType || isPending}
                            >
                              {isPending ? (
                                <span className="flex items-center gap-2">Generating Magic...</span>
                              ) : (
                                <span className="flex items-center gap-2">
                                  <Wand2 className="h-5 w-5" /> Generate Magic
                                </span>
                              )}
                            </Button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Right Column: Options (Desktop) or Results (Both) */}
                  <div
                    id="results-section"
                    className={cn(
                      'h-full border-l-0 lg:border-l border-border/50 pl-0 lg:pl-8 lg:min-h-[400px]',
                      // Mobile: Hide unless showing results (which overrides steps) OR desktop specific options
                      // Since we handled Step 3 Options in the left column for Mobile, this column is mostly for Desktop Options OR Results.
                      !showResults && 'hidden lg:block',
                      showResults && 'block', // Always show if results are ready
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
                            onClose={() => {
                              setResultUrl(null);
                              // Optional: Reset step?
                              // setStep(1);
                            }}
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
                            {selectedType ? (
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
                                bgCategory={bgCategory}
                                onBgCategoryChange={setBgCategory}
                              />
                            ) : (
                              <div className="flex items-center justify-center h-[200px] bg-muted/20 rounded-xl border-2 border-dashed border-muted-foreground/20">
                                <div className="text-center text-muted-foreground p-6">
                                  <p className="font-medium">No Transformation Selected</p>
                                  <p className="text-sm">
                                    Select a transformation type on the left to continue.
                                  </p>
                                </div>
                              </div>
                            )}
                          </motion.div>
                        </div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </motion.div>
          </section>

          {/* Content Sections */}
          <FeatureSection />
          <HowItWorks />
          <FAQSection />
        </main>
      </div>
    </div>
  );
}
