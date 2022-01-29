import { useMemo, useState } from "react";
import {
  BLACK,
  changePlayer,
  getAvailablePlaces,
  getTurnedOver,
  initSquares,
  Player,
  reverse,
  SquareState,
  WHITE,
  YOU,
} from "../utils/game";
import { Board } from "./Board";
import { Button } from "./Button";
import { Stone } from "./Stone";

function App() {
  const [squares, setSquares] = useState<SquareState[][]>(initSquares);
  const [player, setPlayer] = useState<Player>(YOU);
  const [isEnd, setIsEnd] = useState(false);
  const [whiteCounts, setWhiteCounts] = useState(0);
  const [blackCounts, setBlackCounts] = useState(0);

  const availableSquares = getAvailablePlaces(squares, player.stone);

  const handleReset = () => {
    setIsEnd(false);
    setSquares(initSquares);
  };

  const change = () => {
    setPlayer((p) => changePlayer(p));
  };

  const handlePutStone = (line: number, column: number) => {
    const turned = getTurnedOver(squares, {
      line,
      column,
      stone: player.stone,
    });
    const placed = turned.map((ss, index) => {
      if (index === line) {
        return ss.map((s, index2) => {
          if (index2 === column) {
            return player.stone;
          }
          return s;
        });
      }
      return ss;
    });

    setSquares(placed);

    setBlackCounts(
      placed.reduce((p, c) => p + c.filter((s) => s === BLACK).length, 0)
    );
    setWhiteCounts(
      placed.reduce((p, c) => p + c.filter((s) => s === WHITE).length, 0)
    );

    // 次のプレイヤーが置く場所がなければプレイヤーチェンジしない
    if (getAvailablePlaces(placed, reverse(player.stone)).length === 0) {
      // 今のプレイヤーも置く場所がなければゲーム終了
      if (getAvailablePlaces(placed, player.stone).length === 0) {
        alert("ゲーム終了");
        setIsEnd(true);
        return;
      }
    } else {
      change();
    }
  };

  const winOrLoseStatus = useMemo(() => {
    if (whiteCounts > blackCounts) {
      return WHITE;
    } else if (blackCounts > whiteCounts) {
      return BLACK;
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
              <Stone className="ml-3 h-[30px] w-[30px]" type={player.stone} />
            </>
          )}
        </div>
        <Board
          className="m-auto mt-5"
          squares={squares}
          availableSquares={availableSquares}
          onPutStone={handlePutStone}
        />
        <Button className="m-auto mt-3" onClick={handleReset}>
          Reset
        </Button>
      </div>
    </div>
  );
}

export default App;
