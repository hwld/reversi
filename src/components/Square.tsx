import { SquareData } from "../utils/game";
import { Stone } from "./Stone";

export const Square: React.VFC<{
  square: SquareData;
  canPlace: boolean;
  onPutStone: () => void;
}> = ({ square, canPlace, onPutStone }) => {
  const handleClick = () => {
    if (canPlace) {
      onPutStone();
    }
  };

  return (
    <div
      className={`h-10 w-10 ${
        canPlace ? "bg-yellow-300" : "bg-green-700"
      } border  border-stone-800 flex justify-center items-center`}
      onClick={handleClick}
    >
      <Stone className="w-[80%] h-[80%]" type={square} />
    </div>
  );
};
