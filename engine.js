/* =========================================
   CHESS X SUNIX ENGINE
   MOVE GENERATION + SEARCH
========================================= */

const PIECE_VALUES = {
    pawn: 100,
    knight: 320,
    bishop: 330,
    rook: 500,
    queen: 900,
    king: 20000
};


/* =========================================
   GENERATE PSEUDO-LEGAL MOVES
========================================= */

function generateMoves(color) {

    const moves = [];

    for (let row = 0; row < 8; row++) {

        for (let col = 0; col < 8; col++) {

            const piece = boardState[row][col];

            if (!piece) continue;

            if (pieceColor(piece) !== color) {
                continue;
            }

            for (let toRow = 0; toRow < 8; toRow++) {

                for (let toCol = 0; toCol < 8; toCol++) {

                    if (
                        isPseudoLegalMove(
                            row,
                            col,
                            toRow,
                            toCol
                        )
                    ) {

                        moves.push({
                            fromRow: row,
                            fromCol: col,
                            toRow: toRow,
                            toCol: toCol
                        });

                    }
                }
            }
        }
    }

    return moves;
}


/* =========================================
   POSITION EVALUATION
========================================= */

function evaluatePosition() {

    let score = 0;

    for (let row = 0; row < 8; row++) {

        for (let col = 0; col < 8; col++) {

            const piece = boardState[row][col];

            if (!piece) continue;

            const type = pieceType(piece);

            const value =
                PIECE_VALUES[type];

            if (pieceColor(piece) === WHITE) {

                score += value;

            } else {

                score -= value;

            }
        }
    }

    return score;
}


/* =========================================
   COPY BOARD
========================================= */

function copyBoard() {

    return boardState.map(
        row => [...row]
    );
}


/* =========================================
   TEST MOVE
========================================= */

function testMove(move) {

    const oldBoard =
        copyBoard();

    const captured =
        boardState[
            move.toRow
        ][
            move.toCol
        ];

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

    return {
        oldBoard,
        captured
    };
}


/* =========================================
   UNDO TEST MOVE
========================================= */

function undoTest(state) {

    boardState =
        state.oldBoard;
}


/* =========================================
   MINIMAX
========================================= */

function minimax(depth, maximizing) {

    if (depth === 0) {

        return evaluatePosition();

    }

    const color =
        maximizing
            ? WHITE
            : BLACK;

    const moves =
        generateMoves(color);

    if (moves.length === 0) {

        return evaluatePosition();

    }


    if (maximizing) {

        let best = -Infinity;

        for (const move of moves) {

            const state =
                testMove(move);

            const score =
                minimax(
                    depth - 1,
                    false
                );

            undoTest(state);

            best =
                Math.max(
                    best,
                    score
                );
        }

        return best;
    }


    let best = Infinity;

    for (const move of moves) {

        const state =
            testMove(move);

        const score =
            minimax(
                depth - 1,
                true
            );

        undoTest(state);

        best =
            Math.min(
                best,
                score
            );
    }

    return best;
}


/* =========================================
   FIND BEST BLACK MOVE
========================================= */

function findBestMove(depth = 2) {

    const moves =
        generateMoves(BLACK);

    if (moves.length === 0) {

        return null;

    }


    let bestMove =
        moves[0];

    let bestScore =
        Infinity;


    for (const move of moves) {

        const state =
            testMove(move);

        const score =
            minimax(
                depth - 1,
                true
            );

        undoTest(state);


        if (score < bestScore) {

            bestScore = score;

            bestMove = move;

        }
    }


    return bestMove;
}
