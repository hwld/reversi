import { direction, Direction, getVector } from "./direction";

export const BLACK = "black";
export const WHITE = "white";
type Black = typeof BLACK;
type White = typeof WHITE;
export type Stone = Black | White;

export const EMPTY = "empty";
export type Empty = typeof EMPTY;
export type SquareState = Stone | Empty;
export type Squares = SquareState[][];

export const COLUMNS = ["A", "B", "C", "D", "E", "F", "G", "H"] as const;
export const LINES = ["1", "2", "3", "4", "5", "6", "7", "8"] as const;

type Position = { line: number; column: number };

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

export const calcNextPlayer = (player: Player): Player => {
  if (player.stone === YOU.stone) {
    return CPU;
  } else if (player.stone === CPU.stone) {
    return YOU;
  } else {
    return player;
  }
};

export const initSquares = (): Squares => {
  const squares: Squares = [...new Array(8)].map((_) =>
    [...new Array(8)].map(() => EMPTY)
  );
  squares[3][3] = squares[4][4] = WHITE;
  squares[3][4] = squares[4][3] = BLACK;
  return squares;
};

// lineとcolumnの位置に石がないことが前提
//
const canSandwich = (
  squares: Squares,
  pos: Position,
  stone: Stone,
  dir: Direction
) => {
  const { line, column } = pos;
  const { lineVec, columnVec } = getVector(dir);

  // 盤外が指定されたらfalseを返す
  if (!isOnBoard(pos)) {
    return false;
  }

  // playerまたはemptyでなければ
  if (squares[line][column] !== EMPTY) {
    return false;
  }

  let tmpLine = line + lineVec;
  let tmpColumn = column + columnVec;
  //盤外
  if (!isOnBoard({ line: tmpLine, column: tmpColumn })) {
    return false;
  }
  //隣が渡された石の裏ではない
  if (!(squares[tmpLine][tmpColumn] === reverse(stone))) {
    return false;
  }

  // 盤上にある限り
  while (isOnBoard({ line: tmpLine, column: tmpColumn })) {
    // 渡された石が見つかったら配置可能
    if (squares[tmpLine][tmpColumn] === stone) {
      return true;
    } else if (squares[tmpLine][tmpColumn] === EMPTY) {
      return false;
    }
    tmpLine += lineVec;
    tmpColumn += columnVec;
  }
  return false;
};

// 石を置けるか
const canPlace = (
  squares: Squares,
  { line, column }: Position,
  stone: Stone
) => {
  // いずれかの方向に挟むことができれば置ける
  return direction.some((dir) => {
    return canSandwich(squares, { line, column }, stone, dir);
  });
};

// Squareにidもたせたほうがわかりやすい？
// TODO: いろんな関数にplayer渡してるけど、石の種類にしたほうが意図が明確だと思う。
export const getAvailablePlaces = (
  squares: Squares,
  stone: Stone
): Position[] => {
  const places = [];
  for (let line = 0; line < 8; line++) {
    for (let column = 0; column < 8; column++) {
      if (canPlace(squares, { line, column }, stone)) {
        places.push({ line, column });
      }
    }
  }

  return places;
};

// 新たに石が置かれたときに、結果となる盤面を返す
export const placeStone = (
  squares: Squares,
  newStone: { line: number; column: number; stone: Stone }
): Squares => {
  const { line, column, stone } = newStone;

  // 裏返す石
  const target: Position[] = [];
  direction.forEach((dir) => {
    target.push(
      ...getSquareToTurnOverInOneDir(squares, { line, column, stone }, dir)
    );
  });

  // 対象となる石を反転させる
  const turned = squares.map((ss, line) => {
    return ss.map((s, column) => {
      if (
        s !== EMPTY &&
        target.find((t) => t.line === line && t.column === column)
      ) {
        return reverse(s);
      }
      return s;
    });
  });

  // 石を配置する
  const placed = turned.map((ss, index) => {
    if (index === line) {
      return ss.map((s, index2) => {
        if (index2 === column) {
          return stone;
        }
        return s;
      });
    }
    return ss;
  });

  return placed;
};

// 一つの方向にひっくり返した結果を返す
// 指定された箇所に置くことが出来なければ空の配列を返す
const getSquareToTurnOverInOneDir = (
  squares: Squares,
  newStone: { line: number; column: number; stone: Stone },
  dir: Direction
): Position[] => {
  const { line, column, stone } = newStone;

  // 指定された方向に挟めなければ何もしない
  if (!canSandwich(squares, { line, column }, stone, dir)) {
    return [];
  }

  const { lineVec, columnVec } = getVector(dir);
  let tmpLine = line + lineVec;
  let tmpColumn = column + columnVec;
  const targets: Position[] = [];
  // 挟めることが前提
  while (squares[tmpLine][tmpColumn] !== stone) {
    targets.push({ line: tmpLine, column: tmpColumn });
    tmpLine += lineVec;
    tmpColumn += columnVec;
  }

  return targets;
};

export const isOnBoard = ({ line, column }: Position) => {
  return line >= 0 && line < 8 && column >= 0 && column < 8;
};
