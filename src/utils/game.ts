import { direction, Direction, getDirectionValue } from "./direction";

export const BLACK = "black";
export const WHITE = "white";
type Black = typeof BLACK;
type White = typeof WHITE;
type Stone = Black | White;

export const EMPTY = "empty";
export type Empty = typeof EMPTY;
export type SquareState = Stone | Empty;

const COLUMNS = ["A", "B", "C", "D", "E", "F", "G"] as const;
const LINES = ["1", "2", "3", "4", "5", "6", "7", "8"] as const;
type Column = typeof COLUMNS[number];
type Line = typeof LINES[number];
type Position = `${Column}${Line}`;

const asPosition = (column: Column, line: Line): Position => {
  return `${column}${line}`;
};
const asColumnAndLine = (
  position: Position
): { column: Column; line: Line } => {
  return { column: position[0] as Column, line: position[1] as Line };
};

export type Player = { stone: Stone };
export const YOU: Player = { stone: BLACK } as const;
export const CPU: Player = { stone: WHITE } as const;

export const reverse = (stone: Stone): Stone => {
  if (stone === WHITE) {
    return BLACK;
  } else {
    return WHITE;
  }
};

export const changePlayer = (player: Player): Player => {
  if (player.stone === YOU.stone) {
    return CPU;
  } else if (player.stone === CPU.stone) {
    return YOU;
  } else {
    return player;
  }
};

export const initSquares = (): SquareState[][] => {
  const squares: SquareState[][] = [...new Array(8)].map((_) =>
    [...new Array(8)].map(() => EMPTY)
  );
  squares[3][3] = squares[4][4] = WHITE;
  squares[3][4] = squares[4][3] = BLACK;
  return squares;
};

const canSandwich = (
  squares: SquareState[][],
  line: number,
  column: number,
  stone: Stone,
  dir: Direction
) => {
  const { lineDir, columnDir } = getDirectionValue(dir);

  if (!isOnBoard(line, column)) {
    return false;
  }
  // playerまたはemptyでなければ
  if (squares[line][column] !== EMPTY) {
    return false;
  }

  let tmpLine = line + lineDir;
  let tmpColumn = column + columnDir;
  //盤外
  if (!isOnBoard(tmpLine, tmpColumn)) {
    return false;
  }
  //隣が渡された石の裏ではない
  if (!(squares[tmpLine][tmpColumn] === reverse(stone))) {
    return false;
  }

  // 盤上にある限り
  while (isOnBoard(tmpLine, tmpColumn)) {
    // 渡された石が見つかったら配置可能
    if (squares[tmpLine][tmpColumn] === stone) {
      return true;
    } else if (squares[tmpLine][tmpColumn] === EMPTY) {
      return false;
    }
    tmpLine += lineDir;
    tmpColumn += columnDir;
  }
  return false;
};

// 石を置けるか
const canPlace = (
  squares: SquareState[][],
  line: number,
  column: number,
  stone: Stone
) => {
  // いずれかの方向に挟むことができれば置ける
  return direction.some((dir) => {
    return canSandwich(squares, line, column, stone, dir);
  });
};

// Squareにidもたせたほうがわかりやすい？
// TODO: いろんな関数にplayer渡してるけど、石の種類にしたほうが意図が明確だと思う。
export const getAvailablePlaces = (
  squares: SquareState[][],
  stone: Stone
): { line: number; column: number }[] => {
  const places = [];
  for (let line = 0; line < 8; line++) {
    for (let column = 0; column < 8; column++) {
      if (canPlace(squares, line, column, stone)) {
        places.push({ line, column });
      }
    }
  }

  return places;
};

// 新たに石が置かれたときに、結果となる盤面を返す
export const getTurnedOver = (
  squares: SquareState[][],
  newStone: { line: number; column: number; stone: Stone }
): SquareState[][] => {
  const { line, column, stone } = newStone;

  // 裏返す石
  const target: { line: number; column: number }[] = [];
  direction.forEach((dir) => {
    target.push(
      ...getSquareToTurnOverInOneDir(squares, { line, column, stone }, dir)
    );
  });

  return squares.map((ss, line) => {
    return ss.map((s, column) => {
      // 対象となる石を反転させる
      if (
        s !== EMPTY &&
        target.find((t) => t.line === line && t.column === column)
      ) {
        return reverse(s);
      }
      return s;
    });
  });
};

// 一つの方向にひっくり返した結果を返す
const getSquareToTurnOverInOneDir = (
  squares: SquareState[][],
  newStone: { line: number; column: number; stone: Stone },
  dir: Direction
): { line: number; column: number }[] => {
  const { line, column, stone } = newStone;

  // 指定された方向に挟めなければ何もしない
  if (!canSandwich(squares, line, column, stone, dir)) {
    return [];
  }

  const targets: { line: number; column: number }[] = [];
  const { lineDir, columnDir } = getDirectionValue(dir);
  let tmpLine = line + lineDir;
  let tmpColumn = column + columnDir;
  // TODO: getDirectionValueではなく、getVectorにして、距離を渡すだけにする。
  while (squares[tmpLine][tmpColumn] !== stone) {
    targets.push({ line: tmpLine, column: tmpColumn });
    tmpLine += lineDir;
    tmpColumn += columnDir;
  }

  return targets;
};

export const isOnBoard = (line: number, column: number) => {
  return line >= 0 && line < 8 && column >= 0 && column < 8;
};
