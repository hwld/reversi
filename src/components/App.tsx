import { useCallback, useMemo, useState } from "react";
import {
  black,
  empty,
  initSquares,
  isOnBoard,
  Player,
  SquareData,
} from "../utils/game";
import { getVector, Vector, vector } from "../utils/vector";
import { Board } from "./Board";

function App() {
  const [squares, setSquares] = useState<SquareData[][]>(initSquares);
  const [player, setPlayer] = useState<Player>(black);

  const turnStones = (line: number, column: number, vec: Vector) => {
    // ひっくり返すlineとcolumnを求める
    let targets: { line: number; column: number }[] = [];
    const { vecLine, vecColumn } = getVector(vec);

    let tmpLine = line + vecLine;
    let tmpColumn = column + vecColumn;
    // 盤上に必ずplayerの石があることが前提
    // あとでどうにかしたい
    // ていうか全体的にコードがぐちゃぐちゃで泣きたくなってきた
    while (squares[tmpLine][tmpColumn] === !player) {
      targets.push({ line: tmpLine, column: tmpColumn });
      tmpLine += vecLine;
      tmpColumn += vecColumn;
    }

    setSquares((squares) => {
      return squares.map((ss, line) => {
        return ss.map((s, column) => {
          if (targets.find((t) => t.line === line && t.column === column)) {
            return !s;
          }
          return s;
        });
      });
    });
  };

  const onReset = () => {
    setSquares(initSquares);
  };

  const canPlace = useCallback(
    (line: number, column: number, vec: Vector) => {
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
    },
    [squares, player]
  );

  const availableSquares = useMemo((): {
    line: number;
    column: number;
  }[] => {
    return squares
      .map((ss, line) => {
        return ss
          .map((_, column) => {
            if (
              vector.some((vec) => {
                return canPlace(line, column, vec);
              })
            ) {
              return { line, column };
            }
            return { line: -1, column: -1 };
          })
          .filter((o) => o.line !== -1);
      })
      .flat();
  }, [squares, canPlace]);

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

    // ひっくり返す
    vector.forEach((vec) => {
      if (canPlace(line, column, vec)) {
        turnStones(line, column, vec);
      }
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
      <button
        className="m-auto block font-bold text-lg text-stone-800 bg-emerald-400 hover:bg-emerald-500 active:bg-emerald-600 px-2 py-2 rounded-full w-[120px] mt-3"
        onClick={onReset}
      >
        リセット
      </button>
    </div>
  );
}

export default App;
