import { useGame } from "../hooks/useGame";
import { COLUMNS, EMPTY, LINES } from "../utils/game";
import { Board } from "./Board";
import { BoardStatus } from "./BoardStatus";
import { Button } from "./Button";
import { Stone } from "./Stone";

function App() {
  const { history, current, setStone, resetGame, changeCurrent } = useGame();

  return (
    <div className="flex h-screen w-auto justify-center overflow-y-hidden  bg-stone-300">
      <div className="mt-16 flex p-3">
        <div className="p-3">
          <BoardStatus state={history[current]} />
          <Board
            state={history[current]}
            className="m-auto mt-5"
            onSetStone={setStone}
          />
          <Button
            className="m-auto mt-3 justify-center hover:bg-yellow-300 active:bg-yellow-400"
            onClick={resetGame}
          >
            Reset
          </Button>
        </div>
        <div className="ml-5 flex h-2/3 flex-col">
          <p className="flex-grow-0 text-center text-3xl font-bold">History</p>
          <div className="mt-1 flex-grow overflow-x-hidden overflow-y-scroll border-2 border-stone-900 p-3">
            {history.map(
              (
                {
                  lastPlacedStone: {
                    line: placedLine,
                    column: placedColumn,
                    player,
                  },
                },
                i
              ) => {
                return (
                  <div
                    key={i}
                    className={`${i === current ? "bg-yellow-300" : ""}`}
                  >
                    <Button
                      className={`hover:bg-black-alpha-1 active:bg-black-alpha-2 mt-1 flex w-[12rem] items-center accent-orange-800/25`}
                      onClick={() => changeCurrent(i)}
                    >
                      <Stone
                        className="h-5 w-5"
                        type={i === 0 ? EMPTY : player.stone}
                      ></Stone>
                      <p className={`ml-1`}>
                        {i === 0
                          ? "初期状態"
                          : `${i}手目: ${COLUMNS[placedColumn]}${LINES[placedLine]}`}
                      </p>
                    </Button>
                  </div>
                );
              }
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
