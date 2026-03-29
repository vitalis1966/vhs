import { useEffect, useRef, useState } from "react";

/**
 * Returns [ref, isVisible] — attach ref to a wrapper div.
 * The section's lazy chunk won't load until the wrapper scrolls
 * near the viewport (rootMargin controls how early).
 */
export function useLazySection(rootMargin = "200px") {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin]);

  return [ref, isVisible] as const;
}
