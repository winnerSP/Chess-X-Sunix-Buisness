// CHESS X SUNIX — Chess Core

const WHITE = "white";
const BLACK = "black";

let boardState = createStartingBoard();
let currentTurn = WHITE;


// Special chess-rule state
let gameState = {
    enPassant: null,

    whiteKingMoved: false,
    blackKingMoved: false,

    whiteRookLeftMoved: false,
    whiteRookRightMoved: false,

    blackRookLeftMoved: false,
    blackRookRightMoved: false
};


function createStartingBoard() {

    return [
        [
            "black-rook",
            "black-knight",
            "black-bishop",
            "black-queen",
            "black-king",
            "black-bishop",
            "black-knight",
            "black-rook"
        ],

        [
            "black-pawn",
            "black-pawn",
            "black-pawn",
            "black-pawn",
            "black-pawn",
            "black-pawn",
            "black-pawn",
            "black-pawn"
        ],

        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],

        [
            "white-pawn",
            "white-pawn",
            "white-pawn",
            "white-pawn",
            "white-pawn",
            "white-pawn",
            "white-pawn",
            "white-pawn"
        ],

        [
            "white-rook",
            "white-knight",
            "white-bishop",
            "white-queen",
            "white-king",
            "white-bishop",
            "white-knight",
            "white-rook"
        ]
    ];
}


const PIECE_SYMBOLS = {

    "white-king": "♔",
    "white-queen": "♕",
    "white-rook": "♖",
    "white-bishop": "♗",
    "white-knight": "♘",
    "white-pawn": "♙",

    "black-king": "♚",
    "black-queen": "♛",
    "black-rook": "♜",
    "black-bishop": "♝",
    "black-knight": "♞",
    "black-pawn": "♟"
};


function pieceSymbol(piece) {
    return PIECE_SYMBOLS[piece] || "";
}


function pieceColor(piece) {

    if (!piece) {
        return null;
    }

    return piece.startsWith("white")
        ? WHITE
        : BLACK;
}


function pieceType(piece) {

    if (!piece) {
        return null;
    }

    return piece.split("-")[1];
}


function insideBoard(row, col) {

    return (
        row >= 0 &&
        row < 8 &&
        col >= 0 &&
        col < 8
    );
}


function pathClear(
    fromRow,
    fromCol,
    toRow,
    toCol
) {

    const rowStep =
        Math.sign(toRow - fromRow);

    const colStep =
        Math.sign(toCol - fromCol);

    let row = fromRow + rowStep;
    let col = fromCol + colStep;

    while (
        row !== toRow ||
        col !== toCol
    ) {

        if (boardState[row][col] !== null) {
            return false;
        }

        row += rowStep;
        col += colStep;
    }

    return true;
}


function isEnPassantMove(
    fromRow,
    fromCol,
    toRow,
    toCol
) {

    const piece =
        boardState[fromRow][fromCol];

    if (!piece) {
        return false;
    }

    if (pieceType(piece) !== "pawn") {
        return false;
    }

    if (!gameState.enPassant) {
        return false;
    }

    return (
        gameState.enPassant.row === toRow &&
        gameState.enPassant.col === toCol &&
        Math.abs(toCol - fromCol) === 1 &&
        toRow - fromRow ===
            (pieceColor(piece) === WHITE ? -1 : 1) &&
        boardState[toRow][toCol] === null
    );
}


function isCastlingMove(
    fromRow,
    fromCol,
    toRow,
    toCol
) {

    const piece =
        boardState[fromRow][fromCol];

    if (!piece) {
        return false;
    }

    if (pieceType(piece) !== "king") {
        return false;
    }

    if (fromRow !== toRow) {
        return false;
    }

    return Math.abs(toCol - fromCol) === 2;
}


function isPseudoLegalMove(
    fromRow,
    fromCol,
    toRow,
    toCol
) {

    if (!insideBoard(toRow, toCol)) {
        return false;
    }

    const piece =
        boardState[fromRow][fromCol];

    if (!piece) {
        return false;
    }

    const target =
        boardState[toRow][toCol];

    // Kings are never captured.
    if (
        target &&
        pieceType(target) === "king"
    ) {
        return false;
    }

    if (
        target &&
        pieceColor(target) === pieceColor(piece)
    ) {
        return false;
    }

    const type = pieceType(piece);
    const color = pieceColor(piece);

    const rowDiff =
        toRow - fromRow;

    const colDiff =
        toCol - fromCol;

    const absRow =
        Math.abs(rowDiff);

    const absCol =
        Math.abs(colDiff);


    // PAWN
    if (type === "pawn") {

        const direction =
            color === WHITE ? -1 : 1;

        const startRow =
            color === WHITE ? 6 : 1;


        if (
            colDiff === 0 &&
            rowDiff === direction &&
            !target
        ) {
            return true;
        }


        if (
            colDiff === 0 &&
            rowDiff === direction * 2 &&
            fromRow === startRow &&
            !target &&
            boardState[fromRow + direction][fromCol] === null
        ) {
            return true;
        }


        if (
            absCol === 1 &&
            rowDiff === direction &&
            target &&
            pieceColor(target) !== color
        ) {
            return true;
        }


        // EN PASSANT
        if (
            isEnPassantMove(
                fromRow,
                fromCol,
                toRow,
                toCol
            )
        ) {
            return true;
        }

        return false;
    }


    // KNIGHT
    if (type === "knight") {

        return (
            (absRow === 2 && absCol === 1) ||
            (absRow === 1 && absCol === 2)
        );
    }


    // KING
    if (type === "king") {

        // Normal king move
        if (
            absRow <= 1 &&
            absCol <= 1 &&
            absRow + absCol > 0
        ) {
            return true;
        }

        // Castling geometry
        if (
            absRow === 0 &&
            absCol === 2
        ) {
            return true;
        }

        return false;
    }


    // ROOK
    if (type === "rook") {

        if (
            fromRow !== toRow &&
            fromCol !== toCol
        ) {
            return false;
        }

        return pathClear(
            fromRow,
            fromCol,
            toRow,
            toCol
        );
    }


    // BISHOP
    if (type === "bishop") {

        if (absRow !== absCol) {
            return false;
        }

        return pathClear(
            fromRow,
            fromCol,
            toRow,
            toCol
        );
    }


    // QUEEN
    if (type === "queen") {

        const straight =
            fromRow === toRow ||
            fromCol === toCol;

        const diagonal =
            absRow === absCol;

        if (!straight && !diagonal) {
            return false;
        }

        return pathClear(
            fromRow,
            fromCol,
            toRow,
            toCol
        );
    }


    return false;
}


function resetGame() {

    boardState =
        createStartingBoard();

    currentTurn = WHITE;

    gameState = {

        enPassant: null,

        whiteKingMoved: false,
        blackKingMoved: false,

        whiteRookLeftMoved: false,
        whiteRookRightMoved: false,

        blackRookLeftMoved: false,
        blackRookRightMoved: false
    };
}
