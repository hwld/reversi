export const direction = [
  "up",
  "rightUp",
  "right",
  "rightDown",
  "down",
  "leftDown",
  "left",
  "leftUp",
] as const;

export type Direction = typeof direction[number];

export const getDirectionValue = (
  dir: Direction
): { lineDir: number; columnDir: number } => {
  let lineDir, columnDir;
  switch (dir) {
    case "up": {
      [lineDir, columnDir] = [-1, 0];
      break;
    }
    case "rightUp": {
      [lineDir, columnDir] = [-1, 1];
      break;
    }
    case "right": {
      [lineDir, columnDir] = [0, 1];
      break;
    }
    case "rightDown": {
      [lineDir, columnDir] = [1, 1];
      break;
    }
    case "down": {
      [lineDir, columnDir] = [1, 0];
      break;
    }
    case "leftDown": {
      [lineDir, columnDir] = [1, -1];
      break;
    }
    case "left": {
      [lineDir, columnDir] = [0, -1];
      break;
    }
    case "leftUp": {
      [lineDir, columnDir] = [-1, -1];
      break;
    }
  }
  return { lineDir, columnDir };
};
