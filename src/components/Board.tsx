import { SquareData } from "../utils/game";
import { Square } from "./Square";

export const Board: React.VFC<{
  squares: SquareData[][];
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
