import { useEffect, useRef, useState } from 'react';

/**
 * useScrollReveal — attaches IntersectionObserver to a ref,
 * adds .visible class when element enters viewport.
 * @param {object} opts  IntersectionObserver options
 * @returns { ref, isVisible }
 */
export function useScrollReveal(opts = {}) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          el.classList.add('visible');
          observer.unobserve(el);
        }
      },
      { threshold: opts.threshold ?? 0.12, rootMargin: opts.rootMargin ?? '0px 0px -60px 0px', ...opts }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, isVisible };
}

/**
 * useCountUp — animates a number from 0 to `end` once visible
 * @param {number} end  Target number
 * @param {number} duration  ms
 * @returns { ref, count }
 */
export function useCountUp(end, duration = 1800) {
  const ref = useRef(null);
  const [count, setCount] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const startTime = performance.now();
          const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 4);
            setCount(Math.round(eased * end));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
          observer.unobserve(el);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [end, duration]);

  return { ref, count };
}

/**
 * useStaggerReveal — reveals children one by one with delays
 * @param {number} count  Number of children
 * @param {number} stagger  ms between each reveal
 */
export function useStaggerReveal(count = 6, stagger = 80) {
  const containerRef = useRef(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { containerRef, revealed };
}
