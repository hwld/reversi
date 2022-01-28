import { SquareData } from "../utils/game";
import { Square } from "./Square";

export const Board: React.VFC<{
  squares: SquareData[][];
  availableSquares: { line: number; column: number }[];
  className?: string;
  onPutStone: (line: number, column: number) => void;
}> = ({ squares, className, onPutStone, availableSquares }) => {
  return (
    <div className={`w-fit  border-stone-900 ${className}`}>
      {[...new Array(8)].map((_, line) => {
        return (
          <div key={`${line}`} className="flex">
            {[...new Array(8)].map((_, column) => {
              return (
                <Square
                  className={` border-t-2 border-l-2 border-stone-900 ${
                    line === 0 && "border-t-0"
                  } ${column === 0 && "border-l-0"}`}
                  key={`${line}-${column}`}
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
