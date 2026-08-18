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
  .map((n) => ({
    ...n,
    brightness: 0.15 + hash(n.col * 3.7 + n.row * 5.3) * 0.4,
  }));

export function GridNodes() {
  return (
    <div aria-hidden className="grid-nodes">
      {nodes.map((n, i) => (
        <span
          key={i}
          className="grid-node"
          style={{
            left: n.col * CELL - 1.5,
            top: n.row * CELL - 1.5,
            opacity: n.brightness,
          }}
        />
      ))}
    </div>
  );
}
