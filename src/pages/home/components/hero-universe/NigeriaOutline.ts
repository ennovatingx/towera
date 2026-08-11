/**
 * A coarse, hand-authored approximation of Nigeria's silhouette in the same
 * normalized [-1,1] x/y space used for node positions — NOT traced from real
 * GIS/border data (none was available to source here). It's meant to read as
 * "a stylized map of Nigeria" for a premium/futuristic backdrop, not to be
 * geographically precise. Swap this for a real simplified boundary dataset
 * if cartographic accuracy ever matters.
 */
export const NIGERIA_OUTLINE_POINTS: Array<[number, number]> = [
  [-0.82, -0.88],
  [-0.5, -0.92],
  [-0.1, -0.9],
  [0.35, -0.86],
  [0.7, -0.8],
  [0.88, -0.6],
  [0.92, -0.3],
  [0.88, -0.02],
  [0.78, 0.18],
  [0.82, 0.42],
  [0.7, 0.62],
  [0.5, 0.78],
  [0.28, 0.72],
  [0.05, 0.66],
  [-0.15, 0.7],
  [-0.35, 0.6],
  [-0.55, 0.68],
  [-0.75, 0.5],
  [-0.85, 0.2],
  [-0.9, -0.15],
  [-0.88, -0.5],
  [-0.82, -0.88],
];
