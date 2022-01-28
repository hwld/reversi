import { useEffect, useMemo, useState } from "react";
import {
  black,
  getAvailablePlaces,
  getTurnedOver,
  initSquares,
  Player,
  SquareData,
  white,
} from "../utils/game";
import { Board } from "./Board";
import { Stone } from "./Stone";

function App() {
  const [squares, setSquares] = useState<SquareData[][]>(initSquares);
  const [player, setPlayer] = useState<Player>(black);
  const [isEnd, setIsEnd] = useState(false);
  const [whiteCounts, setWhiteCounts] = useState(0);
  const [blackCounts, setBlackCounts] = useState(0);

  const availableSquares = getAvailablePlaces(squares, player);

  useEffect(() => {}, []);

  const onReset = () => {
    setIsEnd(false);
    setSquares(initSquares);
  };

  const changePlayer = () => {
    setPlayer((p) => !p);
  };

  const handlePutStone = (line: number, column: number) => {
    const turned = getTurnedOver(squares, { line, column, player });
    const placed = turned.map((ss, index) => {
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

    setSquares(placed);

    setBlackCounts(
      placed.reduce((p, c) => p + c.filter((s) => s === black).length, 0)
    );
    setWhiteCounts(
      placed.reduce((p, c) => p + c.filter((s) => s === white).length, 0)
    );

    // 次のプレイヤーが置く場所がなければプレイヤーチェンジしない
    if (getAvailablePlaces(placed, !player).length === 0) {
      // 今のプレイヤーも置く場所がなければゲーム終了
      if (getAvailablePlaces(placed, player).length === 0) {
        alert("ゲーム終了");
        setIsEnd(true);
        return;
      }
    } else {
      changePlayer();
    }
  };

  const winOrLoseStatus = useMemo(() => {
    if (whiteCounts > blackCounts) {
      return white;
    } else if (blackCounts > whiteCounts) {
      return black;
    } else {
      return null;
    }
  }, [whiteCounts, blackCounts]);

  return (
    <div className="h-screen  justify-center overflow-hidden bg-stone-300 ">
      <div className="mt-32 h-fit">
        <div className="m-auto flex w-fit items-center">
          {isEnd ? (
            <>
              <p className="text-xl font-bold">Winner:</p>
              {winOrLoseStatus !== null ? (
                <Stone
                  className="ml-3 h-[30px] w-[30px]"
                  type={winOrLoseStatus}
                />
              ) : (
                <p className="ml-3 h-[30px] text-xl font-bold">Draw</p>
              )}
            </>
          ) : (
            <>
              <p className="text-xl font-bold">NextPlayer:</p>
              <Stone className="ml-3 h-[30px] w-[30px]" type={player} />
            </>
          )}
        </div>
        <Board
          className="m-auto mt-5"
          squares={squares}
          availableSquares={availableSquares}
          onPutStone={handlePutStone}
        />
        <button
          className="m-auto mt-3 block w-[100px]  border-2 border-stone-700 py-1 text-lg font-bold  text-stone-900 duration-200 hover:bg-yellow-300 active:bg-yellow-400"
          onClick={onReset}
        >
          Reset
        </button>
      </div>
    </div>
  );
}

export default App;
