// CHESS X SUNIX — Legal Move System

function findKing(color) {
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            if (boardState[row][col] === color + "-king") {
                return { row, col };
            }
        }
    }

    return null;
}


function isSquareAttacked(row, col, byColor) {

    for (let fromRow = 0; fromRow < 8; fromRow++) {
        for (let fromCol = 0; fromCol < 8; fromCol++) {

            const piece = boardState[fromRow][fromCol];

            if (!piece) continue;
            if (pieceColor(piece) !== byColor) continue;

            const type = pieceType(piece);

            // Pawn attacks
            if (type === "pawn") {

                const direction =
                    byColor === WHITE ? -1 : 1;

                if (
                    row - fromRow === direction &&
                    Math.abs(col - fromCol) === 1
                ) {
                    return true;
                }

                continue;
            }

            if (
                isPseudoLegalMove(
                    fromRow,
                    fromCol,
                    row,
                    col
                )
            ) {
                return true;
            }
        }
    }

    return false;
}


function isKingInCheck(color) {

    const king = findKing(color);

    if (!king) return true;

    const enemy =
        color === WHITE ? BLACK : WHITE;

    return isSquareAttacked(
        king.row,
        king.col,
        enemy
    );
}


function testLegalMove(move) {

    const oldBoard =
        boardState.map(row => [...row]);

    const oldGameState =
        JSON.parse(JSON.stringify(gameState));

    const movingPiece =
        boardState[move.fromRow][move.fromCol];

    const target =
        boardState[move.toRow][move.toCol];

    // Never capture a king.
    if (
        target &&
        pieceType(target) === "king"
    ) {
        return false;
    }

    // Temporarily make the move.
    boardState[move.toRow][move.toCol] =
        movingPiece;

    boardState[move.fromRow][move.fromCol] =
        null;


    // En passant capture.
    if (
        isEnPassantMove(
            move.fromRow,
            move.fromCol,
            move.toRow,
            move.toCol
        )
    ) {

        const direction =
            pieceColor(movingPiece) === WHITE
                ? 1
                : -1;

        boardState[
            move.toRow + direction
        ][move.toCol] = null;
    }


    const color =
        pieceColor(movingPiece);

    const legal =
        !isKingInCheck(color);

    // Restore everything.
    boardState = oldBoard;
    gameState = oldGameState;

    return legal;
}


function isCastlingLegal(
    fromRow,
    fromCol,
    toRow,
    toCol
) {

    const piece =
        boardState[fromRow][fromCol];

    if (!piece) return false;

    if (pieceType(piece) !== "king") {
        return false;
    }

    const color =
        pieceColor(piece);

    const row =
        color === WHITE ? 7 : 0;

    if (fromRow !== row || fromCol !== 4) {
        return false;
    }

    if (toRow !== row) {
        return false;
    }

    // Cannot castle while in check.
    if (isKingInCheck(color)) {
        return false;
    }


    // Kingside
    if (toCol === 6) {

        if (!canCastleKingside(color)) {
            return false;
        }

        // King passes through f-file.
        const old = boardState[row][4];

        boardState[row][4] = null;
        boardState[row][5] = old;

        const throughCheck =
            isKingInCheck(color);

        boardState[row][5] = null;
        boardState[row][4] = old;

        if (throughCheck) {
            return false;
        }

        return true;
    }


    // Queenside
    if (toCol === 2) {

        if (!canCastleQueenside(color)) {
            return false;
        }

        // King passes through d-file.
        const old = boardState[row][4];

        boardState[row][4] = null;
        boardState[row][3] = old;

        const throughCheck =
            isKingInCheck(color);

        boardState[row][3] = null;
        boardState[row][4] = old;

        if (throughCheck) {
            return false;
        }

        return true;
    }

    return false;
}


function isLegalMove(
    fromRow,
    fromCol,
    toRow,
    toCol
) {

    const piece =
        boardState[fromRow][fromCol];

    if (!piece) return false;


    // Castling
    if (
        pieceType(piece) === "king" &&
        Math.abs(toCol - fromCol) === 2
    ) {
        return isCastlingLegal(
            fromRow,
            fromCol,
            toRow,
            toCol
        );
    }


    if (
        !isPseudoLegalMove(
            fromRow,
            fromCol,
            toRow,
            toCol
        )
    ) {
        return false;
    }


    const target =
        boardState[toRow][toCol];

    if (
        target &&
        pieceType(target) === "king"
    ) {
        return false;
    }


    return testLegalMove({
        fromRow,
        fromCol,
        toRow,
        toCol
    });
}


function generateLegalMoves(color) {

    const pseudoMoves =
        generateMoves(color);

    return pseudoMoves.filter(
        move =>
            isLegalMove(
                move.fromRow,
                move.fromCol,
                move.toRow,
                move.toCol
            )
    );
}


function isCheckmate(color) {

    return (
        isKingInCheck(color) &&
        generateLegalMoves(color).length === 0
    );
}


function isStalemate(color) {

    return (
        !isKingInCheck(color) &&
        generateLegalMoves(color).length === 0
    );
}
