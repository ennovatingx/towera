import { useCallback, useEffect, useRef, useState } from 'react';

interface UseInViewportOptions {
  threshold?: number;
  rootMargin?: string;
}

/**
 * Continuously tracks whether an element is on screen (unlike useScrollReveal,
 * which is a one-shot fade-in trigger) — used to pause expensive rendering
 * (e.g. a WebGL render loop) while it's scrolled out of view.
 */
export function useInViewport<T extends HTMLElement = HTMLDivElement>({
  threshold = 0,
  rootMargin = '200px 0px',
}: UseInViewportOptions = {}) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(true);

  const handleIntersect = useCallback((entries: IntersectionObserverEntry[]) => {
    entries.forEach((entry) => setInView(entry.isIntersecting));
  }, []);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(handleIntersect, { threshold, rootMargin });
    observer.observe(node);

    return () => observer.disconnect();
  }, [handleIntersect, threshold, rootMargin]);

  return { ref, inView };
}
