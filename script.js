let board = [];
let boardSize = 8;
let currentPiece = null;
let validPositionsShown = false;

const pieces = {
  // White pieces
  K: "♔", // King
  Q: "♕", // Queen
  R: "♖", // Rook
  B: "♗", // Bishop
  N: "♘", // Knight
  P: "♙", // Pawn

  // Black pieces
  k: "♚", // King
  q: "♛", // Queen
  r: "♜", // Rook
  b: "♝", // Bishop
  n: "♞", // Knight
  p: "♟", // Pawn
};

const directions = {
  N: [
    [2, 1],
    [2, -1],
    [-2, 1],
    [-2, -1],
    [1, 2],
    [1, -2],
    [-1, 2],
    [-1, -2],
  ],
  n: [
    [2, 1],
    [2, -1],
    [-2, 1],
    [-2, -1],
    [1, 2],
    [1, -2],
    [-1, 2],
    [-1, -2],
  ],
  Q: [
    ...Array(boardSize)
      .fill()
      .map((_, i) => [0, i]),
    ...Array(boardSize)
      .fill()
      .map((_, i) => [0, -i]),
    ...Array(boardSize)
      .fill()
      .map((_, i) => [i, 0]),
    ...Array(boardSize)
      .fill()
      .map((_, i) => [-i, 0]),
    ...Array(boardSize)
      .fill()
      .map((_, i) => [i, i]),
    ...Array(boardSize)
      .fill()
      .map((_, i) => [-i, -i]),
    ...Array(boardSize)
      .fill()
      .map((_, i) => [i, -i]),
    ...Array(boardSize)
      .fill()
      .map((_, i) => [-i, i]),
  ],
  q: [
    ...Array(boardSize)
      .fill()
      .map((_, i) => [0, i]),
    ...Array(boardSize)
      .fill()
      .map((_, i) => [0, -i]),
    ...Array(boardSize)
      .fill()
      .map((_, i) => [i, 0]),
    ...Array(boardSize)
      .fill()
      .map((_, i) => [-i, 0]),
    ...Array(boardSize)
      .fill()
      .map((_, i) => [i, i]),
    ...Array(boardSize)
      .fill()
      .map((_, i) => [-i, -i]),
    ...Array(boardSize)
      .fill()
      .map((_, i) => [i, -i]),
    ...Array(boardSize)
      .fill()
      .map((_, i) => [-i, i]),
  ],
  B: [
    ...Array(boardSize)
      .fill()
      .map((_, i) => [i, i]),
    ...Array(boardSize)
      .fill()
      .map((_, i) => [-i, -i]),
    ...Array(boardSize)
      .fill()
      .map((_, i) => [i, -i]),
    ...Array(boardSize)
      .fill()
      .map((_, i) => [-i, i]),
  ],
  b: [
    ...Array(boardSize)
      .fill()
      .map((_, i) => [i, i]),
    ...Array(boardSize)
      .fill()
      .map((_, i) => [-i, -i]),
    ...Array(boardSize)
      .fill()
      .map((_, i) => [i, -i]),
    ...Array(boardSize)
      .fill()
      .map((_, i) => [-i, i]),
  ],
  R: [
    ...Array(boardSize)
      .fill()
      .map((_, i) => [0, i]),
    ...Array(boardSize)
      .fill()
      .map((_, i) => [0, -i]),
    ...Array(boardSize)
      .fill()
      .map((_, i) => [i, 0]),
    ...Array(boardSize)
      .fill()
      .map((_, i) => [-i, 0]),
  ],
  r: [
    ...Array(boardSize)
      .fill()
      .map((_, i) => [0, i]),
    ...Array(boardSize)
      .fill()
      .map((_, i) => [0, -i]),
    ...Array(boardSize)
      .fill()
      .map((_, i) => [i, 0]),
    ...Array(boardSize)
      .fill()
      .map((_, i) => [-i, 0]),
  ],
};

function initializeGame() {
  const boardElement = document.getElementById("board");
  boardElement.innerHTML = "";
  boardElement.style.gridTemplateColumns = `repeat(${boardSize}, 30px)`;
  boardElement.style.gridTemplateRows = `repeat(${boardSize}, 30px)`;
  board = createBoard(boardElement);
  placePieceRandomly();
}

function createBoard(boardElement) {
  const newBoard = [];
  for (let row = 0; row < boardSize; row++) {
    const boardRow = [];
    for (let col = 0; col < boardSize; col++) {
      const square = createSquare(row, col);
      boardElement.appendChild(square);
      boardRow.push(square);
    }
    newBoard.push(boardRow);
  }
  return newBoard;
}

function createSquare(row, col) {
  const square = document.createElement("div");
  square.classList.add("square");
  if ((row + col) % 2 === 1) {
    square.classList.add("black");
  }
  return square;
}

function placePieceRandomly() {
  const pieceTypes = Object.keys(pieces);
  const randomPieceType =
    pieceTypes[Math.floor(Math.random() * pieceTypes.length)];
  const randomRow = Math.floor(Math.random() * boardSize);
  const randomCol = Math.floor(Math.random() * boardSize);
  placePiece(randomPieceType, randomRow, randomCol);
}

function placePiece(type, row, col) {
  const piece = document.createElement("span");
  piece.innerText = pieces[type];
  piece.className = "currentPiece";
  piece.addEventListener("click", toggleValidPositions);
  board[row][col].appendChild(piece);
  currentPiece = { type, row, col };
}

