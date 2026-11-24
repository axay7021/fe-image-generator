'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  ArrowUpRight,
  Camera,
  Check,
  Download,
  FileText,
  ImagePlus,
  Layers3,
  RefreshCw,
  SlidersHorizontal,
  Sparkles,
  Upload,
  X,
} from 'lucide-react';
import { generateImageAction } from '@/actions/generate-image';
import styles from './studio.module.css';

interface StylePreset {
  id: string;
  title: string;
  tag: string;
  image: string;
  prompt: string;
  type: string;
  style?: string;
  category?: string;
  passportMode?: string;
  suitColor?: string;
  tieColor?: string;
}

const treatments = [
  {
    name: 'Professional headshot',
    note: 'Executive, founder & high-end studio styles.',
    icon: Camera,
  },
  {
    name: 'Background studio',
    note: 'Office, urban dusk, studio gradient & nature.',
    icon: Layers3,
  },
  {
    name: 'Creative edit',
    note: 'Editorial magazine, golden hour & monochrome.',
    icon: Sparkles,
  },
  {
    name: 'Passport & ID portrait',
    note: 'Executive ID, pure white & formal black-tie.',
    icon: FileText,
  },
];

const PRESETS_BY_TREATMENT: Record<number, StylePreset[]> = {
  // 0: Professional headshot
  0: [
    {
      id: 'headshot-classic',
      title: 'Classic Corporate',
      tag: 'Navy suit · Executive',
      image: '/linkedin/1.png',
      type: 'linkedin-profile',
      style: 'classic_corporate',
      prompt:
        'Transform this image into a classic corporate executive headshot. Bespoke navy blue suit, crisp white shirt, clean boardroom setting with soft optical bokeh, sharp focus on eyes, natural skin texture.',
    },
    {
      id: 'headshot-casual',
      title: 'Casual Professional',
      tag: 'Smart blazer · Daylight',
      image: '/linkedin/2.png',
      type: 'linkedin-profile',
      style: 'casual_professional',
      prompt:
        'Transform this into a casual professional headshot. Modern blazer over premium knitwear, natural daylight, softly blurred contemporary workspace, approachable confident posture.',
    },
    {
      id: 'headshot-founder',
      title: 'Founder / Leader',
      tag: 'Silicon Valley · Tech',
      image: '/linkedin/4.png',
      type: 'linkedin-profile',
      style: 'founder_leader',
      prompt:
        'Transform this into a founder leadership portrait. Modern tech office setting with floor-to-ceiling windows, natural daylight, visionary confident expression.',
    },
    {
      id: 'headshot-studio',
      title: 'High-End Studio Look',
      tag: 'Dark grey · Magazine lit',
      image: '/linkedin/8.png',
      type: 'linkedin-profile',
      style: 'studio_look',
      prompt:
        'Transform this into a high-end photography studio portrait. Seamless dark grey backdrop, balanced studio lighting modifiers, tack-sharp focus on facial features.',
    },
    {
      id: 'headshot-tech',
      title: 'Tech Modern',
      tag: 'Workspace · Subtle blue',
      image: '/linkedin/9.png',
      type: 'linkedin-profile',
      style: 'tech_modern',
      prompt:
        'Transform this into a modern tech professional portrait. Clean workspace with subtle ambient accents, intelligent focused posture, natural lighting.',
    },
    {
      id: 'headshot-friendly',
      title: 'Friendly & Approachable',
      tag: 'Warm tone · Authentic',
      image: '/linkedin/5.png',
      type: 'linkedin-profile',
      style: 'friendly_approachable',
      prompt:
        'Transform this into a warm, approachable professional portrait. Warm ambient lighting, natural smile, soft background blur, genuine trustworthy vibe.',
    },
  ],

  // 1: Background studio
  1: [
    {
      id: 'bg-office',
      title: 'Warm Modern Office',
      tag: 'Light wood · Architecture',
      image: '/hero-2.jpg',
      type: 'background',
      category: 'office',
      prompt:
        'Replace the background with a warm modern office with natural window light, light wood details, and soft depth of field. Keep the subject natural and sharply in focus.',
    },
    {
      id: 'bg-dusk',
      title: 'City Skyline at Dusk',
      tag: 'Twilight · Warm bokeh',
      image: '/hero4.jpg',
      type: 'background',
      category: 'custom',
      prompt:
        'Replace the background with an elegant city scene at dusk, warm building lights, subtle cinematic bokeh, and a shallow depth of field. Keep the person natural and sharply in focus.',
    },
    {
      id: 'bg-blue-gradient',
      title: 'Blue Studio Gradient',
      tag: 'Navy gradient · Crisp',
      image: '/linkedin/9.png',
      type: 'background',
      category: 'gradient_blue',
      prompt:
        'Replace the background with a clean, premium studio gradient that shifts from deep navy to muted blue. Preserve the person exactly, with natural edge detail and soft portrait lighting.',
    },
    {
      id: 'bg-outdoor',
      title: 'Outdoor Nature & Park',
      tag: 'Sunlight · Soft foliage',
      image: '/linkedin/7.png',
      type: 'background',
      category: 'outdoor_natural',
      prompt:
        'Replace the background with an outdoor park during warm golden hour, soft sunbeams filtering through greenery, natural portrait lighting.',
    },
    {
      id: 'bg-white',
      title: 'Minimal White Studio',
      tag: 'Seamless white · Pure',
      image: '/portfolio/sample-2.jpg',
      type: 'background',
      category: 'white',
      prompt:
        'pure plain white background (Hex #FFFFFF), no shadows, no gradients. Clean professional studio isolation.',
    },
    {
      id: 'bg-charcoal',
      title: 'Charcoal Studio Rim',
      tag: 'Dark grey · Rim light',
      image: '/portfolio/sample-1.jpg',
      type: 'background',
      category: 'studio',
      prompt:
        'professional dark grey studio background (Hex #333333) with rim lighting to cleanly separate the subject.',
    },
  ],

  // 2: Creative edit
  2: [
    {
      id: 'creative-editorial',
      title: 'Editorial Magazine',
      tag: 'High fashion · Contrast',
      image: '/linkedin/4.png',
      type: 'prompt',
      prompt:
        'Transform this into a premium editorial headshot with balanced studio lighting, a neutral textured backdrop, natural skin texture, and confident approachable styling.',
    },
    {
      id: 'creative-golden-hour',
      title: 'Golden-Hour Outdoors',
      tag: 'Warm sunlight · Natural',
      image: '/linkedin/7.png',
      type: 'prompt',
      prompt:
        'Transform this into a warm golden-hour outdoor portrait with soft natural sunlight, gentle greenery in the distance, shallow depth of field, and realistic natural skin tones.',
    },
    {
      id: 'creative-monochrome',
      title: 'Cinematic Monochrome',
      tag: 'Black & White · Dramatic',
      image: '/linkedin/6.png',
      type: 'prompt',
      prompt:
        'Transform this into a sophisticated black-and-white cinematic portrait with directional studio lighting, rich contrast, a subtle dark background, and preserved facial detail.',
    },
    {
      id: 'creative-color-gel',
      title: 'Creative Colour Gel',
      tag: 'Purple & Blue · Studio',
      image: '/linkedin/3.png',
      type: 'prompt',
      prompt:
        'Transform this into a creative studio portrait with subtle purple and blue colour-gel lighting, a dark minimal backdrop, crisp focus, and an editorial fashion-photography feel.',
    },
  ],

  // 3: Passport & ID portrait
  3: [
    {
      id: 'passport-executive',
      title: 'Executive ID Portrait',
      tag: 'Navy suit · Light backdrop',
      image: '/portfolio/sample-1.jpg',
      type: 'passport',
      passportMode: 'suit',
      suitColor: 'Navy Blue',
      tieColor: 'Navy Blue',
      prompt:
        'Create a professional passport-style portrait. Keep the person recognisable and centered, use a plain light background, even studio lighting, and a tailored navy business suit.',
    },
    {
      id: 'passport-classic',
      title: 'Classic Formal ID',
      tag: 'Pure white · Formal',
      image: '/portfolio/sample-2.jpg',
      type: 'passport',
      passportMode: 'standard',
      prompt:
        'Create a refined, formal ID portrait with a neutral expression, a crisp white background, balanced frontal lighting, and conservative professional clothing.',
    },
    {
      id: 'passport-tuxedo',
      title: 'Black-Tie Tuxedo',
      tag: 'Formal gala · Elegant',
      image: '/linkedin/1.png',
      type: 'passport',
      passportMode: 'suit',
      suitColor: 'Black',
      tieColor: 'Black',
      prompt:
        'Create a polished, formal portrait. Keep the face natural and recognisable, use a soft light-grey studio background, and dress the person in a classic black tuxedo with flattering studio lighting.',
    },
  ],
};

