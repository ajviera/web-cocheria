'use client';

import Image from 'next/image';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styles from './Carousel.module.css';

interface TrackStyle extends React.CSSProperties {
  '--index': number;
  '--drag-x': string;
}

export interface CarouselImage {
  src: string;
  /** Describes the arrangement — these are real product photos, not decoration. */
  alt: string;
}

interface CarouselProps {
  images: readonly CarouselImage[];
  regionLabel: string;
  previousLabel: string;
  nextLabel: string;
  goToLabel: (position: number) => string;
  autoPlayMs?: number;
}

// Horizontal travel (px) needed to commit a slide change on release.
const SWIPE_THRESHOLD = 48;
const DEFAULT_AUTOPLAY_MS = 5000;

const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const Carousel = ({
  images,
  regionLabel,
  previousLabel,
  nextLabel,
  goToLabel,
  autoPlayMs = DEFAULT_AUTOPLAY_MS,
}: CarouselProps) => {
  const count = images.length;
  const [index, setIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const dragStartX = useRef<number | null>(null);

  const goNext = useCallback(() => setIndex(i => (i + 1) % count), [count]);
  const goPrevious = useCallback(
    () => setIndex(i => (i - 1 + count) % count),
    [count],
  );
  const goTo = useCallback(
    (next: number) => setIndex(((next % count) + count) % count),
    [count],
  );

  // Advance on a timer, from the current value, while idle. Momentum-carrying
  // input (hover, focus, a drag) pauses it; reduced-motion opts out entirely.
  useEffect(() => {
    if (isPaused || isDragging || count <= 1 || prefersReducedMotion()) return;
    const id = window.setInterval(goNext, autoPlayMs);
    return () => window.clearInterval(id);
  }, [isPaused, isDragging, count, autoPlayMs, goNext]);

  const pause = useCallback(() => setIsPaused(true), []);
  const resume = useCallback(() => setIsPaused(false), []);

  const handlePointerDown = (event: React.PointerEvent) => {
    dragStartX.current = event.clientX;
    setIsDragging(true);
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent) => {
    if (dragStartX.current === null) return;
    setDragOffset(event.clientX - dragStartX.current);
  };

  const handlePointerEnd = () => {
    if (dragStartX.current === null) return;
    if (dragOffset <= -SWIPE_THRESHOLD) goNext();
    else if (dragOffset >= SWIPE_THRESHOLD) goPrevious();
    dragStartX.current = null;
    setDragOffset(0);
    setIsDragging(false);
  };

  const trackStyle = useMemo<TrackStyle>(
    () => ({ '--index': index, '--drag-x': `${dragOffset}px` }),
    [index, dragOffset],
  );

  return (
    <div
      className={styles.carousel}
      role="group"
      aria-label={regionLabel}
      onMouseEnter={pause}
      onMouseLeave={resume}
      onFocus={pause}
      onBlur={resume}
    >
      <div className={styles.viewport}>
        <div
          className={styles.track}
          style={trackStyle}
          data-dragging={isDragging}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerEnd}
          onPointerCancel={handlePointerEnd}
          onPointerLeave={handlePointerEnd}
        >
          {images.map((image, i) => (
            <div className={styles.slide} key={image.src} aria-hidden={i !== index}>
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 860px) 100vw, 45vw"
                className={styles.image}
                draggable={false}
              />
            </div>
          ))}
        </div>
      </div>

      <button
        type="button"
        className={`${styles.arrow} ${styles.prev}`}
        onClick={goPrevious}
        aria-label={previousLabel}
      >
        <span className={styles.chevron} aria-hidden="true" />
      </button>
      <button
        type="button"
        className={`${styles.arrow} ${styles.next}`}
        onClick={goNext}
        aria-label={nextLabel}
      >
        <span className={styles.chevron} aria-hidden="true" />
      </button>

      <div className={styles.dots}>
        {images.map((image, i) => (
          <button
            key={image.src}
            type="button"
            className={styles.dot}
            data-active={i === index}
            aria-current={i === index}
            aria-label={goToLabel(i + 1)}
            onClick={() => goTo(i)}
          />
        ))}
      </div>
    </div>
  );
};
