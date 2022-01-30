import { BoardState } from "../hooks/useGame";
import { Stone } from "./Stone";

export const BoardStatus: React.VFC<{ state: BoardState }> = ({ state }) => {
  return (
    <div className="m-auto flex w-fit items-center">
      {state.isEnd ? (
        <>
          <p className="text-xl font-bold">Winner:</p>
          {state.winner !== null ? (
            <Stone
              className="ml-3 h-[30px] w-[30px]"
              type={state.winner.stone}
            />
          ) : (
            <p className="ml-3 h-[30px] text-xl font-bold">Draw</p>
          )}
        </>
      ) : (
        <>
          <p className="text-xl font-bold">NextPlayer:</p>
          <Stone
            className="ml-3 h-[30px] w-[30px]"
            type={state.nextPlayer.stone}
          />
        </>
      )}
    </div>
  );
};
