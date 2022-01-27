import { black, SquareData, white } from "../utils/game";

export const Stone: React.VFC<{ type: SquareData; className?: string }> = ({
  type,
  className,
}) => {
  return (
    <div
      className={`rounded-full 
      ${type === white && "bg-stone-100 border-2 border-stone-800"}
      ${type === black && "bg-stone-800"} 
      ${className}
      `}
    />
  );
};
