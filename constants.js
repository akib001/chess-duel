const CHESS_PIECES = {
  WHITE_PAWN: "w_pawn",
  WHITE_KNIGHT: "w_knight",
  WHITE_ROOK: "w_rook",
  WHITE_BISHOP: "w_bishop",
  WHITE_QUEEN: "w_queen",
  WHITE_KING: "w_king",

  // Add the rest of the black chess pieces here
  BLACK_PAWN: "b_pawn",
  BLACK_BISHOP: "b_bishop",
  BLACK_QUEEN: "b_queen",
  BLACK_KING: "b_king",
  BLACK_ROOK: "b_rook",
  BLACK_KNIGHT: "b_knight",
};

module.exports = CHESS_PIECES;

let board = [
  [
    "",
    "w_knight",
    "w_bishop",
    "w_queen",
    "w_king",
    "w_bishop",
    "w_knight",
    "w_rook",
  ],
  ["", "w_pawn", "w_pawn", "w_pawn", "w_pawn", "w_pawn", "w_pawn", "w_pawn"],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "w_rook"],
  ["", "", "", "", "", "w_knight", "", ""],
  ["b_pawn", "", "", "", "", "", "", ""],
  ["", "", "b_pawn", "", "", "b_pawn", "b_pawn", "b_pawn"],
  [
    "b_rook",
    "",
    "b_bishop",
    "b_queen",
    "b_king",
    "b_bishop",
    "b_knight",
    "b_rook",
  ],
];

/*
  gameHistory = [{
    playerType, 
    startRow,
    StartCol,
    endRow,
    endCol, 
    captured,
  }]

*/
