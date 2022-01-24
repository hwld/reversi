export const vector = [
  "up",
  "rightUp",
  "right",
  "rightDown",
  "down",
  "leftDown",
  "left",
  "leftUp",
] as const;

export type Vector = typeof vector[number];

export const getVector = (vec: Vector) => {
  let vecLine, vecColumn;
  switch (vec) {
    case "up": {
      [vecLine, vecColumn] = [-1, 0];
      break;
    }
    case "rightUp": {
      [vecLine, vecColumn] = [-1, 1];
      break;
    }
    case "right": {
      [vecLine, vecColumn] = [0, 1];
      break;
    }
    case "rightDown": {
      [vecLine, vecColumn] = [1, 1];
      break;
    }
    case "down": {
      [vecLine, vecColumn] = [1, 0];
      break;
    }
    case "leftDown": {
      [vecLine, vecColumn] = [1, -1];
      break;
    }
    case "left": {
      [vecLine, vecColumn] = [0, -1];
      break;
    }
    case "leftUp": {
      [vecLine, vecColumn] = [-1, -1];
      break;
    }
  }
  return { vecLine, vecColumn };
};
