import { getVector, Vector } from "./vector";

export const black: Black = true;
export const white: White = false;
export const empty: Empty = null;

export type Black = true;
export type White = false;
export type Empty = null;
export type SquareData = Black | White | Empty;
export type Player = White | Black;

export const initSquares = (): SquareData[][] => {
  const squares: SquareData[][] = [...new Array(8)].map((_) =>
    [...new Array(8)].map((s) => empty)
  );
  squares[3][3] = squares[4][4] = white;
  squares[3][4] = squares[4][3] = black;
  return squares;
};

// 石を置けるか
const canPlace = (
  squares: SquareData[][],
  line: number,
  column: number,
  player: Player,
  vec: Vector
) => {
  const { vecLine, vecColumn } = getVector(vec);

  if (!isOnBoard(line, column)) {
    return false;
  }
  if (squares[line][column] !== empty) {
    return false;
  }

  let tmpLine = line + vecLine;
  let tmpColumn = column + vecColumn;
  //盤外
  if (!isOnBoard(tmpLine, tmpColumn)) {
    return false;
  }
  //隣が相手の石ではない
  if (!(squares[tmpLine][tmpColumn] === !player)) {
    return false;
  }

  // 盤上にある限り
  while (isOnBoard(tmpLine, tmpColumn)) {
    // 自分の石が見つかったら配置可能
    if (squares[tmpLine][tmpColumn] === player) {
      return true;
    }
    tmpLine += vecLine;
    tmpColumn += vecColumn;
  }
  return false;
};

const getAvailablePlace = (squares: SquareData[], player: Player) => {};

export const isOnBoard = (line: number, column: number) => {
  return line >= 0 && line < 8 && column >= 0 && column < 8;
};
