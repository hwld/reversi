import { direction, Direction, getDirectionValue } from "./direction";

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

const canSandwich = (
  squares: SquareData[][],
  line: number,
  column: number,
  player: Player,
  dir: Direction
) => {
  const { lineDir, columnDir } = getDirectionValue(dir);

  if (!isOnBoard(line, column)) {
    return false;
  }
  // playerまたはemptyでなければ
  if (squares[line][column] !== empty) {
    return false;
  }

  let tmpLine = line + lineDir;
  let tmpColumn = column + columnDir;
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
    } else if (squares[tmpLine][tmpColumn] === empty) {
      return false;
    }
    tmpLine += lineDir;
    tmpColumn += columnDir;
  }
  return false;
};

// 石を置けるか
const canPlace = (
  squares: SquareData[][],
  line: number,
  column: number,
  player: Player
) => {
  // いずれかの方向に挟むことができれば置ける
  return direction.some((dir) => {
    return canSandwich(squares, line, column, player, dir);
  });
};

// Squareにidもたせたほうがわかりやすい？
// TODO: いろんな関数にplayer渡してるけど、石の種類にしたほうが意図が明確だと思う。
export const getAvailablePlaces = (
  squares: SquareData[][],
  player: Player
): { line: number; column: number }[] => {
  const places = [];
  for (let line = 0; line < 8; line++) {
    for (let column = 0; column < 8; column++) {
      if (canPlace(squares, line, column, player)) {
        places.push({ line, column });
      }
    }
  }

  return places;
};

// 新たに石が置かれたときに、結果となる盤面を返す
export const getTurnedOver = (
  squares: SquareData[][],
  newStone: { line: number; column: number; player: Player }
): SquareData[][] => {
  const { line, column, player } = newStone;

  // 裏返す石
  const target: { line: number; column: number }[] = [];
  direction.forEach((dir) => {
    target.push(
      ...getSquareToTurnOverInOneDir(squares, { line, column, player }, dir)
    );
  });

  return squares.map((ss, line) => {
    return ss.map((s, column) => {
      // 対象となる石を反転させる
      if (target.find((t) => t.line === line && t.column === column)) {
        return !s;
      }
      return s;
    });
  });
};

// 一つの方向にひっくり返した結果を返す
const getSquareToTurnOverInOneDir = (
  squares: SquareData[][],
  newStone: { line: number; column: number; player: Player },
  dir: Direction
): { line: number; column: number }[] => {
  const { line, column, player } = newStone;

  // 指定された方向に挟めなければ何もしない
  if (!canSandwich(squares, line, column, player, dir)) {
    return [];
  }

  const targets: { line: number; column: number }[] = [];
  const { lineDir, columnDir } = getDirectionValue(dir);
  let tmpLine = line + lineDir;
  let tmpColumn = column + columnDir;
  // TODO: getDirectionValueではなく、getVectorにして、距離を渡すだけにする。
  while (squares[tmpLine][tmpColumn] !== player) {
    targets.push({ line: tmpLine, column: tmpColumn });
    tmpLine += lineDir;
    tmpColumn += columnDir;
  }

  return targets;
};

export const isOnBoard = (line: number, column: number) => {
  return line >= 0 && line < 8 && column >= 0 && column < 8;
};
