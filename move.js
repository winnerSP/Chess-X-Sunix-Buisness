// CHESS X SUNIX — Move Executor
// Promotion + En Passant + Castling

function updateCastlingRights(
    piece,
    fromRow,
    fromCol,
    toRow,
    toCol,
    capturedPiece
) {

    // King moved
    if (piece === "white-king") {
        gameState.whiteKingMoved = true;
    }

    if (piece === "black-king") {
        gameState.blackKingMoved = true;
    }


    // Rook moved
    if (
        piece === "white-rook" &&
        fromRow === 7 &&
        fromCol === 0
    ) {
        gameState.whiteRookLeftMoved = true;
    }

    if (
        piece === "white-rook" &&
        fromRow === 7 &&
        fromCol === 7
    ) {
        gameState.whiteRookRightMoved = true;
    }

    if (
        piece === "black-rook" &&
        fromRow === 0 &&
        fromCol === 0
    ) {
        gameState.blackRookLeftMoved = true;
    }

    if (
        piece === "black-rook" &&
        fromRow === 0 &&
        fromCol === 7
    ) {
        gameState.blackRookRightMoved = true;
    }


    // Rook captured on starting square
    if (capturedPiece === "white-rook") {

        if (toRow === 7 && toCol === 0) {
            gameState.whiteRookLeftMoved = true;
        }

        if (toRow === 7 && toCol === 7) {
            gameState.whiteRookRightMoved = true;
        }
    }


    if (capturedPiece === "black-rook") {

        if (toRow === 0 && toCol === 0) {
            gameState.blackRookLeftMoved = true;
        }

        if (toRow === 0 && toCol === 7) {
            gameState.blackRookRightMoved = true;
        }
    }
}


function executeMove(
    fromRow,
    fromCol,
    toRow,
    toCol,
    promotionPiece = null
) {

    const piece =
        boardState[fromRow][fromCol];

    if (!piece) return false;

    const color =
        pieceColor(piece);

    const capturedPiece =
        boardState[toRow][toCol];


    // Clear old en-passant rights.
    gameState.enPassant = null;


    // Update castling rights.
    updateCastlingRights(
        piece,
        fromRow,
        fromCol,
        toRow,
        toCol,
        capturedPiece
    );


    // EN PASSANT
    if (
        isEnPassantMove(
            fromRow,
            fromCol,
            toRow,
            toCol
        )
    ) {

        const direction =
            color === WHITE ? 1 : -1;

        boardState[
            toRow + direction
        ][toCol] = null;
    }


    // Move piece.
    boardState[toRow][toCol] = piece;
    boardState[fromRow][fromCol] = null;


    // CASTLING
    if (
        pieceType(piece) === "king" &&
        Math.abs(toCol - fromCol) === 2
    ) {

        const row = fromRow;

        // Kingside
        if (toCol === 6) {

            boardState[row][5] =
                boardState[row][7];

            boardState[row][7] = null;
        }

        // Queenside
        if (toCol === 2) {

            boardState[row][3] =
                boardState[row][0];

            boardState[row][0] = null;
        }
    }


    // Pawn moved two squares:
    // create the temporary en-passant square.
    if (
        pieceType(piece) === "pawn" &&
        Math.abs(toRow - fromRow) === 2
    ) {

        gameState.enPassant = {
            row: (fromRow + toRow) / 2,
            col: fromCol
        };
    }


    // PROMOTION
    if (
        pieceType(piece) === "pawn" &&
        (toRow === 0 || toRow === 7)
    ) {

        if (promotionPiece) {

            boardState[toRow][toCol] =
                promotionPiece;

        } else {

            boardState[toRow][toCol] =
                getPromotionPiece(color);
        }
    }


    currentTurn =
        currentTurn === WHITE
            ? BLACK
            : WHITE;

    return true;
}
