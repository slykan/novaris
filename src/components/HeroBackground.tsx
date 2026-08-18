import { RotatingMesh } from "./RotatingMesh";
import { FloatingDots } from "./FloatingDots";
import { pyramidPoints, pyramidEdges, cubePoints, cubeEdges, meshPoints, meshEdges } from "@/lib/shapes3d";

export function HeroBackground() {
  return (
    <div aria-hidden className="hero-bg-fx">
      <FloatingDots />

      <RotatingMesh
        points={pyramidPoints}
        edges={pyramidEdges}
        size={150}
        speed={0.35}
        className="hero-mesh hero-mesh-1"
      />
      <RotatingMesh
        points={cubePoints}
        edges={cubeEdges}
        size={190}
        speed={0.28}
        reverse
        className="hero-mesh hero-mesh-2"
      />
      <RotatingMesh
        points={meshPoints}
        edges={meshEdges}
        size={230}
        speed={0.22}
        className="hero-mesh hero-mesh-3"
      />
    </div>
  );
}