function clearBoard() {
  board.forEach((row) =>
    row.forEach((square) => {
      square.innerHTML = "";
      square.classList.remove("valid");
    })
  );
  validPositionsShown = false;
}

function toggleValidPositions() {
  if (validPositionsShown) {
    clearValidPositions();
  } else {
    showValidPositions();
  }
  validPositionsShown = !validPositionsShown;
}

function clearValidPositions() {
  board.forEach((row) =>
    row.forEach((square) => {
      square.classList.remove("valid");
    })
  );
}

function showValidPositions() {
  const { type, row, col } = currentPiece;
  directions[type].forEach(([dRow, dCol]) => {
    const newRow = row + dRow;
    const newCol = col + dCol;
    if (isValidPosition(newRow, newCol)) {
      board[newRow][newCol].classList.add("valid");
    }
  });
}

function isValidPosition(row, col) {
  return row >= 0 && row < boardSize && col >= 0 && col < boardSize;
}

function isValidFEN(fen) {
  const fenParts = fen.split(" ");
  if (fenParts.length !== 6) return false;

  const [piecePlacement, activeColor, castling, enPassant, halfmove, fullmove] =
    fenParts;

  // Check piece placement
  const rows = piecePlacement.split("/");
  if (rows.length !== 8) return false;

  for (const row of rows) {
    let sum = 0;
    for (const char of row) {
      if (isNaN(char)) {
        if (!"pnbrqkPNBRQK".includes(char)) return false;
        sum++;
      } else {
        sum += parseInt(char);
      }
    }
    if (sum !== 8) return false;
  }

  // Check active color
  if (!"wb".includes(activeColor)) return false;

  // Check castling (allowing custom 'HAha' in addition to standard '-KQkq')
  if (!/^[-KQkqHAha]*$/.test(castling)) return false;

  // Check en passant target square
  if (!/^-|[a-h][36]$/.test(enPassant)) return false;

  // Check halfmove and fullmove numbers
  if (isNaN(halfmove) || isNaN(fullmove)) return false;

  return true;
}

// Example usage
const testFEN = "5n2/8/7q/8/2n5/8/8/7N w HAha - 0 1";
console.log(isValidFEN(testFEN)); // should return true if valid

// Modify the initializeGame function to include FEN input
function initializeGame() {
  const boardElement = document.getElementById("board");
  boardElement.innerHTML = "";
  boardElement.style.gridTemplateColumns = `repeat(${boardSize}, 30px)`;
  boardElement.style.gridTemplateRows = `repeat(${boardSize}, 30px)`;
  board = createBoard(boardElement);

  const defaultFEN = "5n2/8/7q/8/2n5/8/8/7N w HAha - 0 1";
  const fenInput = document.getElementById("fen-input");
  fenInput.value = defaultFEN;

  loadFEN(defaultFEN);
}

// Modify the loadFEN function to update the current piece
function loadFEN(fen) {
  if (!isValidFEN(fen)) {
    alert("Invalid FEN code");
    return;
  }

  const [piecePlacement, activeColor] = fen.split(" ");

  clearBoard();

  let row = 0;
  let col = 0;

  for (const char of piecePlacement) {
    if (char === "/") {
      row++;
      col = 0;
    } else if (isNaN(char)) {
      placePieceFromFEN(char, row, col);
      col++;
    } else {
      col += parseInt(char);
    }
  }

  // Set the current piece based on active color
  const currentPieceChar = activeColor === "w" ? "N" : "n";
  setCurrentPiece(currentPieceChar);
}

function placePieceFromFEN(char, row, col) {
  const pieceType = getFENPieceType(char);
  if (pieceType) {
    placePiece(pieceType, row, col);
  }
}

function getFENPieceType(char) {
  const fenToPieceType = {
    n: "n",
    N: "N",
    q: "q",
    Q: "Q",
    b: "b",
    B: "B",
    r: "r",
    R: "R",
  };
  return fenToPieceType[char];
}

// Add this function to set the current piece
function setCurrentPiece(pieceChar) {
  const pieceType = getFENPieceType(pieceChar);
  if (pieceType) {
    for (let row = 0; row < boardSize; row++) {
      for (let col = 0; col < boardSize; col++) {
        const piece = board[row][col].querySelector(".piece");
        if (piece && piece.textContent === pieces[pieceType]) {
          currentPiece = { type: pieceType, row, col };
          piece.classList.add("currentPiece");
          piece.addEventListener("click", toggleValidPositions);
          return;
        }
      }
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const startButton = document.createElement("button");
  startButton.textContent = "Start Game";
  startButton.addEventListener("click", initializeGame);
  document.body.insertBefore(startButton, document.getElementById("board"));

  const fenInput = document.createElement("input");
  fenInput.type = "text";
  fenInput.id = "fen-input";
  fenInput.placeholder = "Enter FEN position";

  const loadFENButton = document.createElement("button");
  loadFENButton.textContent = "Load FEN";
  loadFENButton.addEventListener("click", () => loadFEN(fenInput.value));

  document.body.insertBefore(fenInput, document.getElementById("board"));
  document.body.insertBefore(loadFENButton, document.getElementById("board"));

  initializeGame();

  initializeGame();
});
