let board = [];
let boardSize = 8;
let currentPiece = null;
let validPositionsShown = false;
const exitCol = 0;
const exitRow = 0;

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

function isWhitePiece(piece) {
  return ["B", "R", "Q", "N"].includes(piece);
}

function placePiece(type, row, col) {
  const piece = document.createElement("span");
  piece.innerText = pieces[type];
  piece.className = isWhitePiece(type) ? "currentPiece" : "piece";
  if (isWhitePiece(type)) {
    piece.addEventListener("click", toggleValidPositions);
    currentPiece = { type, row, col };
  }
  board[row][col].appendChild(piece);
}

function updateBoard() {
  // Clear all cell classes except 'square' and 'black'
  for (let row = 0; row < boardSize; row++) {
    for (let col = 0; col < boardSize; col++) {
      const cell = board[row][col];
      cell.className =
        "square" + (cell.classList.contains("black") ? " black" : "");
    }
  }

  // Mark the current piece
  const currentCell = board[currentPiece.row][currentPiece.col];
  currentCell.classList.add("current");

  // Mark the exit
  board[exitRow][exitCol].classList.add("exit");
}
function movePiece(newRow, newCol) {
  const { type, row, col } = currentPiece;
  console.log(`Moving ${type} from (${row},${col}) to (${newRow},${newCol})`);

  // Remove the piece from the old position
  const oldCell = board[row][col];
  const pieceElement = oldCell.querySelector(".currentPiece");
  oldCell.innerHTML = "";

  // Place the piece in the new position
  const newCell = board[newRow][newCol];
  newCell.appendChild(pieceElement);

  // Update the currentPiece object
  currentPiece.row = newRow;
  currentPiece.col = newCol;

  // Clear valid positions and update the board
  clearValidPositions();
  updateBoard();

  // Check if the game is won (piece reached the exit)
  if (newRow === exitRow && newCol === exitCol) {
    alert("Congratulations! You've reached the exit!");
    initializeGame(); // Restart the game
  }
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
      if (square.moveHandler) {
        square.removeEventListener("click", square.moveHandler);
        square.moveHandler = null;
      }
    })
  );
}

function showValidPositions() {
  const { type, row, col } = currentPiece;
  console.log(currentPiece);

  clearValidPositions(); // Clear previous valid positions

  directions[type].forEach(([dRow, dCol]) => {
    const newRow = row + dRow;
    const newCol = col + dCol;
    if (isValidPosition(newRow, newCol)) {
      console.log(`Valid move: ${newRow}, ${newCol}`);
      const cell = board[newRow][newCol];
      cell.classList.add("valid");
      cell.removeEventListener("click", cell.moveHandler); // Remove previous listener
      cell.moveHandler = () => movePiece(newRow, newCol); // Store the handler
      cell.addEventListener("click", cell.moveHandler);
    }
  });
}

function isValidPosition(row, col) {
  return row >= 0 && row < boardSize && col >= 0 && col < boardSize;
}

const isValidRow = (row) => {
  const sum = row
    .split("")
    .reduce((acc, char) => acc + (isNaN(char) ? 1 : parseInt(char)), 0);
  return sum === 8 && /^[pnbrqkPNBRQK1-8]+$/.test(row);
};

function isValidFEN(fen) {
  const fenParts = fen.split(" ");
  if (fenParts.length !== 6) return false;

  const [piecePlacement, activeColor, castling, enPassant, halfmove, fullmove] =
    fenParts;

  return (
    isValidPiecePlacement(piecePlacement) &&
    isValidActiveColor(activeColor) &&
    isValidCastling(castling) &&
    isValidEnPassant(enPassant) &&
    isValidNumber(halfmove) &&
    isValidNumber(fullmove) &&
    isOnlyOneWhitePiece(piecePlacement)

    // check if there is more than 1 white pieces
  );
}

function isOnlyOneWhitePiece(words) {
  return (
    Array.from(words).filter((word) => ["B", "R", "Q", "N"].includes(word))
      .length == 1
  );
}

function isValidPiecePlacement(piecePlacement) {
  const rows = piecePlacement.split("/");
  if (rows.length !== 8) return false;
  return rows.every(isValidRow);
}

function isValidActiveColor(activeColor) {
  return /^[wb]$/.test(activeColor);
}

function isValidCastling(castling) {
  return /^[-KQkqHAha]*$/.test(castling);
}

function isValidEnPassant(enPassant) {
  return /^(-|[a-h][36])$/.test(enPassant);
}

function isValidNumber(value) {
  return !isNaN(value) && Number.isInteger(parseFloat(value));
}

// Example usage
const testFEN = "5n2/8/7q/8/2n5/8/8/7N w HAha - 0 1";

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
  clearBoard();

  if (!isValidFEN(fen)) {
    alert("Invalid FEN code");
    return;
  }

  const [piecePlacement] = fen.split(" ");

  let row = 0;
  let col = 0;

  for (const char of piecePlacement) {
    if (char === "/") {
      row++;
      col = 0;
    } else if (isNaN(char)) {
      placePieceFromFEN(char, row, col);
      if (isWhitePiece(char)) {
        setCurrentPiece(char);
      }
      col++;
    } else {
      col += parseInt(char);
    }
  }

  // Set exit position (e.g., top-left corner)
  board[exitRow][exitCol].classList.add("exit");
  updateBoard();
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

// Add this function to set the current piecefunction setCurrentPiece(pieceChar) {
function setCurrentPiece(pieceChar) {
  const pieceType = getFENPieceType(pieceChar);
  console.log("To put as currentPiece: ", pieceChar, pieceType);
  if (pieceType) {
    for (let row = 0; row < boardSize; row++) {
      for (let col = 0; col < boardSize; col++) {
        const piece = board[row][col].querySelector(".currentPiece");
        if (piece && piece.textContent === pieces[pieceType]) {
          console.log("Current piece is:", pieceType, "at", row, col);
          currentPiece = { type: pieceType, row, col };
          piece.classList.add("currentPiece");
          piece.addEventListener("click", toggleValidPositions);
          console.log(currentPiece);
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
});
