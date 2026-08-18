// left values are snapped to the .hero-grid-fx column spacing (100/12 ≈ 8.33%)
// so each dot appears to travel straight up along one of the grid's vertical lines.
const dots = [
  { left: 8.3, size: 4, duration: 11, delay: 0 },
  { left: 16.7, size: 3, duration: 9, delay: 2.4 },
  { left: 25, size: 5, duration: 13, delay: 1 },
  { left: 33.3, size: 3, duration: 8, delay: 3.6 },
  { left: 41.7, size: 4, duration: 12, delay: 0.6 },
  { left: 50, size: 3, duration: 10, delay: 4.2 },
  { left: 58.3, size: 5, duration: 14, delay: 1.8 },
  { left: 66.7, size: 4, duration: 9, delay: 3 },
  { left: 75, size: 3, duration: 11, delay: 0.2 },
  { left: 83.3, size: 4, duration: 13, delay: 2.8 },
  { left: 91.7, size: 5, duration: 10, delay: 1.4 },
  { left: 16.7, size: 3, duration: 15, delay: 6.8 },
  { left: 41.7, size: 3, duration: 16, delay: 7.4 },
  { left: 66.7, size: 3, duration: 14, delay: 5.6 },
  { left: 83.3, size: 4, duration: 17, delay: 8 },
] as const;

export function FloatingDots() {
  return (
    <div aria-hidden className="floating-dots">
      {dots.map((d, i) => (
        <span
          key={i}
          className="floating-dot"
          style={{
            left: `${d.left}%`,
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
