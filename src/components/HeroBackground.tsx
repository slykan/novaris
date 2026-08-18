import { RotatingMesh } from "./RotatingMesh";
import { FloatingDots } from "./FloatingDots";
import { NetworkGrid } from "./NetworkGrid";
import { nPoints, nEdges } from "@/lib/shapes3d";

export function HeroBackground() {
  return (
    <div aria-hidden className="hero-bg-fx">
      <NetworkGrid />
      <FloatingDots />

      <RotatingMesh
        points={nPoints}
        edges={nEdges}
        size={340}
        speed={0.5}
        swing={0.55}
        showPoints={false}
        className="hero-mesh hero-mesh-n"
      />
    </div>
  );
}
