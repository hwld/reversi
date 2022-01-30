import { COLUMNS, LINES, Squares } from "../utils/game";
import { Square } from "./Square";

export const Board: React.VFC<{
  squares: Squares;
  availableSquares: { line: number; column: number }[];
  className?: string;
  onSetStone: (line: number, column: number) => void;
}> = ({ squares, className, onSetStone, availableSquares }) => {
  return (
    <div className={`w-fit ${className}`}>
      <div className="flex">
        {[...new Array(9)].map((_, line) => {
          return (
            <div
              key={line}
              className="flex h-10 w-10 items-center justify-center text-xl font-bold"
            >
              {line === 0 ? "" : COLUMNS[line - 1]}
            </div>
          );
        })}
      </div>
      {[...new Array(8)].map((_, line) => {
        return (
          <div key={`${line}`} className="flex">
            <div className="flex h-10 w-10 items-center justify-center text-xl font-bold">
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
