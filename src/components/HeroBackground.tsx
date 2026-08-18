import { FloatingDots } from "./FloatingDots";

export function HeroBackground() {
  return (
    <div aria-hidden className="hero-bg-fx">
      <div className="hero-grid-fx">
        <FloatingDots />
      </div>
    </div>
  );
}
