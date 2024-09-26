import { derived, signal } from "@ckzero/maya/signal";
import { m } from "@maya/core";
import { Button, Loader } from "../_elements";
import { GridBoard } from "./_components/GridBoard";
import type { Move, Player } from "./types";

const TicTacToeApp = () => {
  const blankMoves = () =>
    Array.from(Array(9).keys())
      .map((index) => ({
        index,
        player: null,
      }))
      .map((move) => ({ ...move }));
  const playerXsTurn = signal(true);
  const winner = signal<Player | null>(null);
  const winCombo = signal<number[] | null>(null);
  const moves = signal<Move[]>(blankMoves());
  const isBusy = signal(false);

  const checkWin = () => {
    const winCombos = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let i = 0; i < winCombos.length; i++) {
      const [a, b, c] = winCombos[i];
      if (
        moves.value[a].player &&
        moves.value[a].player === moves.value[b].player &&
        moves.value[a].player === moves.value[c].player
      ) {
        winner.value = moves.value[a].player;
        winCombo.value = winCombos[i];
        return;
      }
    }
  };

  const onMove = async (index: number) => {
    if (moves.value[index].player || winner.value) {
      console.log("winner already declared");
      return;
    }
    await mockNewtorkLag();
    const newTurn = !playerXsTurn.value;
    const newMoves = [...moves.value];

    newMoves[index].player = playerXsTurn.value ? "X" : "O";
    moves.value = newMoves;
    checkWin();
    if (winner.value) return;
    playerXsTurn.value = newTurn;
  };

  const mockNewtorkLag = async (ms = 300) => {
    console.log("processing on network...");
    isBusy.value = true;
    await new Promise((resolve) => setTimeout(resolve, ms));
    isBusy.value = false;
    console.log("processing done.");
  };

  const restartGame = () => {
    moves.value = blankMoves();
    playerXsTurn.value = true;
    winner.value = null;
    winCombo.value = null;
  };

  return m.Div({
    class: "ph3 mw6",
    children: [
      m.H1({
        children: m.Text("Tic Tac Toe"),
      }),
      m.Div({
        class: "flex items-center",
        children: [
          m.Div({
            class: () => `f2 mb1 ${playerXsTurn.value ? "green" : "pink"}`,
            children: derived(() =>
              m.Text(
                `${playerXsTurn.value ? "X" : "O"}${
                  winner.value ? " won!!!" : "'s turn"
                }`
              )
            ),
          }),
          derived(() =>
            m.Span({
              class: "ml3",
              children: [
                derived(() =>
                  isBusy.value
                    ? Loader({})
                    : m.Span({
                        class: "f2",
                        children: m.Text("✓"),
                      })
                ),
              ],
            })
          ),
        ],
      }),
      GridBoard({
        playerXsTurn,
        moves,
        onMove,
        winner,
        winCombo,
      }),
      Button({
        classNames: "mt4",
        color: "bg-gray white",
        onTap: restartGame,
        label: "Restart",
      }),
    ],
  });
};

export const app = TicTacToeApp;
