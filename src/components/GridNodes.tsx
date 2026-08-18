import type { CSSProperties } from "react";

// Deterministic pseudo-random hash (no Math.random — must render identically
// on server and client to avoid hydration mismatches).
function hash(n: number) {
  const x = Math.sin(n) * 43758.5453;
  return x - Math.floor(x);
}

const CELL = 56;
const COLS = 14;
const ROWS = 12;

const nodes = Array.from({ length: COLS * ROWS }, (_, i) => {
  const col = i % COLS;
  const row = Math.floor(i / COLS);
  return { col, row, pick: hash(col * 12.9898 + row * 78.233) };
})
  .filter((n) => n.pick > 0.68)
  .map((n) => {
    const dim = 0.15 + hash(n.col * 3.7 + n.row * 5.3) * 0.35;
    const bright = 0.55 + hash(n.col * 9.1 + n.row * 2.3) * 0.45;
    const duration = 2.5 + hash(n.col * 5.9 + n.row * 11.7) * 4.5;
    const delay = hash(n.col * 17.3 + n.row * 4.1) * 6;
    return { ...n, dim, bright, duration, delay };
  });

export function GridNodes() {
  return (
    <div aria-hidden className="grid-nodes">
      {nodes.map((n, i) => (
        <span
          key={i}
          className="grid-node"
          style={
            {
              left: n.col * CELL - 1.5,
              top: n.row * CELL - 1.5,
              opacity: n.dim,
              "--node-dim": n.dim,
              "--node-bright": n.bright,
              animationDuration: `${n.duration}s`,
              animationDelay: `${n.delay}s`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
