export type PromptPresetTransformation = 'passport' | 'background' | 'remove' | 'prompt';

export interface PromptPreset {
  id: string;
  title: string;
  description: string;
  transformationType: PromptPresetTransformation;
  prompt: string;
  exampleImage: string;
  passportMode?: 'custom';
  backgroundCategory?: 'custom';
  needsPersonalization?: boolean;
}

export const PROMPT_PRESETS: PromptPreset[] = [
  {
    id: 'passport-executive',
    title: 'Executive ID portrait',
    description: 'Tailored navy suit with clean, official styling.',
    transformationType: 'passport',
    passportMode: 'custom',
    prompt:
      'Create a professional passport-style portrait. Keep the person recognisable and centered, use a plain light background, even studio lighting, and a tailored navy business suit.',
    exampleImage: '/portfolio/sample-1.jpg',
  },
  {
    id: 'passport-classic',
    title: 'Classic formal portrait',
    description: 'Neutral expression, white backdrop, and refined wardrobe.',
    transformationType: 'passport',
    passportMode: 'custom',
    prompt:
      'Create a refined, formal ID portrait with a neutral expression, a crisp white background, balanced frontal lighting, and conservative professional clothing.',
    exampleImage: '/portfolio/sample-2.jpg',
  },
  {
    id: 'passport-evening',
    title: 'Black-tie portrait',
    description: 'A polished tuxedo look for formal profiles.',
    transformationType: 'passport',
    passportMode: 'custom',
    prompt:
      'Create a polished, formal portrait. Keep the face natural and recognisable, use a soft light-grey studio background, and dress the person in a classic black tuxedo with flattering studio lighting.',
    exampleImage: '/linkedin/1.png',
  },
  {
    id: 'background-warm-office',
    title: 'Warm office',
    description: 'A bright, softly blurred workspace behind the subject.',
    transformationType: 'background',
    backgroundCategory: 'custom',
    prompt:
      'Replace the background with a warm, modern office with natural window light, light wood details, and a softly blurred depth of field. Keep the person unchanged and sharply in focus.',
    exampleImage: '/hero-2.jpg',
  },
  {
    id: 'background-studio-blue',
    title: 'Blue studio gradient',
    description: 'A clean blue gradient for a modern professional look.',
    transformationType: 'background',
    backgroundCategory: 'custom',
    prompt:
      'Replace the background with a clean, premium studio gradient that shifts from deep navy to muted blue. Preserve the person exactly, with natural edge detail and soft portrait lighting.',
    exampleImage: '/linkedin/9.png',
  },
  {
    id: 'background-city-evening',
    title: 'City at dusk',
    description: 'An elegant urban background with cinematic bokeh.',
    transformationType: 'background',
    backgroundCategory: 'custom',
    prompt:
      'Replace the background with an elegant city scene at dusk, warm building lights, subtle cinematic bokeh, and a shallow depth of field. Keep the person natural and sharply in focus.',
    exampleImage: '/hero4.jpg',
  },
  {
    id: 'remove-clutter',
    title: 'Clear visual clutter',
    description: 'Start with a template and name the distracting item to remove.',
    transformationType: 'remove',
    prompt: 'Remove the [object] from the image and reconstruct the surrounding area naturally.',
    exampleImage: '/hero-3.jpg',
    needsPersonalization: true,
  },
  {
    id: 'remove-background-person',
    title: 'Remove a background person',
    description: 'Edit the placeholder with a clear description before generating.',
    transformationType: 'remove',
    prompt:
      'Remove the [background person] from the image. Preserve the main subject and reconstruct the background naturally.',
    exampleImage: '/portfolio/sample-3.jpg',
    needsPersonalization: true,
  },
  {
    id: 'prompt-editorial',
    title: 'Editorial headshot',
    description: 'Clean magazine-inspired portrait styling.',
    transformationType: 'prompt',
    prompt:
      'Transform this into a premium editorial headshot with balanced studio lighting, a neutral textured backdrop, natural skin texture, and confident but approachable professional styling. Keep the person recognisable.',
    exampleImage: '/linkedin/4.png',
  },
  {
    id: 'prompt-creative-gel',
    title: 'Creative colour gel',
    description: 'Modern purple-and-blue portrait lighting.',
    transformationType: 'prompt',
    prompt:
      'Transform this into a creative studio portrait with subtle purple and blue colour-gel lighting, a dark minimal backdrop, crisp focus, and an editorial fashion-photography feel. Keep the person recognisable.',
    exampleImage: '/linkedin/3.png',
  },
  {
    id: 'prompt-golden-hour',
    title: 'Golden-hour outdoors',
    description: 'Warm natural light and a softly blurred outdoor setting.',
    transformationType: 'prompt',
    prompt:
      'Transform this into a warm golden-hour outdoor portrait with soft natural sunlight, gentle greenery in the distance, shallow depth of field, and realistic natural skin tones. Keep the person recognisable.',
    exampleImage: '/linkedin/7.png',
  },
  {
    id: 'prompt-cinematic',
    title: 'Cinematic monochrome',
    description: 'A striking black-and-white professional portrait.',
    transformationType: 'prompt',
    prompt:
      'Transform this into a sophisticated black-and-white cinematic portrait with directional studio lighting, rich contrast, a subtle dark background, and preserved facial detail. Keep the person recognisable.',
    exampleImage: '/linkedin/6.png',
  },
];
