import { SquareState } from "../utils/game";
import { Square } from "./Square";

export const Board: React.VFC<{
  squares: SquareState[][];
  availableSquares: { line: number; column: number }[];
  className?: string;
  onPutStone: (line: number, column: number) => void;
}> = ({ squares, className, onPutStone, availableSquares }) => {
  return (
    <div className={`w-fit ${className}`}>
      {[...new Array(8)].map((_, line) => {
        return (
          <div key={`${line}`} className="flex">
            {[...new Array(8)].map((_, column) => {
              return (
                <Square
                  key={`${line}${column}`}
                  line={line}
                  column={column}
                  square={squares[line][column]}
                  availableSquares={availableSquares}
                  onPutStone={onPutStone}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
};
