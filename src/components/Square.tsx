import { SquareState } from "../utils/game";
import { Stone } from "./Stone";

export const Square: React.VFC<{
  className?: string;
  square: SquareState;
  line: number;
  column: number;
  availableSquares: { line: number; column: number }[];
  onPutStone: (line: number, column: number) => void;
}> = ({ className, square, line, column, availableSquares, onPutStone }) => {
  const canPlace = !!availableSquares.find(
    (o) => o.line === line && o.column === column
  );

  const handleClick = () => {
    if (canPlace) {
      onPutStone(line, column);
    }
  };

  return (
    <div
      className={`flex h-10 
        w-10 items-center justify-center border-t-2 border-l-2 border-stone-900 duration-75 
        ${canPlace && "bg-yellow-300 hover:bg-yellow-400"}    
        ${line === 0 && "border-t-0"} 
        ${column === 0 && "border-l-0"}  
        ${className}`}
      onClick={handleClick}
    >
      <Stone className="h-[80%] w-[80%]" type={square} />
    </div>
  );
};
