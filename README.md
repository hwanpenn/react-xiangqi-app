# React XiangQi App

A Chinese Chess (Xiangqi) web application built with React, TypeScript, and modern web technologies.

## 🛠️ Tech Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **State Management**: Zustand
- **UI Library**: Ant Design
- **Styling**: Tailwind CSS + CSS Modules
- **Routing**: React Router v6 (installed, ready to use)

## ✨ Features

1. ✅ Moving pieces freely with validation
2. ✅ Reading FEN input and generating position on board
3. ✅ Generating FEN from current board position
4. ✅ Flipping the board around
5. ✅ FEN input validation
6. ✅ Piece movement validation (including check detection)
7. ✅ Game over detection
8. ✅ Captured pieces display

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
src/
├── Board/           # Board components
├── BoardInfo/       # Game info components
├── store/           # Zustand state management
├── types/           # TypeScript type definitions
├── pieceLogic.ts    # Game logic (piece movements)
└── App.tsx          # Main app component
```

## 🎮 How to Play

1. Click on a piece to select it
2. Available moves will be highlighted
3. Click on an available square to move
4. The game alternates between red and black turns
5. Use "Flip Board" to rotate the board view
6. Use "Restart Game" to start a new game

## 📝 Features to be Added

- [ ] Move history list
- [ ] Drag and drop for pieces
- [ ] Theme switching
- [ ] AI opponent
- [ ] Game replay
- [ ] Online multiplayer

## 📄 License

MIT

## 🔗 Related

See `UPGRADE.md` for details about the recent technology stack upgrade.
