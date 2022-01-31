import { Reducer, useReducer } from "react";
import {
  calcNextPlayer,
  CPU,
  getAvailablePlaces,
  placeStone,
  initSquares,
  Player,
  Squares,
  YOU,
} from "../utils/game";
import { assertNever } from "../utils/util";

export type BoardState = {
  squares: Squares;
  nextPlayer: Player;
  // 次のプレイヤーが配置可能な場所
  availableSquares: { line: number; column: number }[];
  // どの位置に石が置かれてこの盤面になったか
  lastPlacedStone: { line: number; column: number; player: Player };
} & ({ isEnd: true; winner: Player | null } | { isEnd: false });

type GameState = {
  history: BoardState[];
  current: number;
};

type GameAction =
  | { type: "setStone"; value: { line: number; column: number } }
  | { type: "reset" }
  | { type: "changeCurrent"; value: number };

const initBoard = (): BoardState => {
  const initialSquares = initSquares();
  const initialPlayer = YOU;
  return {
    squares: initialSquares,
    nextPlayer: initialPlayer,
    isEnd: false,
    availableSquares: getAvailablePlaces(initialSquares, initialPlayer.stone),
    lastPlacedStone: { line: -1, column: -1, player: CPU },
  };
};

const gameReducer: Reducer<GameState, GameAction> = (state, action) => {
  switch (action.type) {
    case "setStone": {
      const { squares, nextPlayer: player } = state.history[state.current];
      const current = state.current;
      const { line, column } = action.value;

      const resultSquares = placeStone(squares, {
        line,
        column,
        stone: player.stone,
      });

      // それぞれの石の数を数える
      let resultYouCount = 0;
      let resultCpuCounts = 0;
      for (const ss of squares) {
        for (const s of ss) {
          if (s === YOU.stone) {
            resultYouCount++;
          } else if (s === CPU.stone) {
            resultCpuCounts;
          }
        }
      }

      // 現段階で優位なプレイヤー
      let winner: Player | null;
      if (resultYouCount > resultCpuCounts) {
        winner = YOU;
      } else if (resultCpuCounts > resultYouCount) {
        winner = CPU;
      } else {
        winner = null;
      }

      // 次のプレイヤーが置ける場所
      const nextAvailableSquares = getAvailablePlaces(
        resultSquares,
        calcNextPlayer(player).stone
      );

      const newBoardState: BoardState = {
        squares: resultSquares,
        nextPlayer: calcNextPlayer(player),
        availableSquares: nextAvailableSquares,
        isEnd: false,
        lastPlacedStone: { line, column, player },
      };

      // 次のプレイヤーの石が置く場所がなければプレイヤーを切り替えない
      if (nextAvailableSquares.length === 0) {
        // 今のプレイヤーも置く場所がなければゲーム終了
        const available = getAvailablePlaces(resultSquares, player.stone);
        if (available.length === 0) {
          return {
            history: [
              ...state.history.filter((_, i) => i <= current),
              { ...newBoardState, isEnd: true, winner },
            ],
            current: current + 1,
          };
        }

        return {
          history: [
            ...state.history.filter((_, i) => i <= current),
            {
              ...newBoardState,
              availableSquares: available,
              nextPlayer: player,
            },
          ],
          current: current + 1,
        };
      }

      return {
        history: [
          ...state.history.filter((_, i) => i <= current),
          newBoardState,
        ],
        current: current + 1,
      };
    }
    case "reset": {
      return { history: [initBoard()], current: 0 };
    }
    case "changeCurrent": {
      return { ...state, current: action.value };
    }
    default: {
      assertNever(action);
      return state;
    }
  }
};

export const useGame = () => {
  const [{ history, current }, dispatch] = useReducer(gameReducer, {
    history: [initBoard()],
    current: 0,
  });

  const resetGame = () => {
    dispatch({ type: "reset" });
  };

  const setStone = (line: number, column: number) => {
    dispatch({ type: "setStone", value: { line, column } });
  };

  const changeCurrent = (index: number) => {
    dispatch({ type: "changeCurrent", value: index });
  };

  return {
    history,
    current,
    setStone,
    resetGame,
    changeCurrent,
  };
};
