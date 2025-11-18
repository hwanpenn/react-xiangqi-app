import { create } from 'zustand';
import type { Square, PieceType, ColorType, GameState } from '../types';
import {
  pawn,
  advisor,
  bishop,
  king,
  rook,
  cannon,
  knight,
  checkDanger,
} from '../pieceLogic';

interface GameStore extends GameState {
  // Actions
  setSquares: (squares: Square[]) => void;
  setIsFlipped: (isFlipped: boolean) => void;
  setSelectedSquareInfo: (info: Square | null) => void;
  setAvailableSquares: (squares: Square[]) => void;
  setCounter: (counter: number) => void;
  setCurrentTurn: (turn: ColorType) => void;
  setCapturedPieceList: (pieces: Square[]) => void;
  addCapturedPiece: (piece: Square) => void;
  setFENOutput: (fen: string) => void;
  setError: (error: boolean) => void;
  setGameOver: (gameOver: boolean) => void;
  resetGame: () => void;
  // Game logic functions
  handleMovePiece: (piece: PieceType, color: ColorType, row: number, column: number) => void;
  handleFlipBoard: () => void;
  handleInit: () => void;
  handleGenerateFEN: () => void;
  handleParseFENInput: (fen: string) => void;
  validFENInput: (input: string) => boolean;
  handleOpenErrorModal: () => void;
  handleCloseNotificationModal: () => void;
  findAvailableSqr: (piece: PieceType, color: ColorType, row: number, column: number) => Square[];
  checkGameOver: () => void;
}

const initFEN = "rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RNBAKABNR w";

const createInitialSquares = (): Square[] => {
  const row = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1];
  const column = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const squares: Square[] = [];
  
  row.forEach((r) => {
    column.forEach((c) => {
      squares.push({
        id: `${r}-${c}`,
        piece: null,
        color: null,
        row: r,
        column: c,
        isAvailable: false,
        isPreviousMoved: false,
        isJustMoved: false,
        isSelected: false,
      });
    });
  });
  
  return squares;
};

