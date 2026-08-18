import { p } from "@/lib/path";
import { GridNodes } from "./GridNodes";
import { FloatingDots } from "./FloatingDots";

export function HeroBackground() {
  return (
    <div aria-hidden className="hero-bg-fx">
      <div className="hero-grid-fx">
        <div className="hero-orb orb-logo">
          <img src={p("/logo_small1.png")} alt="" className="logo-mark" />
        </div>
        <div className="hero-grid-lines" />
        <GridNodes />
        <FloatingDots />
      </div>
    </div>
  );
}
