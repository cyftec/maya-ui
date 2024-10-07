import { defaultMetaTags, derived, dString, signal } from "@maya/core";
import { m } from "@maya/core";
import { Button, Loader } from "../@elements";
import { GridBoard } from "./@components/GridBoard";
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
        class: "mb0",
        children: m.Text("Tic Tac Toe"),
      }),
      m.Div({
        class: "flex items-center justify-between",
        children: [
          m.Div({
            class: "flex items-center",
            children: [
              m.Div({
                class: dString`f3 ${() =>
                  playerXsTurn.value ? "green" : "pink"}`,
                children: m.Text`${() =>
                  playerXsTurn.value ? "X" : "O"}${() =>
                  winner.value ? " won!!!" : "'s turn"}`,
              }),
              m.Span({
                class: "ml3 db",
                children: m.If({
                  condition: isBusy,
                  then: Loader({}),
                  otherwise: m.Span({
                    class: "f2",
                    children: m.Text("✓"),
                  }),
                }),
              }),
            ],
          }),
          m.Div({
            children: [
              ...m.If({
                condition: winner,
                then: m.H2({ class: "mr2", children: m.Text("in") }),
                otherwise: m.Text(""),
              }),
              ...m.Switch({
                subject: derived(
                  () => moves.value.filter((m) => m.player).length
                ),
                defaultCase: m.H2({ children: m.Text("0 moves") }),
                cases: {
                  1: m.H2({ children: m.Text("1 move") }),
                  2: m.H2({ children: m.Text("2 moves") }),
                  3: m.H2({ children: m.Text("3 moves") }),
                  4: m.H2({ children: m.Text("4 moves") }),
                  5: m.H2({ children: m.Text("5 moves") }),
                  6: m.H2({ children: m.Text("6 moves") }),
                  7: m.H2({ children: m.Text("7 moves") }),
                  8: m.H2({ children: m.Text("8 moves") }),
                  9: m.H2({ children: m.Text("9 moves") }),
                },
              }),
            ],
          }),
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

export const page = () =>
  m.Html({
    lang: "en",
    children: [
      m.Head({
        children: [
          ...defaultMetaTags(),
          m.Title({
            children: m.Text("Tic Tac Toe"),
          }),
          m.Link({
            rel: "stylesheet",
            href: "https://unpkg.com/tachyons@4.12.0/css/tachyons.min.css",
          }),
          m.Link({
            rel: "stylesheet",
            href: "../assets/styles.css",
          }),
        ],
      }),
      m.Body({
        children: [
          m.Script({
            src: "main.js",
            defer: "true",
          }),
          TicTacToeApp(),
        ],
      }),
    ],
  });
