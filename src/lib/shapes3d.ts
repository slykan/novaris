// Tetrahedron — apex + 3 base vertices, fully connected.
export const pyramidPoints = [
  [0, -56, 0],
  [52, 32, 30],
  [-52, 32, 30],
  [0, 32, -60],
] as const;
export const pyramidEdges = [
  [0, 1], [0, 2], [0, 3], [1, 2], [2, 3], [3, 1],
] as const;

// Cube — 8 corners, 12 edges.
export const cubePoints = [
  [-40, -40, -40], [40, -40, -40], [40, 40, -40], [-40, 40, -40],
  [-40, -40, 40], [40, -40, 40], [40, 40, 40], [-40, 40, 40],
] as const;
export const cubeEdges = [
  [0, 1], [1, 2], [2, 3], [3, 0],
  [4, 5], [5, 6], [6, 7], [7, 4],
  [0, 4], [1, 5], [2, 6], [3, 7],
] as const;

// Dense low-poly "globe" mesh — top/bottom pole + hexagonal ring, triangulated.
export const meshPoints = [
  [0, -60, 0],
  [0, 60, 0],
  [52, 0, 0], [26, 0, 45], [-26, 0, 45],
  [-52, 0, 0], [-26, 0, -45], [26, 0, -45],
] as const;
export const meshEdges = [
  [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [0, 7],
  [1, 2], [1, 3], [1, 4], [1, 5], [1, 6], [1, 7],
  [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 2],
] as const;
