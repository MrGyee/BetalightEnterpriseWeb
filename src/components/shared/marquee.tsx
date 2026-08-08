import type { CSSProperties, ReactNode } from "react";

/**
 * Full-bleed row that scrolls right-to-left forever.
 *
 * Pass one copy of the items as `children` — this renders them twice so one
 * copy is exactly half the track width, which is what the -50% keyframe wraps
 * to. Each item must carry its own trailing margin (`mr-5`) rather than the
 * track using `gap`, or the two halves won't be equal and the loop will jump.
 *
 * Set `durationSeconds` to (one copy's width in px) / 50 to keep every row on
 * the page moving at the same speed.
 */
export function Marquee({
  children,
  durationSeconds,
  tinted = false,
}: {
  children: ReactNode;
  durationSeconds: number;
  /** Set when the section uses bg-secondary/30, so the edge fades match it. */
  tinted?: boolean;
}) {
  return (
    <div className="group relative overflow-hidden">
      <div
        className="marquee-track flex w-max items-stretch"
        style={{ "--marquee-duration": `${durationSeconds}s` } as CSSProperties}
      >
        {children}
        <div className="flex items-stretch" aria-hidden>
          {children}
        </div>
      </div>

      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 sm:w-20">
        <div className="absolute inset-0 bg-gradient-to-r from-background to-transparent" />
        {tinted && <div className="absolute inset-0 bg-gradient-to-r from-secondary/30 to-transparent" />}
      </div>
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 sm:w-20">
        <div className="absolute inset-0 bg-gradient-to-l from-background to-transparent" />
        {tinted && <div className="absolute inset-0 bg-gradient-to-l from-secondary/30 to-transparent" />}
      </div>
    </div>
  );
}
