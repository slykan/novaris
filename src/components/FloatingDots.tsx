// .hero-grid-fx draws its grid lines with a fixed 56px background-size, so the
// dots use the same fixed pixel offsets (not percentages) to land exactly on
// a vertical line regardless of the container's actual rendered width.
const GRID_CELL = 56;

const dots = [
  { col: 1, size: 4, duration: 11, delay: 0 },
  { col: 2, size: 3, duration: 9, delay: 2.4 },
  { col: 3, size: 5, duration: 13, delay: 1 },
  { col: 4, size: 3, duration: 8, delay: 3.6 },
  { col: 5, size: 4, duration: 12, delay: 0.6 },
  { col: 6, size: 3, duration: 10, delay: 4.2 },
  { col: 7, size: 5, duration: 14, delay: 1.8 },
  { col: 8, size: 4, duration: 9, delay: 3 },
  { col: 9, size: 3, duration: 11, delay: 0.2 },
  { col: 10, size: 4, duration: 13, delay: 2.8 },
  { col: 11, size: 5, duration: 10, delay: 1.4 },
  { col: 2, size: 3, duration: 15, delay: 6.8 },
  { col: 5, size: 3, duration: 16, delay: 7.4 },
  { col: 8, size: 3, duration: 14, delay: 5.6 },
  { col: 10, size: 4, duration: 17, delay: 8 },
] as const;

export function FloatingDots() {
  return (
    <div aria-hidden className="floating-dots">
      {dots.map((d, i) => (
        <span
          key={i}
          className="floating-dot"
          style={{
            left: d.col * GRID_CELL - d.size / 2,
            width: d.size,
            height: d.size,
            animationDuration: `${d.duration}s`,
            animationDelay: `${d.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
