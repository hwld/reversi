import { BoardState } from "../hooks/useGame";
import { COLUMNS, LINES } from "../utils/game";
import { Square } from "./Square";

export const Board: React.VFC<{
  state: BoardState;
  className?: string;
  onSetStone: (line: number, column: number) => void;
}> = ({
  state: { squares, availableSquares, lastPlacedStone },
  className,
  onSetStone,
}) => {
  return (
    <div className={`w-fit ${className}`}>
      <div className="flex">
        {[...new Array(9)].map((_, line) => {
          return (
            <div
              key={line}
              className="flex h-12 w-12 items-center justify-center text-xl font-bold"
            >
              {line === 0 ? "" : COLUMNS[line - 1]}
            </div>
          );
        })}
      </div>
      {[...new Array(8)].map((_, line) => {
        return (
          <div key={`${line}`} className="flex">
            <div className="flex h-12 w-12 items-center justify-center text-xl font-bold">
              {LINES[line]}
            </div>
            {[...new Array(8)].map((_, column) => {
              return (
                <Square
                  key={`${line}${column}`}
                  line={line}
                  column={column}
                  square={squares[line][column]}
                  availableSquares={availableSquares}
                  lastPlacedStone={lastPlacedStone}
                  onSetStone={onSetStone}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
};
