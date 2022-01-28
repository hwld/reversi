import { SquareData } from "../utils/game";
import { Stone } from "./Stone";

export const Square: React.VFC<{
  className?: string;
  square: SquareData;
  canPlace: boolean;
  onPutStone: () => void;
}> = ({ className, square, canPlace, onPutStone }) => {
  const handleClick = () => {
    if (canPlace) {
      onPutStone();
    }
  };

  return (
    <div
      className={`h-10 w-10 ${
        canPlace && "bg-yellow-300 hover:bg-yellow-400"
      }    flex items-center justify-center duration-75 ${className}`}
      onClick={handleClick}
    >
      <Stone className="h-[80%] w-[80%]" type={square} />
    </div>
  );
};
