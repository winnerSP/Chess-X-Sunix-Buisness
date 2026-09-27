// CHESS X SUNIX — Chess Engine

const PIECE_VALUES = {
    pawn: 100,
    knight: 320,
    bishop: 330,
    rook: 500,
    queen: 900,
    king: 20000
};


// Generate pseudo-legal moves.
// A king is NEVER a capturable target.
function generateMoves(color) {

    const moves = [];

    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {

            const piece = boardState[row][col];

            if (!piece) continue;
            if (pieceColor(piece) !== color) continue;

            for (let toRow = 0; toRow < 8; toRow++) {
                for (let toCol = 0; toCol < 8; toCol++) {

                    const target = boardState[toRow][toCol];

                    // Kings are never captured.
                    if (target && pieceType(target) === "king") {
                        continue;
                    }

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


function evaluatePosition() {

    let score = 0;

    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {

            const piece = boardState[row][col];

            if (!piece) continue;

            const type = pieceType(piece);
            const value = PIECE_VALUES[type] || 0;

            if (pieceColor(piece) === WHITE) {
                score += value;
            } else {
                score -= value;
            }
        }
    }

    return score;
}


function copyBoard() {
    return boardState.map(row => [...row]);
}


// Temporarily make a move for engine calculation.
function testMove(move) {

    const oldBoard = copyBoard();

    boardState[move.toRow][move.toCol] =
        boardState[move.fromRow][move.fromCol];

    boardState[move.fromRow][move.fromCol] = null;

    return {
        oldBoard: oldBoard
    };
}


function undoTest(state) {
    boardState = state.oldBoard;
}


// Minimax searches ONLY legal moves.
function minimax(depth, maximizing) {

    if (depth === 0) {
        return evaluatePosition();
    }

    const color = maximizing ? WHITE : BLACK;

    const moves = generateLegalMoves(color);

    // No legal moves.
    if (moves.length === 0) {

        // Checkmate.
        if (isKingInCheck(color)) {

            return maximizing
                ? -999999
                : 999999;
        }

        // Stalemate.
        return 0;
    }


    if (maximizing) {

        let best = -Infinity;

        for (const move of moves) {

            const state = testMove(move);

            const score = minimax(
                depth - 1,
                false
            );

            undoTest(state);

            best = Math.max(best, score);
        }

        return best;
    }


    let best = Infinity;

    for (const move of moves) {

        const state = testMove(move);

        const score = minimax(
            depth - 1,
            true
        );

        undoTest(state);

        best = Math.min(best, score);
    }

    return best;
}


// Find the best move for BLACK.
function findBestMove(depth = 2) {

    const moves = generateLegalMoves(BLACK);

    if (moves.length === 0) {
        return null;
    }

    let bestMove = moves[0];
    let bestScore = Infinity;

    for (const move of moves) {

        const state = testMove(move);

        const score = minimax(
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
