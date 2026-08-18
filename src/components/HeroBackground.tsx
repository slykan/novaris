import { RotatingMesh } from "./RotatingMesh";
import { FloatingDots } from "./FloatingDots";
import { nPoints, nEdges } from "@/lib/shapes3d";

export function HeroBackground() {
  return (
    <div aria-hidden className="hero-bg-fx">
      <FloatingDots />

      <RotatingMesh
        points={nPoints}
        edges={nEdges}
        size={340}
        speed={0.22}
        showPoints={false}
        className="hero-mesh hero-mesh-n"
      />
    </div>
  );
}
