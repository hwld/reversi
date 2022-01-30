import { useGame } from "../hooks/useGame";
import { calcNextPlayer, COLUMNS, LINES } from "../utils/game";
import { Board } from "./Board";
import { BoardStatus } from "./BoardStatus";
import { Button } from "./Button";
import { Stone } from "./Stone";

function App() {
  const { history, current, setStone, resetGame, changeCurrent } = useGame();
  const { squares, availableSquares } = history[current];

  return (
    <div className="min-h-screen justify-center overflow-hidden bg-stone-300 ">
      <div className="mt-32 h-fit">
        <BoardStatus state={history[current]} />
        <Board
          className="m-auto mt-5"
          squares={squares}
          availableSquares={availableSquares}
          onSetStone={setStone}
        />
        <Button className="m-auto mt-3" onClick={resetGame}>
          Reset
        </Button>
      </div>
      <div className="m-auto mt-10 w-fit">
        {history.map(
          (
            {
              lastPlacedPosition: { line: placedLine, column: placedColumn },
              nextPlayer,
            },
            i
          ) => {
            if (i === 0) {
              return (
                <Button
                  className={`mt-1 w-[12rem] ${
                    i === current && "bg-stone-400"
                  }`}
                  onClick={() => changeCurrent(i)}
                >{`初期状態`}</Button>
              );
            }
            return (
              <Button
                className={`mt-1 w-[12rem] ${
                  i === current && "bg-stone-400"
                } flex items-center`}
                onClick={() => changeCurrent(i)}
              >
                <Stone
                  className="h-5 w-5"
                  type={calcNextPlayer(nextPlayer).stone}
                ></Stone>
                <p className="ml-1">
                  {`${Math.round(i / 2)}手目: ${COLUMNS[placedColumn]}${
                    LINES[placedLine]
                  }`}
                </p>
              </Button>
            );
          }
        )}
      </div>
    </div>
  );
}

export default App;
