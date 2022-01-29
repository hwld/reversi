import { BLACK, SquareState, WHITE } from "../utils/game";

export const Stone: React.VFC<{ type: SquareState; className?: string }> = ({
  type,
  className,
}) => {
  return (
    <div
      className={`rounded-full 
      ${type === WHITE && "border-2 border-stone-800 bg-stone-100"}
      ${type === BLACK && "bg-stone-800"} 
      ${className}
      `}
    />
  );
};
