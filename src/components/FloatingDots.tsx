const dots = [
  { left: 8, size: 3, duration: 11, delay: 0 },
  { left: 16, size: 2, duration: 9, delay: 2.4 },
  { left: 24, size: 4, duration: 13, delay: 1 },
  { left: 33, size: 2, duration: 8, delay: 3.6 },
  { left: 41, size: 3, duration: 12, delay: 0.6 },
  { left: 49, size: 2, duration: 10, delay: 4.2 },
  { left: 57, size: 4, duration: 14, delay: 1.8 },
  { left: 64, size: 3, duration: 9, delay: 3 },
  { left: 71, size: 2, duration: 11, delay: 0.2 },
  { left: 78, size: 3, duration: 13, delay: 2.8 },
  { left: 85, size: 4, duration: 10, delay: 1.4 },
  { left: 91, size: 2, duration: 12, delay: 4.6 },
  { left: 5, size: 2, duration: 15, delay: 5.2 },
  { left: 37, size: 3, duration: 16, delay: 6 },
  { left: 62, size: 2, duration: 14, delay: 5.6 },
  { left: 88, size: 3, duration: 17, delay: 3.2 },
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
