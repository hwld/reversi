import { useState } from "react";
import {
  black,
  getAvailablePlaces,
  getTurnedOver,
  initSquares,
  Player,
  SquareData,
} from "../utils/game";
import { Board } from "./Board";

function App() {
  const [squares, setSquares] = useState<SquareData[][]>(initSquares);
  const [player, setPlayer] = useState<Player>(black);

  const availableSquares = getAvailablePlaces(squares, player);

  const onReset = () => {
    setSquares(initSquares);
  };

  const changePlayer = () => {
    setPlayer((p) => !p);
  };

  const handlePutStone = (line: number, column: number) => {
    const turnedSquares = getTurnedOver(squares, { line, column, player });
    setSquares(
      turnedSquares.map((ss, index) => {
        if (index === line) {
          return ss.map((s, index2) => {
            if (index2 === column) {
              return player;
            }
            return s;
          });
        }
        return ss;
      })
    );

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
