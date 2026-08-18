"use client";

import { useEffect, useRef } from "react";

type Vec3 = readonly [number, number, number];

export function RotatingMesh({
  points,
  edges,
  size = 140,
  speed = 0.2,
  reverse = false,
  className = "",
}: {
  points: readonly Vec3[];
  edges: readonly (readonly [number, number])[];
  size?: number;
  speed?: number;
  reverse?: boolean;
  className?: string;
}) {
  const lineRefs = useRef<(SVGLineElement | null)[]>([]);
  const circleRefs = useRef<(SVGCircleElement | null)[]>([]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let raf: number;
    let angle = 0;
    const dir = reverse ? -1 : 1;
    let last = performance.now();
    const half = size / 2;

    function render(currentAngle: number) {
      const cos = Math.cos(currentAngle);
      const sin = Math.sin(currentAngle);

      const projected = points.map(([x, y, z]) => {
        const xr = x * cos + z * sin;
        const zr = -x * sin + z * cos;
        const scale = 1 + zr * 0.006;
        return { x: xr * scale, y: y * scale, z: zr };
      });

      projected.forEach((p, i) => {
        const c = circleRefs.current[i];
        if (!c) return;
        c.setAttribute("cx", String(half + p.x));
        c.setAttribute("cy", String(half + p.y));
        c.setAttribute("r", String(Math.max(1.6, 3 + p.z * 0.02)));
        c.setAttribute(
          "opacity",
          String(Math.max(0.35, Math.min(1, 0.7 + p.z * 0.006)))
        );
      });

      edges.forEach(([a, b], i) => {
        const l = lineRefs.current[i];
        if (!l) return;
        const pa = projected[a];
        const pb = projected[b];
        l.setAttribute("x1", String(half + pa.x));
        l.setAttribute("y1", String(half + pa.y));
        l.setAttribute("x2", String(half + pb.x));
        l.setAttribute("y2", String(half + pb.y));
        const avgZ = (pa.z + pb.z) / 2;
        l.setAttribute(
          "opacity",
          String(Math.max(0.15, Math.min(0.6, 0.35 + avgZ * 0.01)))
        );
      });
    }

    if (prefersReducedMotion) {
      render(0);
      return;
    }

    function frame(now: number) {
      const dt = (now - last) / 1000;
      last = now;
      angle += speed * dir * dt;
      render(angle);
      raf = requestAnimationFrame(frame);
    }

    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [points, edges, speed, reverse, size]);

  return (
    <svg
      aria-hidden
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={`rotating-mesh ${className}`}
    >
      <g stroke="var(--blue-2)" strokeWidth="1">
        {edges.map((_, i) => (
          <line
            key={i}
            ref={(el) => {
              lineRefs.current[i] = el;
            }}
          />
        ))}
      </g>
      <g fill="var(--blue)">
        {points.map((_, i) => (
          <circle
            key={i}
            ref={(el) => {
              circleRefs.current[i] = el;
            }}
          />
        ))}
      </g>
    </svg>
  );
}
