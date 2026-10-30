'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  ArrowUpRight,
  Camera,
  Check,
  ImagePlus,
  Layers3,
  LockKeyhole,
  SlidersHorizontal,
  Sparkles,
  Upload,
  X,
} from 'lucide-react';
import styles from './studio.module.css';

const treatments = [
  { name: 'Professional headshot', note: 'A little more you. A lot more polished.', icon: Camera },
  { name: 'Background studio', note: 'Give your photo a different setting.', icon: Layers3 },
  { name: 'Creative edit', note: 'Describe the change you have in mind.', icon: Sparkles },
];

export function StudioPreview({ ready = false }: { ready?: boolean }) {
  const [treatment, setTreatment] = useState(0);
  const [background, setBackground] = useState('Slate');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState('');
  const [error, setError] = useState('');
  const [original, setOriginal] = useState(false);
  useEffect(
    () => () => {
      if (preview) URL.revokeObjectURL(preview);
    },
    [preview],
  );
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
    setFile(value);
    setPreview(URL.createObjectURL(value));
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
              <br className={styles.desktopBreak} /> Set the scene. Find your style. Make it yours.
            </p>
          </div>
          <div className={styles.introNote}>
            <Sparkles size={20} aria-hidden="true" />
            <span>
              Good photos start
              <br />
              with a little possibility.
            </span>
          </div>
        </section>
        <section
          id="studio-workspace"
          className={styles.workspace}
          aria-label="Photo editing studio"
        >
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
                  onClick={() => setTreatment(index)}
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
              <span>02</span> Make it your own
            </div>
            <p className={styles.fieldLabel}>Background palette</p>
            <div className={styles.swatches}>
              {[
                ['Slate', '#314e67'],
                ['Stone', '#c8c2b7'],
                ['Forest', '#3f5c50'],
                ['Ink', '#292f37'],
              ].map(([name, color]) => (
                <button
                  type="button"
                  key={name}
                  aria-label={`${name} background`}
                  aria-pressed={background === name}
                  onClick={() => setBackground(name)}
                  style={{ background: color }}
                  className={background === name ? styles.chosenSwatch : ''}
                >
                  {background === name && <Check size={16} aria-hidden="true" />}
                </button>
              ))}
              <span>{background}</span>
            </div>
            <label className={styles.promptLabel} htmlFor="creative-direction">
              Creative direction <span>Optional</span>
            </label>
            <textarea
              id="creative-direction"
              rows={3}
              placeholder="Soft natural light, a relaxed expression…"
              maxLength={1000}
            />
            <div className={styles.setup}>
              <LockKeyhole size={17} aria-hidden="true" />
              <p>
                {ready
                  ? 'Preview your direction here, then open the full studio to generate and export your photo.'
                  : 'Explore the studio now. Sign-in and AI generation will be available after service setup.'}
              </p>
            </div>
            <p className={styles.controlNote}>
              Palette and direction are planning controls. Your preview image is not edited.
            </p>
            {ready ? (
              <Link className={styles.generate} href="/studio">
                <Sparkles size={18} aria-hidden="true" /> Open full studio{' '}
                <ArrowUpRight size={16} aria-hidden="true" />
              </Link>
            ) : (
              <button type="button" className={styles.generate} disabled>
                <Sparkles size={18} aria-hidden="true" /> Generation coming soon
              </button>
            )}
          </aside>
          <div className={styles.canvasArea}>
            <div className={styles.canvasToolbar}>
              <span>
                <span className={styles.liveDot} /> {file ? 'YOUR PHOTO' : 'STUDIO PREVIEW'}
              </span>
              <span>
                <SlidersHorizontal size={14} aria-hidden="true" /> {treatments[treatment].name}
              </span>
            </div>
            <div className={styles.canvas}>
              <div className={styles.photoFrame}>
                <Image
                  src={
                    preview || (original ? '/portfolio/sample-1.jpg' : '/portfolio/sample-2.jpg')
                  }
                  alt={
                    file
                      ? 'Your selected photo, shown without AI edits'
                      : original
                        ? 'Original example portrait'
                        : 'Illustrative portrait with a slate background'
                  }
                  fill
                  unoptimized
                  sizes="(max-width: 760px) 85vw, 500px"
                  priority
                  className={styles.photo}
                />
                <span className={styles.photoBadge}>
                  {file
                    ? 'Original upload · local preview'
                    : 'Illustrative example · not a live AI result'}
                </span>
              </div>
              {!file && (
                <div className={styles.compare} role="group" aria-label="Example comparison">
                  <button
                    type="button"
                    className={original ? styles.compareActive : ''}
                    onClick={() => setOriginal(true)}
                    aria-pressed={original}
                  >
                    Original
                  </button>
                  <button
                    type="button"
                    className={!original ? styles.compareActive : ''}
                    onClick={() => setOriginal(false)}
                    aria-pressed={!original}
                  >
                    Styled example
                  </button>
                </div>
              )}
            </div>
            <div className={styles.uploadRow}>
              <label className={styles.upload}>
                <Upload size={18} aria-hidden="true" />
                <span>
                  {file ? 'Choose another photo' : 'Bring your own photo'}
                  <small>JPG, PNG, WebP · up to 10 MB</small>
                </span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  aria-label="Upload a photo for local preview"
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
                  }}
                >
                  <X size={18} aria-hidden="true" />
                </button>
              )}
              <span className={styles.privacy}>
                <ImagePlus size={16} aria-hidden="true" /> Preview stays in your browser
              </span>
            </div>
            <p className={styles.error} role="status">
              {error}
            </p>
          </div>
        </section>
        <section id="how-it-works" className={styles.steps}>
          {[
            ['01', 'Start with a photo', 'A clear photo and a little inspiration.'],
            ['02', 'Find your direction', 'Choose a treatment and adjust the details.'],
            ['03', 'Make your next impression', 'AI export unlocks when setup is complete.'],
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
