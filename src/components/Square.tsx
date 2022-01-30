import { SquareState } from "../utils/game";
import { Stone } from "./Stone";

export const Square: React.VFC<{
  className?: string;
  square: SquareState;
  line: number;
  column: number;
  availableSquares: { line: number; column: number }[];
  lastPlacedStone: { line: number; column: number };
  onSetStone: (line: number, column: number) => void;
}> = ({
  className,
  square,
  line,
  column,
  availableSquares,
  lastPlacedStone,
  onSetStone,
}) => {
  const canPlace = !!availableSquares.find(
    (o) => o.line === line && o.column === column
  );

  const isLastPlacedStone =
    lastPlacedStone.line === line && lastPlacedStone.column === column;

  const handleClick = () => {
    if (canPlace) {
      onSetStone(line, column);
    }
  };

  return (
    <div
      className={`flex h-12
        w-12 items-center justify-center border-t-2 border-l-2 border-stone-900 duration-75 
        ${canPlace && "bg-yellow-300 hover:bg-yellow-400"}  
        ${isLastPlacedStone && "bg-blue-300"}  
        ${line === 0 && "border-t-0"} 
        ${column === 0 && "border-l-0"}  
        ${className}`}
      onClick={handleClick}
    >
      <Stone className={`h-[35px] w-[35px]`} type={square} />
    </div>
  );
};
