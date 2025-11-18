/**
 * 游戏状态管理 Store
 * 使用 Zustand 管理整个象棋应用的状态和游戏逻辑
 */
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

/**
 * 游戏 Store 接口
 * 扩展了 GameState，添加了所有游戏操作方法
 */
interface GameStore extends GameState {
  // 基础状态设置方法（主要用于内部逻辑，外部组件通常使用业务方法）
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
  
  // 游戏业务逻辑方法（供组件调用）
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

/** 初始 FEN 字符串（标准开局） */
const initFEN = "rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RNBAKABNR w";

/**
 * 创建初始棋盘格子数组
 * 中国象棋棋盘：10行 x 9列
 * @returns 90个空格子的数组
 */
const createInitialSquares = (): Square[] => {
  const row = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1]; // 从下往上：10到1
  const column = [1, 2, 3, 4, 5, 6, 7, 8, 9]; // 从左往右：1到9
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

/**
 * 创建游戏状态管理 Store
 */
export const useGameStore = create<GameStore>((set, get) => {
  /**
   * 从 FEN 字符识别棋子类型
   * @param letter FEN 字符（K/R/N/C/A/B/P）
   * @returns 棋子类型或 null
   */
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

  /**
   * 从 FEN 字符识别棋子颜色
   * @param letter FEN 字符
   * @returns 颜色（red/black）或 null（空位）
   */
  const identifyColor = (letter: string): ColorType => {
    if (parseInt(letter) === 1) {
      return null; // 空位用 "1" 表示
    } else if (letter === letter.toUpperCase()) {
      return "red"; // 大写字母表示红方
    } else {
      return "black"; // 小写字母表示黑方
    }
  };

  /**
   * 将一行格子转换为 FEN 字符串格式
   * @param ary 一行格子的数组
   * @returns FEN 格式的数组（数字表示连续空位，字母表示棋子）
   */
  const produceFENString = (ary: Square[]): (string | number)[] => {
    const FENQuery: (string | number)[] = [];
    ary.forEach((sqr) => {
      if (sqr.piece === null) {
        // 空位：合并连续的空位为数字
        if (typeof FENQuery[FENQuery.length - 1] === "number") {
          FENQuery[FENQuery.length - 1] = (FENQuery[FENQuery.length - 1] as number) + 1;
        } else {
          FENQuery.push(1);
        }
      } else {
        // 有棋子：转换为 FEN 字符
        let letter: string;
        if (sqr.piece === "knight") {
          letter = "n"; // 马用 "n" 表示（避免与王 "k" 冲突）
        } else {
          letter = sqr.piece.split("")[0]; // 取首字母
        }
        // 红方大写，黑方小写
        FENQuery.push(sqr.color === "red" ? letter.toUpperCase() : letter);
      }
    });
    return FENQuery;
  };

  /**
   * 更新棋盘格子的可用状态样式
   * 根据 availableSquares 标记哪些格子可以移动
   */
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

  /**
   * 选择格子（点击棋子时调用）
   * @param row 行号
   * @param column 列号
   */
  const handleSelectSquare = (row: number, column: number) => {
    const state = get();
    const newSqr = [...state.squares];
    const index = newSqr.findIndex((s) => s.id === `${row}-${column}`);
    // 清除所有格子的选中状态
    for (const s of newSqr) {
      s.isSelected = false;
    }
    // 设置当前格子为选中状态
    if (index !== -1) {
      newSqr[index].isSelected = true;
      set({ selectedSquareInfo: { ...newSqr[index] }, counter: 1 });
    }
  };

  /**
   * 清空棋盘（移除所有棋子）
   */
  const handleClearBoard = () => {
    const state = get();
    const newBoard = [...state.squares];
    newBoard.forEach((sqr) => {
      sqr.piece = null;
      sqr.color = null;
    });
    set({ squares: newBoard, counter: 0 });
  };

  /**
   * 查找指定棋子的所有合法移动目标格子
   * 包括：1. 根据棋子规则计算可能移动 2. 过滤掉会导致己方被将的移动
   * @param piece 棋子类型
   * @param color 棋子颜色
   * @param row 当前行
   * @param column 当前列
   * @returns 合法移动目标格子的数组
   */
  const findAvailableSqr = (piece: PieceType, color: ColorType, row: number, column: number): Square[] => {
    const state = get();
    const newSqr = [...state.squares];
    const targetSqr: (Square | undefined)[] = [];
    
    // 根据 ID 查找格子的辅助函数
    const selectSqrById = (id: string) => newSqr.find((s) => s.id === id);
    
    // 将字符串 ID 数组转换为 Square 对象数组
    const generateTargetSqr = (ary: string[]) => {
      for (const sq of ary) {
        const found = selectSqrById(sq);
        if (found) targetSqr.push(found);
      }
    };

    if (!piece || !color) return [];

    // 根据棋子类型调用相应的移动规则函数
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

    // 过滤掉己方棋子占据的格子
    const newTargetSqr = targetSqr.filter((s): s is Square => s !== undefined && s.color !== state.currentTurn);
    const validatedTargetSqr: Square[] = [];

    // 验证每个可能的移动：检查移动后是否会导致己方被将
    for (const target of newTargetSqr) {
      // 模拟移动
      const stimulateSqr = [...state.squares];
      const originalIndex = stimulateSqr.findIndex((s) => s.id === `${row}-${column}`);
      const destinationIndex = stimulateSqr.findIndex((s) => s.id === `${target.row}-${target.column}`);

      if (originalIndex === -1 || destinationIndex === -1) continue;

      // 执行模拟移动
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

      // 检查移动后己方将是否安全
      const kingSqr = stimulateSqr.find((s) => s.piece === "king" && s.color === color);
      if (kingSqr && checkDanger(stimulateSqr, color, kingSqr.row, kingSqr.column) === undefined) {
        // 将安全，这是一个合法移动
        validatedTargetSqr.push(target);
      }
    }

    return validatedTargetSqr;
  };

  /**
   * 检查游戏是否结束
   * 如果当前回合方没有任何合法移动，则游戏结束（被将死）
   */
  const checkGameOver = () => {
    const state = get();
    // 获取当前回合方的所有棋子
    const pieceList = state.squares.filter((p) => p.color === state.currentTurn && p.piece !== null);
    const possibleMoveList: Square[] = [];

    // 检查每个棋子是否有合法移动
    for (const piece of pieceList) {
      if (!piece.piece || !piece.color) continue;
      const moveList = findAvailableSqr(piece.piece, piece.color, piece.row, piece.column);
      if (moveList.length !== 0) {
        possibleMoveList.push(...moveList);
      }
    }

    // 如果没有合法移动，游戏结束
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

    /**
     * 处理棋子移动
     * counter % 2 === 0: 第一次点击（选择棋子）
     * counter % 2 !== 0: 第二次点击（移动棋子或重新选择）
     * @param piece 棋子类型
     * @param color 棋子颜色
     * @param row 目标行
     * @param column 目标列
     */
    handleMovePiece: (piece, color, row, column) => {
      const state = get();
      
      // 第一次点击：选择棋子
      if (state.counter % 2 === 0) {
        if (color === state.currentTurn) {
          handleSelectSquare(row, column);
          const available = findAvailableSqr(piece, color, row, column);
          set({ availableSquares: available });
          addAvailableStyle();
        }
      } 
      // 第二次点击：移动棋子或重新选择
      else if (state.counter % 2 !== 0) {
        // 点击己方棋子：重新选择
        if (color === state.currentTurn) {
          handleSelectSquare(row, column);
          const available = findAvailableSqr(piece, color, row, column);
          set({ availableSquares: available });
          addAvailableStyle();
        } 
        // 点击合法移动目标：执行移动
        else if (state.availableSquares.some((sqr) => sqr.id === `${row}-${column}`)) {
          // 如果目标位置有对方棋子，记录为被吃掉的棋子
          if (color !== null && state.selectedSquareInfo) {
            const capturedPiece = state.squares.find((s) => s.id === `${row}-${column}`);
            if (capturedPiece) {
              set((prev) => ({
                capturedPieceList: [...prev.capturedPieceList, capturedPiece]
              }));
            }
          }

          // 执行移动
          const newSqr = [...state.squares];
          const startIndex = newSqr.findIndex(
            (s) => s.id === `${state.selectedSquareInfo?.row}-${state.selectedSquareInfo?.column}`
          );
          const destinationIndex = newSqr.findIndex((s) => s.id === `${row}-${column}`);

          if (startIndex !== -1 && destinationIndex !== -1 && state.selectedSquareInfo) {
            // 清除所有格子的移动标记
            for (const s of newSqr) {
              s.isJustMoved = false;
              s.isPreviousMoved = false;
              s.isAvailable = false;
            }

            // 更新起始位置（标记为刚刚移动过的位置）
            newSqr[startIndex] = {
              ...newSqr[startIndex],
              piece: null,
              color: null,
              isPreviousMoved: true,
            };

            // 更新目标位置（放置棋子，标记为刚刚移动）
            newSqr[destinationIndex] = {
              ...newSqr[destinationIndex],
              piece: state.selectedSquareInfo.piece,
              color: state.selectedSquareInfo.color,
              isJustMoved: true,
            };

            // 更新状态：切换回合，重置选择
            set({
              squares: newSqr,
              currentTurn: state.currentTurn === "red" ? "black" : "red",
              counter: 2,
              selectedSquareInfo: null,
              availableSquares: [],
            });

            // 异步检查游戏是否结束
            setTimeout(() => {
              checkGameOver();
            }, 0);
          }
        } 
        // 点击无效位置：取消选择
        else {
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

    /**
     * 翻转棋盘（180度旋转）
     */
    handleFlipBoard: () => {
      const state = get();
      set({
        isFlipped: true,
        squares: [...state.squares].reverse(),
      });
    },

    /**
     * 初始化游戏（重新开始）
     */
    handleInit: () => {
      handleClearBoard();
      set({ capturedPieceList: [] });
      const state = get();
      state.handleParseFENInput(initFEN);
    },

    /**
     * 生成当前局面的 FEN 字符串
     * FEN 格式：rnbakabnr/9/1c5c1/... w
     */
    handleGenerateFEN: () => {
      const state = get();
      // 如果棋盘已翻转，需要先反转回来再生成 FEN
      const newSqr = state.isFlipped
        ? [...state.squares].reverse()
        : [...state.squares];

      // 按行组织格子（从第10行到第1行）
      const rows: Record<string, Square[]> = {};
      for (let i = 10; i >= 1; i--) {
        rows[`row${i}`] = newSqr.filter((sqr) => sqr.row === i);
      }

      // 将每行转换为 FEN 格式
      const rowFEN: (string | number)[][] = [];
      for (const row in rows) {
        rowFEN.push(produceFENString(rows[row]));
      }

      // 合并所有行
      const FENQuery: string[] = [];
      for (const row of rowFEN) {
        FENQuery.push(row.join(""));
      }

      // 添加回合信息（w=红方，b=黑方）
      const turnOrder = state.currentTurn === "red" ? "w" : "b";
      const result = `${FENQuery.join("/")} ${turnOrder}`;
      set({ FENOutput: result });
    },

    /**
     * 解析 FEN 字符串并设置棋盘
     * @param FEN FEN 格式字符串
     */
    handleParseFENInput: (FEN: string) => {
      const splitUpFEN = FEN.trim().split("/");
      const lastFEN = splitUpFEN[9]?.split(" ")[0] || "";
      const turnOrder = splitUpFEN[9]?.split(" ")[1];
      splitUpFEN[splitUpFEN.length - 1] = lastFEN;

      // 将数字转换为对应的 "1" 字符串（如 9 -> "111111111"）
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

      // 将 FEN 字符串转换为 Square 对象数组
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

    /**
     * 验证 FEN 输入是否有效
     * @param input FEN 字符串
     * @returns 是否有效
     */
    validFENInput: (input: string): boolean => {
      if (!input.trim()) {
        return false;
      }
      const splitUpFEN = input.trim().split("/");
      if (splitUpFEN.length !== 10) {
        return false; // 必须有10行
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

      // 验证每行必须有9个字符，且只包含有效字符
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

    /**
     * 打开错误模态框
     */
    handleOpenErrorModal: () => set({ error: true }),
    
    /**
     * 关闭通知模态框
     */
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

