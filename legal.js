// CHESS X SUNIX — Legal Move System


function findKing(color) {

    for (let row = 0; row < 8; row++) {

        for (let col = 0; col < 8; col++) {

            const piece = boardState[row][col];

            if (piece === color + "-king") {
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

            if (pieceColor(piece) !== byColor) {
                continue;
            }

            /*
             * We deliberately use the movement rules here.
             * This asks:
             *
             * "Could this piece attack this square?"
             */

            const type = pieceType(piece);

            // Pawns attack diagonally even when the target square
            // is otherwise empty.
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

    // A missing king means the position is invalid.
    if (!king) {
        return true;
    }

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

    const movingPiece =
        boardState[move.fromRow][move.fromCol];

    // Never allow a move that captures a king.
    const target =
        boardState[move.toRow][move.toCol];

    if (target && pieceType(target) === "king") {
        return false;
    }

    boardState[move.toRow][move.toCol] =
        movingPiece;

    boardState[move.fromRow][move.fromCol] =
        null;

    const color =
        pieceColor(movingPiece);

    const legal =
        !isKingInCheck(color);

    boardState = oldBoard;

    return legal;
}


function isLegalMove(
    fromRow,
    fromCol,
    toRow,
    toCol
) {

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

    // A king can never be captured.
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
        move => testLegalMove(move)
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
