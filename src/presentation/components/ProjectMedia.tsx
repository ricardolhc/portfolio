import { useRef, useState } from 'react';
import { usePreferences } from '../preferences/PreferencesProvider';
import type { ProjectImage } from '../projects/catalog';

export function ProjectMedia({
  images,
  title,
}: {
  images: ProjectImage[];
  title: string;
}) {
  const { t, language } = usePreferences();
  const [index, setIndex] = useState(0);
  const [failed, setFailed] = useState<string[]>([]);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const image = images[index];
  if (!image) return null;
  const src = `${import.meta.env.BASE_URL}${image.src}`;
  const unavailable = failed.includes(image.src);
  const label = `${t.projects.enlarge}: ${title}`;
  return (
    <figure
      className="project-media"
      aria-label={`${t.projects.gallery}: ${title}`}
    >
      {unavailable ? (
        <p className="project-media-error" role="status">
          {t.projects.imageUnavailable}
        </p>
      ) : (
        <button
          ref={trigger}
          className="project-image-button"
          aria-label={label}
          onClick={() => dialog.current?.showModal()}
        >
          <img
            src={src}
            alt={image.alt[language]}
            width={image.width}
            height={image.height}
            loading="lazy"
            decoding="async"
            onError={() => setFailed((previous) => [...previous, image.src])}
          />
          <span className="project-enlarge">{t.projects.enlarge} ↗</span>
        </button>
      )}
      {images.length > 1 && (
        <figcaption className="project-gallery-controls">
          <button
            type="button"
            onClick={() =>
              setIndex((index + images.length - 1) % images.length)
            }
          >
            {t.projects.previous}
          </button>
          <span className="mono" aria-live="polite">
            {index + 1} / {images.length}
          </span>
          <button
            type="button"
            onClick={() => setIndex((index + 1) % images.length)}
          >
            {t.projects.next}
          </button>
        </figcaption>
      )}
      <dialog
        ref={dialog}
        className="project-lightbox"
        aria-label={`${t.projects.gallery}: ${title}`}
        onClose={() => {
          trigger.current?.focus();
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) dialog.current?.close();
        }}
      >
        <button type="button" autoFocus onClick={() => dialog.current?.close()}>
          {t.projects.closeImage} ×
        </button>
        {!unavailable && (
          <img
            src={src}
            alt={image.alt[language]}
            width={image.width}
            height={image.height}
            loading="lazy"
          />
        )}
      </dialog>
    </figure>
  );
}