export function StudioPreview({ ready = true }: { ready?: boolean }) {
  const [treatment, setTreatment] = useState(0);
  const currentPresets = PRESETS_BY_TREATMENT[treatment] || [];
  const [selectedPreset, setSelectedPreset] = useState<StylePreset>(currentPresets[0]);
  const [promptText, setPromptText] = useState(currentPresets[0]?.prompt || '');

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState('');
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [activeCanvasView, setActiveCanvasView] = useState<'photo' | 'target'>('photo');
  const [resultView, setResultView] = useState<'result' | 'original'>('result');

  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  // When treatment changes, select first preset of that category
  const handleTreatmentChange = (index: number) => {
    setTreatment(index);
    const presets = PRESETS_BY_TREATMENT[index] || [];
    if (presets.length) {
      setSelectedPreset(presets[0]);
      setPromptText(presets[0].prompt);
    }
  };

  // When user clicks an example card
  const handleSelectPreset = (preset: StylePreset) => {
    setSelectedPreset(preset);
    setPromptText(preset.prompt);
    setError('');
  };

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  function chooseFile(value?: File) {
    if (!value) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(value.type)) {
      setError('Choose a JPG, PNG or WebP image.');
      return;
    }
    if (value.size > 10 * 1024 * 1024) {
      setError('Choose an image smaller than 10 MB.');
      return;
    }
    setError('');
    setResultUrl(null);
    setActiveCanvasView('photo');
    setResultView('result');
    setFile(value);
    setPreview(URL.createObjectURL(value));
  }

  async function handleGenerate() {
    if (!file) {
      setError('Please upload your photo first using the button below the canvas.');
      return;
    }

    setError('');
    setIsGenerating(true);

    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('type', selectedPreset.type);
      formData.append('prompt', promptText);

      if (selectedPreset.style) {
        formData.append('style', selectedPreset.style);
      }
      if (selectedPreset.category) {
        formData.append('category', selectedPreset.category);
      }
      if (selectedPreset.passportMode) {
        formData.append('passport_mode', selectedPreset.passportMode);
        if (selectedPreset.suitColor) formData.append('suit_color', selectedPreset.suitColor);
        if (selectedPreset.tieColor) formData.append('tie_color', selectedPreset.tieColor);
      }

      const res = await generateImageAction(formData);

      if (res.success && res.imageUrl) {
        setResultUrl(res.imageUrl);
        setResultView('result');
      } else {
        setError(res.error || 'Failed to generate image. Please try again.');
      }
    } catch (err: unknown) {
      console.error('Generation error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred during generation.');
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <div className={styles.studio}>
      <a className={styles.skip} href="#studio-workspace">
        Skip to studio
      </a>
      <header className={styles.header}>
        <Link href="/" className={styles.brand}>
          <span className={styles.logo}>
            <Camera size={22} aria-hidden="true" />
          </span>
          profilepic<span className={styles.brandSuffix}>/ labs</span>
        </Link>
        <nav aria-label="Main navigation">
          <a className={styles.activeNav} href="#studio-workspace">
            Studio
          </a>
          <a href="#how-it-works">How it works</a>
        </nav>
        <a className={styles.sourceLink} href="https://github.com/axay7021/fe-image-generator">
          View source <ArrowUpRight size={16} aria-hidden="true" />
        </a>
      </header>

      <main className={styles.main}>
        <section className={styles.intro}>
          <div>
            <p className={styles.eyebrow}>
              <span /> YOUR PERSONAL PHOTO STUDIO
            </p>
            <h1>
              A fresh perspective.
              <br />
              <span>Still unmistakably you.</span>
            </h1>
            <p>
              From everyday photo to your next great first impression.
              <br className={styles.desktopBreak} /> Select an AI example style to transform your photo.
            </p>
          </div>
          <div className={styles.introNote}>
            <Sparkles size={20} aria-hidden="true" />
            <span>
              Select any example below
              <br />
              to apply its style to your photo.
            </span>
          </div>
        </section>

        <section id="studio-workspace" className={styles.workspace} aria-label="Photo editing studio">
          <aside className={styles.tools}>
            <div className={styles.sectionLabel}>
              <span>01</span> Choose your direction
            </div>
            <div className={styles.treatments}>
              {treatments.map((item, index) => (
                <button
                  type="button"
                  key={item.name}
                  className={`${styles.treatment} ${treatment === index ? styles.selected : ''}`}
                  aria-pressed={treatment === index}
                  onClick={() => handleTreatmentChange(index)}
                >
                  <item.icon size={20} aria-hidden="true" />
                  <span>
                    <strong>{item.name}</strong>
                    <small>{item.note}</small>
                  </span>
                  {treatment === index && <Check size={15} aria-hidden="true" />}
                </button>
              ))}
            </div>

            <div className={styles.divider} />

            <div className={styles.sectionLabel}>
              <span>02</span> Select an AI example style
            </div>
            <p className={styles.fieldLabel}>Click any example to apply its styling &amp; prompt:</p>

            {/* Multiple AI generated example cards */}
            <div className={styles.examplesGrid}>
              {currentPresets.map((preset) => {
                const isSelected = selectedPreset?.id === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    className={`${styles.exampleCard} ${isSelected ? styles.exampleCardActive : ''}`}
                  >
                    <div className={styles.exampleThumbWrapper}>
                      <Image
                        src={preset.image}
                        alt={preset.title}
                        fill
                        unoptimized
                        sizes="160px"
                        className={styles.exampleThumb}
                      />
                      {isSelected && (
                        <span className={styles.selectedIndicator}>
                          <Check size={12} strokeWidth={3} />
                        </span>
                      )}
                    </div>
                    <div className={styles.exampleMeta}>
                      <span className={styles.exampleTitle}>{preset.title}</span>
                      <span className={styles.exampleTag}>{preset.tag}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            <label className={styles.promptLabel} htmlFor="creative-direction">
              Style Prompt / Instructions <span>Auto-filled from example</span>
            </label>
            <textarea
              id="creative-direction"
              rows={3}
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              placeholder="Describe your preferred lighting, backdrop, or styling..."
              maxLength={1000}
            />

            <p className={styles.controlNote}>
              Selected: <strong>{selectedPreset?.title}</strong> ({selectedPreset?.tag}). You can customize the prompt above before generating.
            </p>

            {error && (
              <div className={styles.errorBanner} role="alert">
                {error}
              </div>
            )}

            {isGenerating && (
              <div className={styles.generatingBanner}>
                <RefreshCw size={16} className="animate-spin" />
                <span>Generating your photo with AI... Please wait a few moments.</span>
              </div>
            )}

            <button
              type="button"
              className={`${styles.generate} ${styles.generateActive} ${isGenerating ? styles.generateLoading : ''}`}
              disabled={isGenerating}
              onClick={handleGenerate}
            >
              {isGenerating ? (
                <>
                  <RefreshCw size={18} className="animate-spin" aria-hidden="true" />
                  Generating magic...
                </>
              ) : (
                <>
                  <Sparkles size={18} aria-hidden="true" />
                  Generate photo with {selectedPreset?.title || 'selected style'}
                </>
              )}
            </button>
          </aside>

          <div className={styles.canvasArea}>
            <div className={styles.canvasToolbar}>
              <span>
                <span className={styles.liveDot} />{' '}
                {resultUrl
                  ? resultView === 'result'
                    ? 'AI GENERATED RESULT'
                    : 'ORIGINAL PHOTO'
                  : file
                    ? activeCanvasView === 'target'
                      ? `EXAMPLE TARGET: ${selectedPreset?.title?.toUpperCase()}`
                      : 'YOUR PHOTO (FULL VIEW)'
                    : `STYLE PREVIEW: ${selectedPreset?.title?.toUpperCase()}`}
              </span>
              <span>
                <SlidersHorizontal size={14} aria-hidden="true" />{' '}
                {selectedPreset?.title || treatments[treatment].name}
              </span>
            </div>

            <div className={styles.canvas}>
              {/* Photo Frame with object-fit: contain to prevent any image cropping */}
              <div className={styles.photoFrame}>
                {resultUrl ? (
                  <Image
                    src={resultView === 'result' ? resultUrl : preview}
                    alt={resultView === 'result' ? 'AI generated result' : 'Original uploaded photo'}
                    fill
                    unoptimized
                    sizes="(max-width: 760px) 90vw, 520px"
                    priority
                    className={styles.photo}
                  />
                ) : (
                  <Image
                    src={
                      file
                        ? activeCanvasView === 'target'
                          ? (selectedPreset?.image || '/portfolio/sample-1.jpg')
                          : preview
                        : selectedPreset?.image || '/portfolio/sample-1.jpg'
                    }
                    alt={
                      file
                        ? activeCanvasView === 'target'
                          ? `Example target: ${selectedPreset?.title}`
                          : 'Your uploaded photo, shown full without cropping'
                        : selectedPreset?.title || 'Example portrait'
                    }
                    fill
                    unoptimized
                    sizes="(max-width: 760px) 90vw, 520px"
                    priority
                    className={styles.photo}
                  />
                )}

                <span className={styles.photoBadge}>
                  {resultUrl
                    ? resultView === 'result'
                      ? `AI generated · ${selectedPreset?.title}`
                      : 'Original upload'
                    : file
                      ? activeCanvasView === 'target'
                        ? `Target example · ${selectedPreset?.title}`
                        : 'Your photo · full version'
                      : `Example · ${selectedPreset?.title}`}
                </span>
              </div>

              {/* Toggle comparison between original and generated/example */}
              {resultUrl ? (
                <div className={styles.resultActions}>
                  <div className={styles.compare} role="group" aria-label="Result comparison">
                    <button
                      type="button"
                      className={resultView === 'result' ? styles.compareActive : ''}
                      onClick={() => setResultView('result')}
                    >
                      AI Result
                    </button>
                    <button
                      type="button"
                      className={resultView === 'original' ? styles.compareActive : ''}
                      onClick={() => setResultView('original')}
                    >
                      Original
                    </button>
                  </div>
                  <a
                    href={resultUrl}
                    download={`ai-portrait-${selectedPreset?.id || 'result'}.png`}
                    className={styles.downloadBtn}
                  >
                    <Download size={15} /> Download Result
                  </a>
                </div>
              ) : (
                <div className={styles.compare} role="group" aria-label="Preview view">
                  <button
                    type="button"
                    className={!file || activeCanvasView === 'photo' ? styles.compareActive : ''}
                    onClick={() => setActiveCanvasView('photo')}
                  >
                    Your Photo
                  </button>
                  {file && (
                    <button
                      type="button"
                      className={activeCanvasView === 'target' ? styles.compareActive : ''}
                      onClick={() => setActiveCanvasView('target')}
                    >
                      Example Target
                    </button>
                  )}
                </div>
              )}
            </div>

            <div className={styles.uploadRow}>
              <label className={styles.upload}>
                <Upload size={18} aria-hidden="true" />
                <span>
                  {file ? 'Choose another photo' : 'Upload your photo'}
                  <small>JPG, PNG, WebP · up to 10 MB · never cropped</small>
                </span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  aria-label="Upload a photo"
                  onChange={(e) => chooseFile(e.target.files?.[0])}
                />
              </label>
              {file && (
                <button
                  type="button"
                  aria-label="Remove photo"
                  className={styles.remove}
                  onClick={() => {
                    setFile(null);
                    setPreview('');
                    setResultUrl(null);
                  }}
                >
                  <X size={18} aria-hidden="true" />
                </button>
              )}
              <span className={styles.privacy}>
                <ImagePlus size={16} aria-hidden="true" /> Full aspect ratio displayed
              </span>
            </div>

            {error && (
              <p className={styles.error} role="status">
                {error}
              </p>
            )}
          </div>
        </section>

        <section id="how-it-works" className={styles.steps}>
          {[
            ['01', 'Upload your photo', 'Upload any clear portrait. We display the full photo without cropping.'],
            ['02', 'Pick an AI example', 'Choose from multiple curated styles across headshots, backgrounds and creative portraits.'],
            ['03', 'Generate your photo', 'We use that category and prompt to generate your new professional portrait.'],
          ].map(([n, title, body]) => (
            <div key={n}>
              <span>{n}</span>
              <div>
                <h2>{title}</h2>
                <p>{body}</p>
              </div>
            </div>
          ))}
        </section>
      </main>

      <footer className={styles.footer}>
        <span>Made for your next chapter.</span>
        <a href="https://www.akshaydobariya.dev/projects/ai-image-generator">
          The story behind this project <ArrowUpRight size={15} aria-hidden="true" />
        </a>
      </footer>
    </div>
  );
}
