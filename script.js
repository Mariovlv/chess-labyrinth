const boardSize = 8;
let validPositionsShown = false;
let currentPiece = null;
const pieces = {
  K: "♔",
  Q: "♕",
  R: "♖",
  B: "♗",
  N: "♘",
  P: "♙",
  k: "♚",
  q: "♛",
  r: "♜",
  b: "♝",
  n: "♞",
  p: "♟",
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

class Square {
  constructor(row, col) {
    this.row = row;
    this.col = col;
    this.piece = null;
  }

  setPiece(piece) {
    this.piece = piece;
  }

  removePiece() {
    this.piece = null;
  }

  hasPiece() {
    return this.piece !== null;
  }
}

class Board {
  constructor(size, exitCol, exitRow) {
    this.size = size;
    this.exitCol = exitCol;
    this.exitRow = exitRow;
    this.board = this.initializeBoard();
  }

  initializeBoard() {
    const boardElement = document.getElementById("chess-game-container");
    boardElement.innerHTML = "";
    boardElement.style.gridTemplateColumns = `repeat(${this.size}, 30px)`;
    boardElement.style.gridTemplateRows = `repeat(${this.size}, 30px)`;

    const newBoard = [];
    for (let row = 0; row < this.size; row++) {
      const boardRow = [];
      for (let col = 0; col < this.size; col++) {
        const square = this.createSquare(row, col);
        boardElement.appendChild(square);
        boardRow.push(new Square(row, col));
      }
      newBoard.push(boardRow);
    }
    return newBoard;
  }

  createSquare(row, col) {
    const squareElement = document.createElement("div");
    squareElement.classList.add("square");
    if ((row + col) % 2 === 1) {
      squareElement.classList.add("black");
    }
    if (row === this.exitRow && col === this.exitCol) {
      squareElement.classList.add("exit");
    }
    squareElement.dataset.row = row;
    squareElement.dataset.col = col;
    return squareElement;
  }

  placePiece(piece, row, col) {
    if (this.board[row] && this.board[row][col]) {
      this.board[row][col].setPiece(piece);
    }
  }
}

class FENParser {
  static isValidFEN(fen) {
    if (!fen) return "NotFound";
    const fenParts = fen.split(" ");
    if (fenParts.length !== 6) return "Invalid";

    const [
      piecePlacement,
      activeColor,
      castling,
      enPassant,
      halfmove,
      fullmove,
    ] = fenParts;

    return isValidPiecePlacement(piecePlacement) &&
      isValidActiveColor(activeColor) &&
      isValidCastling(castling) &&
      isValidEnPassant(enPassant) &&
      isValidNumber(halfmove) &&
      isValidNumber(fullmove) &&
      isOnlyOneWhitePiece(piecePlacement)
      ? "Correct"
      : "Invalid";
  }

  static parse(fenString) {
    const [piecePlacement] = fenString.split(" ");
    const rows = piecePlacement.split("/");
    const pieces = [];

    rows.forEach((row, rowIndex) => {
      let colIndex = 0;
      for (let i = 0; i < row.length; i++) {
        const char = row[i];
        if (isNaN(char)) {
          pieces.push({ piece: char, row: rowIndex, col: colIndex });
          colIndex++;
        } else {
          colIndex += parseInt(char, 10);
        }
      }
    });

    return pieces;
  }
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

class Game {
  constructor() {
    this.board = null;
    this.boardSize = 8;
    this.currentPiece = null;
    this.validPositionsShown = false;
  }

  initializeGame() {
    const fenInput = document.getElementById("fen-input");
    const fenValidation = FENParser.isValidFEN(fenInput.value);

    if (fenValidation !== "Correct") {
      const newAlert = new Alert();
      return newAlert.addAlert(fenSwitch(fenValidation));
    }

    console.log("Proceeding to render table");
    this.renderTable(fenInput.value);
  }

  placePiece(type, row, col) {
    const piece = document.createElement("span");
    piece.innerText = pieces[type];
    piece.className = isWhitePiece(type) ? "currentPiece" : "piece";
    if (isWhitePiece(type)) {
      piece.addEventListener("click", (event) => {
        event.stopPropagation(); // Prevent triggering the square's click event
        this.toggleValidPositions(type, row, col);
      });
    }
    this.board[row][col].appendChild(piece);
  }

  placePiecesFromFEN(fenString) {
    const pieces = FENParser.parse(fenString);
    pieces.forEach(({ piece, row, col }) => {
      this.placePiece(piece, row, col);
    });
  }

  renderTable(fenString) {
    const boardElement = document.getElementById("board");
    boardElement.innerHTML = "";
    boardElement.style.gridTemplateColumns = `repeat(${this.boardSize}, 30px)`;
    boardElement.style.gridTemplateRows = `repeat(${this.boardSize}, 30px)`;

    this.board = this.createBoard(boardElement);
    this.placePiecesFromFEN(fenString);
  }

  createBoard(boardElement) {
    const newBoard = [];
    for (let row = 0; row < this.boardSize; row++) {
      const boardRow = [];
      for (let col = 0; col < this.boardSize; col++) {
        const square = this.createSquare(row, col);
        boardElement.appendChild(square);
        boardRow.push(square);
      }
      newBoard.push(boardRow);
    }
    return newBoard;
  }

  createSquare(row, col) {
    const square = document.createElement("div");
    square.classList.add("square");
    if ((row + col) % 2 === 1) {
      square.classList.add("black");
    }
    square.dataset.row = row;
    square.dataset.col = col;
    square.addEventListener("click", () => this.handleSquareClick(row, col));
    return square;
  }

  toggleValidPositions(type, row, col) {
    if (this.validPositionsShown) {
      this.clearValidPositions();
    } else {
      this.showValidPositions(type, row, col);
    }
    this.validPositionsShown = !this.validPositionsShown;
  }

  showValidPositions(type, row, col) {
    this.currentPiece = { type, row, col };
    this.clearValidPositions(); // Clear previous valid positions

    directions[type].forEach(([dRow, dCol]) => {
      const newRow = row + dRow;
      const newCol = col + dCol;
      if (this.isValidPosition(newRow, newCol)) {
        console.log(`Valid move: ${newRow}, ${newCol}`);
        const cell = this.board[newRow][newCol];
        cell.classList.add("valid");
      }
    });
  }

  clearValidPositions() {
    this.board.forEach((row) => {
      row.forEach((cell) => {
        cell.classList.remove("valid");
      });
    });
  }

  handleSquareClick(row, col) {
    if (
      this.validPositionsShown &&
      this.board[row][col].classList.contains("valid")
    ) {
      this.movePiece(row, col);
    }
  }

  movePiece(newRow, newCol) {
    if (!this.currentPiece) return;

    const { type, row: oldRow, col: oldCol } = this.currentPiece;
    const oldSquare = this.board[oldRow][oldCol];
    const newSquare = this.board[newRow][newCol];

    // Move the piece
    newSquare.innerHTML = "";
    newSquare.appendChild(oldSquare.querySelector(".currentPiece"));
    oldSquare.innerHTML = "";

    // Update the currentPiece
    this.currentPiece = { type, row: newRow, col: newCol };

    // Clear valid positions
    this.clearValidPositions();
    this.validPositionsShown = false;
  }

  isValidPosition(row, col) {
    return row >= 0 && row < this.boardSize && col >= 0 && col < this.boardSize;
  }
}

function isValidPosition(row, col) {
  return row >= 0 && row < boardSize && col >= 0 && col < boardSize;
}

class Alert {
  constructor() {
    this.alertContainer = document.getElementById("alert-container");
  }

  addAlert(message) {
    this.cleanAlert();
    const newAlert = document.createElement("div");
    newAlert.className = "alert";
    newAlert.textContent = message;
    this.alertContainer.appendChild(newAlert);
    setTimeout(() => this.cleanAlert(), 5000);
  }

  cleanAlert() {
    this.alertContainer.innerHTML = "";
  }
}

function isWhitePiece(piece) {
  return ["B", "R", "Q", "N"].includes(piece);
}

function isValidRow(row) {
  const sum = row
    .split("")
    .reduce((acc, char) => acc + (isNaN(char) ? 1 : parseInt(char)), 0);
  return sum === 8 && /^[pnbrqkPNBRQK1-8]+$/.test(row);
}

function isOnlyOneWhitePiece(words) {
  return (
    Array.from(words).filter((word) => ["B", "R", "Q", "N"].includes(word))
      .length === 1
  );
}

function isValidPiecePlacement(piecePlacement) {
  const rows = piecePlacement.split("/");
  return rows.length === 8 && rows.every(isValidRow);
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

const fenSwitch = (match) =>
  ({
    NotFound: "Error: FEN not found",
    Invalid: "Error: Invalid FEN",
    Correct: "Correct FEN format",
  }[match]);

document.addEventListener("DOMContentLoaded", () => {
  const startGame = document.getElementById("fen-load-button");
  const game = new Game();
  startGame.addEventListener("click", () => game.initializeGame());
});