export const useGameStore = create<GameStore>((set, get) => {
  const identifyPiece = (letter: string): PieceType => {
    switch (letter.toUpperCase()) {
      case "K":
        return "king";
      case "R":
        return "rook";
      case "N":
        return "knight";
      case "C":
        return "cannon";
      case "A":
        return "advisor";
      case "B":
        return "bishop";
      case "P":
        return "pawn";
      default:
        return null;
    }
  };

  const identifyColor = (letter: string): ColorType => {
    if (parseInt(letter) === 1) {
      return null;
    } else if (letter === letter.toUpperCase()) {
      return "red";
    } else {
      return "black";
    }
  };

  const produceFENString = (ary: Square[]): (string | number)[] => {
    const FENQuery: (string | number)[] = [];
    ary.forEach((sqr) => {
      if (sqr.piece === null) {
        if (typeof FENQuery[FENQuery.length - 1] === "number") {
          FENQuery[FENQuery.length - 1] = (FENQuery[FENQuery.length - 1] as number) + 1;
        } else {
          FENQuery.push(1);
        }
      } else {
        let letter: string;
        if (sqr.piece === "knight") {
          letter = "n";
        } else {
          letter = sqr.piece.split("")[0];
        }
        FENQuery.push(sqr.color === "red" ? letter.toUpperCase() : letter);
      }
    });
    return FENQuery;
  };

  const addAvailableStyle = () => {
    const state = get();
    const newSqr = [...state.squares];
    for (const s of newSqr) {
      s.isAvailable = false;
      if (state.availableSquares.some((sqr) => sqr.id === s.id)) {
        s.isAvailable = true;
      }
    }
    set({ squares: newSqr });
  };

  const handleSelectSquare = (row: number, column: number) => {
    const state = get();
    const newSqr = [...state.squares];
    const index = newSqr.findIndex((s) => s.id === `${row}-${column}`);
    for (const s of newSqr) {
      s.isSelected = false;
    }
    if (index !== -1) {
      newSqr[index].isSelected = true;
      set({ selectedSquareInfo: { ...newSqr[index] }, counter: 1 });
    }
  };

  const handleClearBoard = () => {
    const state = get();
    const newBoard = [...state.squares];
    newBoard.forEach((sqr) => {
      sqr.piece = null;
      sqr.color = null;
    });
    set({ squares: newBoard, counter: 0 });
  };

  const findAvailableSqr = (piece: PieceType, color: ColorType, row: number, column: number): Square[] => {
    const state = get();
    const newSqr = [...state.squares];
    const targetSqr: (Square | undefined)[] = [];
    const selectSqrById = (id: string) => newSqr.find((s) => s.id === id);
    const generateTargetSqr = (ary: string[]) => {
      for (const sq of ary) {
        const found = selectSqrById(sq);
        if (found) targetSqr.push(found);
      }
    };

    if (!piece || !color) return [];

    switch (piece) {
      case "pawn":
        generateTargetSqr(pawn(color, row, column));
        break;
      case "advisor":
        generateTargetSqr(advisor(color, row, column));
        break;
      case "bishop":
        generateTargetSqr(bishop([...state.squares], color, row, column));
        break;
      case "king":
        generateTargetSqr(king(color, row, column));
        break;
      case "rook":
        generateTargetSqr(rook([...state.squares], row, column));
        break;
      case "cannon":
        generateTargetSqr(cannon([...state.squares], color, row, column));
        break;
      case "knight":
        generateTargetSqr(knight([...state.squares], row, column));
        break;
      default:
        return [];
    }

    const newTargetSqr = targetSqr.filter((s): s is Square => s !== undefined && s.color !== state.currentTurn);
    const validatedTargetSqr: Square[] = [];

    for (const target of newTargetSqr) {
      const stimulateSqr = [...state.squares];
      const originalIndex = stimulateSqr.findIndex((s) => s.id === `${row}-${column}`);
      const destinationIndex = stimulateSqr.findIndex((s) => s.id === `${target.row}-${target.column}`);

      if (originalIndex === -1 || destinationIndex === -1) continue;

      stimulateSqr[originalIndex] = {
        ...stimulateSqr[originalIndex],
        piece: null,
        color: null,
      };
      stimulateSqr[destinationIndex] = {
        ...stimulateSqr[destinationIndex],
        piece: piece,
        color: color,
      };

      const kingSqr = stimulateSqr.find((s) => s.piece === "king" && s.color === color);
      if (kingSqr && checkDanger(stimulateSqr, color, kingSqr.row, kingSqr.column) === undefined) {
        validatedTargetSqr.push(target);
      }
    }

    return validatedTargetSqr;
  };

  const checkGameOver = () => {
    const state = get();
    const pieceList = state.squares.filter((p) => p.color === state.currentTurn && p.piece !== null);
    const possibleMoveList: Square[] = [];

    for (const piece of pieceList) {
      if (!piece.piece || !piece.color) continue;
      const moveList = findAvailableSqr(piece.piece, piece.color, piece.row, piece.column);
      if (moveList.length !== 0) {
        possibleMoveList.push(...moveList);
      }
    }

    set({ gameOver: possibleMoveList.length === 0 });
  };

  return {
    // Initial state
    squares: createInitialSquares(),
    isFlipped: false,
    selectedSquareInfo: null,
    availableSquares: [],
    counter: 0,
    currentTurn: "red",
    capturedPieceList: [],
    FENOutput: initFEN,
    error: false,
    gameOver: false,

    // Actions
    setSquares: (squares) => set({ squares }),
    setIsFlipped: (isFlipped) => set({ isFlipped }),
    setSelectedSquareInfo: (info) => set({ selectedSquareInfo: info }),
    setAvailableSquares: (squares) => set({ availableSquares: squares }),
    setCounter: (counter) => set({ counter }),
    setCurrentTurn: (turn) => set({ currentTurn: turn }),
    setCapturedPieceList: (pieces) => set({ capturedPieceList: pieces }),
    addCapturedPiece: (piece) => set((state) => ({
      capturedPieceList: [...state.capturedPieceList, piece]
    })),
    setFENOutput: (fen) => set({ FENOutput: fen }),
    setError: (error) => set({ error }),
    setGameOver: (gameOver) => set({ gameOver }),
    resetGame: () => set({
      squares: createInitialSquares(),
      isFlipped: false,
      selectedSquareInfo: null,
      availableSquares: [],
      counter: 0,
      currentTurn: "red",
      capturedPieceList: [],
      FENOutput: initFEN,
      error: false,
      gameOver: false,
    }),

    // Game logic functions
    findAvailableSqr,
    checkGameOver,

    handleMovePiece: (piece, color, row, column) => {
      const state = get();
      if (state.counter % 2 === 0) {
        if (color === state.currentTurn) {
          handleSelectSquare(row, column);
          const available = findAvailableSqr(piece, color, row, column);
          set({ availableSquares: available });
          addAvailableStyle();
        }
      } else if (state.counter % 2 !== 0) {
        if (color === state.currentTurn) {
          handleSelectSquare(row, column);
          const available = findAvailableSqr(piece, color, row, column);
          set({ availableSquares: available });
          addAvailableStyle();
        } else if (state.availableSquares.some((sqr) => sqr.id === `${row}-${column}`)) {
          if (color !== null && state.selectedSquareInfo) {
            const capturedPiece = state.squares.find((s) => s.id === `${row}-${column}`);
            if (capturedPiece) {
              set((prev) => ({
                capturedPieceList: [...prev.capturedPieceList, capturedPiece]
              }));
            }
          }

          const newSqr = [...state.squares];
          const startIndex = newSqr.findIndex(
            (s) => s.id === `${state.selectedSquareInfo?.row}-${state.selectedSquareInfo?.column}`
          );
          const destinationIndex = newSqr.findIndex((s) => s.id === `${row}-${column}`);

          if (startIndex !== -1 && destinationIndex !== -1 && state.selectedSquareInfo) {
            for (const s of newSqr) {
              s.isJustMoved = false;
              s.isPreviousMoved = false;
              s.isAvailable = false;
            }

            newSqr[startIndex] = {
              ...newSqr[startIndex],
              piece: null,
              color: null,
              isPreviousMoved: true,
            };

            newSqr[destinationIndex] = {
              ...newSqr[destinationIndex],
              piece: state.selectedSquareInfo.piece,
              color: state.selectedSquareInfo.color,
              isJustMoved: true,
            };

            set({
              squares: newSqr,
              currentTurn: state.currentTurn === "red" ? "black" : "red",
              counter: 2,
              selectedSquareInfo: null,
              availableSquares: [],
            });

            setTimeout(() => {
              checkGameOver();
            }, 0);
          }
        } else {
          const newSqr = [...state.squares];
          for (const s of newSqr) {
            s.isAvailable = false;
            s.isSelected = false;
          }
          set({
            squares: newSqr,
            selectedSquareInfo: null,
            availableSquares: [],
          });
        }
      }
    },

    handleFlipBoard: () => {
      const state = get();
      set({
        isFlipped: true,
        squares: [...state.squares].reverse(),
      });
    },

    handleInit: () => {
      handleClearBoard();
      set({ capturedPieceList: [] });
      const state = get();
      state.handleParseFENInput(initFEN);
    },

    handleGenerateFEN: () => {
      const state = get();
      const newSqr = state.isFlipped
        ? [...state.squares].reverse()
        : [...state.squares];

      const rows: Record<string, Square[]> = {};
      for (let i = 10; i >= 1; i--) {
        rows[`row${i}`] = newSqr.filter((sqr) => sqr.row === i);
      }

      const rowFEN: (string | number)[][] = [];
      for (const row in rows) {
        rowFEN.push(produceFENString(rows[row]));
      }

      const FENQuery: string[] = [];
      for (const row of rowFEN) {
        FENQuery.push(row.join(""));
      }

      const turnOrder = state.currentTurn === "red" ? "w" : "b";
      const result = `${FENQuery.join("/")} ${turnOrder}`;
      set({ FENOutput: result });
    },

    handleParseFENInput: (FEN: string) => {
      const splitUpFEN = FEN.trim().split("/");
      const lastFEN = splitUpFEN[9]?.split(" ")[0] || "";
      const turnOrder = splitUpFEN[9]?.split(" ")[1];
      splitUpFEN[splitUpFEN.length - 1] = lastFEN;

      const decodedFEN = splitUpFEN.map((FENstring) => {
        return FENstring
          .replace(/9/g, "111111111")
          .replace(/8/g, "11111111")
          .replace(/7/g, "1111111")
          .replace(/6/g, "111111")
          .replace(/5/g, "11111")
          .replace(/4/g, "1111")
          .replace(/3/g, "111")
          .replace(/2/g, "11")
          .split("");
      });

      const newSqr: Square[] = [];
      decodedFEN.forEach((FENstring, FENStringIndex) => {
        FENstring.forEach((FENletter, letterIndex) => {
          newSqr.push({
            id: `${10 - FENStringIndex}-${letterIndex + 1}`,
            piece: identifyPiece(FENletter),
            color: identifyColor(FENletter),
            row: 10 - FENStringIndex,
            column: letterIndex + 1,
            isAvailable: false,
            isPreviousMoved: false,
            isJustMoved: false,
            isSelected: false,
          });
        });
      });

      const state = get();
      set({
        squares: state.isFlipped ? newSqr.reverse() : newSqr,
        currentTurn: turnOrder === "b" ? "black" : "red",
        counter: 0,
      });
    },

    validFENInput: (input: string): boolean => {
      if (!input.trim()) {
        return false;
      }
      const splitUpFEN = input.trim().split("/");
      if (splitUpFEN.length !== 10) {
        return false;
      }
      const lastFEN = splitUpFEN[9]?.split(" ")[0] || "";
      splitUpFEN[splitUpFEN.length - 1] = lastFEN;
      const decodedFEN = splitUpFEN.map((FENstring) => {
        return FENstring
          .replace(/9/g, "111111111")
          .replace(/8/g, "11111111")
          .replace(/7/g, "1111111")
          .replace(/6/g, "111111")
          .replace(/5/g, "11111")
          .replace(/4/g, "1111")
          .replace(/3/g, "111")
          .replace(/2/g, "11")
          .split("");
      });

      for (const FENstring of decodedFEN) {
        if (FENstring.length !== 9) {
          return false;
        }
        if (!FENstring.every((sqr) => sqr.match(/[krncabpKRNCABP1]/))) {
          return false;
        }
      }
      return true;
    },

    handleOpenErrorModal: () => set({ error: true }),
    handleCloseNotificationModal: () => {
      const state = get();
      if (state.error) {
        set({ error: false });
      } else if (state.gameOver) {
        set({ gameOver: false });
      }
    },
  };
});

