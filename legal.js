/* =========================================
   CHESS X SUNIX ENGINE
   LEGAL MOVE SYSTEM
========================================= */


/* =========================================
   FIND KING
========================================= */

function findKing(color) {

    for (let row = 0; row < 8; row++) {

        for (let col = 0; col < 8; col++) {

            const piece = boardState[row][col];

            if (
                piece === color + "-king"
            ) {
                return {
                    row,
                    col
                };
            }

        }

    }

    return null;
}


/* =========================================
   IS SQUARE ATTACKED
========================================= */

function isSquareAttacked(
    row,
    col,
    byColor
) {

    for (let fromRow = 0; fromRow < 8; fromRow++) {

        for (let fromCol = 0; fromCol < 8; fromCol++) {

            const piece =
                boardState[fromRow][fromCol];

            if (!piece) {
                continue;
            }

            if (pieceColor(piece) !== byColor) {
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


/* =========================================
   IS KING IN CHECK
========================================= */

function isKingInCheck(color) {

    const king =
        findKing(color);

    if (!king) {
        return true;
    }

    const enemy =
        color === WHITE
            ? BLACK
            : WHITE;

    return isSquareAttacked(
        king.row,
        king.col,
        enemy
    );
}


/* =========================================
   TEST LEGAL MOVE
========================================= */

function testLegalMove(move) {

    const oldBoard =
        boardState.map(
            row => [...row]
        );

    boardState[
        move.toRow
    ][
        move.toCol
    ] =
        boardState[
            move.fromRow
        ][
            move.fromCol
        ];

    boardState[
        move.fromRow
    ][
        move.fromCol
    ] = null;


    const color =
        pieceColor(
            boardState[
                move.toRow
            ][
                move.toCol
            ]
        );


    const legal =
        !isKingInCheck(color);


    boardState = oldBoard;

    return legal;
}


/* =========================================
   LEGAL MOVE
========================================= */

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


    return testLegalMove({

        fromRow,
        fromCol,
        toRow,
        toCol

    });

}


/* =========================================
   GENERATE LEGAL MOVES
========================================= */

function generateLegalMoves(color) {

    const pseudoMoves =
        generateMoves(color);

    return pseudoMoves.filter(
        move =>
            testLegalMove(move)
    );

}


/* =========================================
   CHECKMATE
========================================= */

function isCheckmate(color) {

    return (
        isKingInCheck(color) &&
        generateLegalMoves(color).length === 0
    );

}


/* =========================================
   STALEMATE
========================================= */

function isStalemate(color) {

    return (
        !isKingInCheck(color) &&
        generateLegalMoves(color).length === 0
    );

}
