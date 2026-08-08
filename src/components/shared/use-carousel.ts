"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Tracks a horizontal scroll-snap track: which card is active, whether there's
 * more content either side, and how to scroll to a given card.
 *
 * Pass a `resetKey` that changes whenever the track's contents change (e.g. a
 * filter) so the active index resets and state re-syncs.
 */
export function useCarousel(itemCount: number, resetKey: string | number = "") {
  const scrollRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Scroll fires far more often than once a frame during a momentum swipe, and
  // each run reads layout, so coalesce to one read per frame.
  const sync = useCallback(() => {
    if (frameRef.current !== null) return;
    frameRef.current = requestAnimationFrame(() => {
      frameRef.current = null;
      const el = scrollRef.current;
      if (!el) return;

      const scrollLeft = el.scrollLeft;
      const scrollable = el.scrollWidth - el.clientWidth;
      setCanScrollLeft(scrollLeft > 8);
      setCanScrollRight(scrollable > 8 && scrollLeft < scrollable - 8);

      let nearest = 0;
      let shortestDistance = Infinity;
      const cards = el.children;
      for (let i = 0; i < cards.length; i++) {
        const distance = Math.abs((cards[i] as HTMLElement).offsetLeft - scrollLeft);
        if (distance < shortestDistance) {
          shortestDistance = distance;
          nearest = i;
        }
      }
      setActiveIndex(nearest);
    });
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    setActiveIndex(0);
    sync();
    el.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);

    // The first sync runs before card images have loaded, when the track is
    // still narrower than its final width — without this the arrows and edge
    // fades stay hidden until the user happens to scroll or resize.
    const observer = new ResizeObserver(sync);
    observer.observe(el);

    return () => {
      el.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
      observer.disconnect();
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };
  }, [sync, resetKey, itemCount]);

  const scrollToIndex = useCallback((index: number) => {
    const el = scrollRef.current;
    const target = el?.children[index] as HTMLElement | undefined;
    if (!el || !target) return;
    el.scrollTo({ left: target.offsetLeft, behavior: "smooth" });
  }, []);

  return { scrollRef, activeIndex, canScrollLeft, canScrollRight, scrollToIndex };
}
