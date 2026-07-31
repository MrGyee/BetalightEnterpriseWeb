"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

const stats = [
  { label: "Projects Completed", value: 150, suffix: "+" },
  { label: "Happy Clients", value: 300, suffix: "+" },
  { label: "Counties Served", value: 8, suffix: "" },
  { label: "Years of Experience", value: 5, suffix: "+" },
  { label: "Solar Systems Installed", value: 60, suffix: "+" },
  { label: "Electrical Products", value: 500, suffix: "+" },
];

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 1400;
    const start = performance.now();
    let frame: number;
    function tick(now: number) {
      const progress = Math.min((now - start) / duration, 1);
      setCount(Math.round(value * (1 - Math.pow(1 - progress, 3))));
      if (progress < 1) frame = requestAnimationFrame(tick);
    }
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, value]);

  return (
    <span ref={ref} className="font-heading text-4xl font-extrabold text-primary sm:text-5xl">
      {count}
      {suffix}
    </span>
  );
}

export function Stats() {
  return (
    <section className="border-b border-border bg-secondary/30 py-14">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 sm:grid-cols-3 sm:px-6 lg:grid-cols-6 lg:px-8">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <Counter value={stat.value} suffix={stat.suffix} />
            <p className="mt-1 text-xs font-medium uppercase tracking-wide text-muted-foreground sm:text-sm">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
