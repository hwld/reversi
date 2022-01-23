import { useMemo, useState } from "react";
import "./App.css";

const black: Black = true;
const white: White = false;
const empty: Empty = null;
type Black = true;
type White = false;
type Empty = null;
type Square = Black | White | Empty;
type Player = White | Black;

const initSquares = (): Square[][] => {
  const squares: Square[][] = [...new Array(8)].map((_) =>
    [...new Array(8)].map((s) => empty)
  );
  squares[3][3] = squares[4][4] = white;
  squares[3][4] = squares[4][3] = black;
  return squares;
};

const isOnBoard = (line: number, column: number) => {
  return line >= 0 && line < 8 && column >= 0 && column < 8;
};

const Square: React.VFC<{
  square: Square;
  canPlace: boolean;
  onPutStone: () => void;
}> = ({ square, canPlace, onPutStone }) => {
  return (
    <div
      className={`h-10 w-10 ${
        canPlace ? "bg-yellow-300" : "bg-green-700"
      } border  border-stone-800 flex justify-center items-center`}
      onClick={onPutStone}
    >
      <div
        className={`rounded-full w-[80%] h-[80%] ${
          square === white
            ? "bg-stone-100"
            : square === black
            ? "bg-stone-800"
            : ""
        } `}
      ></div>
    </div>
  );
};

const Board: React.VFC<{
  squares: Square[][];
  availableSquares: { line: number; column: number }[];
  className?: string;
  onPutStone: (line: number, column: number) => void;
}> = ({ squares, className, onPutStone, availableSquares }) => {
  return (
    <div className={`w-fit ${className}`}>
      {[...new Array(8)].map((_, line) => {
        return (
          <div className="flex">
            {[...new Array(8)].map((_, column) => {
              return (
                <Square
                  square={squares[line][column]}
                  canPlace={
                    availableSquares.find(
                      (o) => o.line === line && o.column === column
                    )
                      ? true
                      : false
                  }
                  onPutStone={() => {
                    onPutStone(line, column);
                  }}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

function App() {
  const [squares, setSquares] = useState<Square[][]>(initSquares);
  const [player, setPlayer] = useState<Player>(black);

  const availableSquares = useMemo((): {
    line: number;
    column: number;
  }[] => {
    const canPlace = (
      line: number,
      column: number,
      vecLine: number,
      vecColumn: number
    ) => {
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

    return squares
      .map((ss, line) => {
        return ss
          .map((_, column) => {
            if (
              canPlace(line, column, -1, +0) || // 上
              canPlace(line, column, -1, +1) || // 右上
              canPlace(line, column, +0, +1) || // 右
              canPlace(line, column, +1, +1) || // 右下
              canPlace(line, column, +1, +0) || // 下
              canPlace(line, column, +1, -1) || // 左下
              canPlace(line, column, +0, -1) || // 左
              canPlace(line, column, -1, -1) // 左上
            ) {
              return { line, column };
            }
            return { line: -1, column: -1 };
          })
          .filter((o) => o.line !== -1);
      })
      .flat();
  }, [squares, player]);

  const changePlayer = () => {
    setPlayer((p) => !p);
  };

  const handlePutStone = (line: number, column: number) => {
    setSquares((squares) => {
      return squares.map((ss, index) => {
        if (index === line) {
          return ss.map((s, index2) => {
            if (index2 === column) {
              return player;
            }
            return s;
          });
        }
        return ss;
      });
    });
    changePlayer();
  };

  return (
    <div className="h-screen overflow-hidden bg-stone-200">
      <Board
        className="m-auto mt-10"
        squares={squares}
        availableSquares={availableSquares}
        onPutStone={handlePutStone}
      />
      <button className="m-auto block font-bold text-lg text-stone-800 bg-emerald-400 hover:bg-emerald-500 active:bg-emerald-600 px-2 py-2 rounded-full w-[120px] mt-3">
        リセット
      </button>
    </div>
  );
}

export default App;
