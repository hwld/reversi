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

export const getVector = (
  dir: Direction
): { lineVec: number; columnVec: number } => {
  let lineVec, columnVec;
  switch (dir) {
    case "up": {
      [lineVec, columnVec] = [-1, 0];
      break;
    }
    case "rightUp": {
      [lineVec, columnVec] = [-1, 1];
      break;
    }
    case "right": {
      [lineVec, columnVec] = [0, 1];
      break;
    }
    case "rightDown": {
      [lineVec, columnVec] = [1, 1];
      break;
    }
    case "down": {
      [lineVec, columnVec] = [1, 0];
      break;
    }
    case "leftDown": {
      [lineVec, columnVec] = [1, -1];
      break;
    }
    case "left": {
      [lineVec, columnVec] = [0, -1];
      break;
    }
    case "leftUp": {
      [lineVec, columnVec] = [-1, -1];
      break;
    }
  }
  return { lineVec, columnVec };
};
