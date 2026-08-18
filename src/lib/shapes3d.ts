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

// Novaris "N" mark — a folded ribbon (left stroke, diagonal, right stroke),
// each segment extruded front/back for depth. Mirrors the logo's diagonal N.
export const nPoints = [
  // left stroke — box (front 0-3, back 4-7)
  [-53, -30, -14], [-31, -30, -14], [-31, 58, -14], [-53, 58, -14],
  [-53, -30, 14], [-31, -30, 14], [-31, 58, 14], [-53, 58, 14],
  // right stroke — box (front 8-11, back 12-15)
  [31, -58, -14], [53, -58, -14], [53, 30, -14], [31, 30, -14],
  [31, -58, 14], [53, -58, 14], [53, 30, 14], [31, 30, 14],
  // diagonal stroke — box (front 16-19, back 20-23)
  [-48.4, -21.05, -14], [-35.6, -38.95, -14], [48.4, 21.05, -14], [35.6, 38.95, -14],
  [-48.4, -21.05, 14], [-35.6, -38.95, 14], [48.4, 21.05, 14], [35.6, 38.95, 14],
] as const;

export const nEdges = [
  [0, 1], [1, 2], [2, 3], [3, 0],
  [4, 5], [5, 6], [6, 7], [7, 4],
  [0, 4], [1, 5], [2, 6], [3, 7],

  [8, 9], [9, 10], [10, 11], [11, 8],
  [12, 13], [13, 14], [14, 15], [15, 12],
  [8, 12], [9, 13], [10, 14], [11, 15],

  [16, 17], [17, 18], [18, 19], [19, 16],
  [20, 21], [21, 22], [22, 23], [23, 20],
  [16, 20], [17, 21], [18, 22], [19, 23],
] as const;
