const dots: readonly (readonly [number, number])[] = [
  [60, 60], [280, 110], [520, 40], [760, 90], [1000, 60], [1150, 130],
  [20, 260], [230, 300], [430, 230], [640, 300], [860, 250], [1080, 220],
  [80, 420], [300, 470], [500, 430], [700, 470], [920, 420], [1140, 460],
  [140, 610], [360, 640], [580, 600], [780, 650], [990, 610], [1160, 580],
  [1180, 340], [40, 520], [900, 130], [450, 550],
];

const edges: readonly (readonly [number, number])[] = [
  [0, 1], [1, 3], [3, 4], [5, 6], [6, 7], [7, 8], [8, 9],
  [10, 11], [11, 12], [12, 13], [13, 14], [15, 16], [16, 17], [17, 18],
  [19, 5], [5, 20], [20, 10], [10, 21], [21, 15],
  [2, 3], [9, 22], [22, 13], [17, 23], [23, 12], [11, 24], [24, 16],
];

export function NetworkGrid() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 1200 700"
      preserveAspectRatio="xMidYMid slice"
      className="hero-network"
    >
      <g stroke="var(--blue-2)" strokeWidth="1" opacity="0.16">
        {edges.map(([a, b], i) => (
          <line
            key={i}
            x1={dots[a][0]}
            y1={dots[a][1]}
            x2={dots[b][0]}
            y2={dots[b][1]}
          />
        ))}
      </g>
      <g fill="var(--blue)">
        {dots.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={3} opacity="0.4" />
        ))}
      </g>
    </svg>
  );
}
