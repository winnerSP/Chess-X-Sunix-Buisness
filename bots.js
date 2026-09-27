function botMove() {

    if (currentTurn !== "black") {
        return;
    }

    const possibleMoves = [];

    for (let row = 0; row < 8; row++) {

        for (let col = 0; col < 8; col++) {

            const piece =
                boardState[row][col];

            if (
                piece &&
                pieceColor(piece) === "black"
            ) {

                for (let toRow = 0; toRow < 8; toRow++) {

                    for (let toCol = 0; toCol < 8; toCol++) {

                        if (
                            isLegalMove(
                                row,
                                col,
                                toRow,
                                toCol
                            )
                        ) {

                            possibleMoves.push({
                                fromRow: row,
                                fromCol: col,
                                toRow,
                                toCol
                            });

                        }

                    }

                }

            }

        }

    }


    if (possibleMoves.length === 0) {
        return;
    }


    const move =
        possibleMoves[
            Math.floor(
                Math.random() *
                possibleMoves.length
            )
        ];


    boardState[move.toRow][move.toCol] =
        boardState[move.fromRow][move.fromCol];

    boardState[move.fromRow][move.fromCol] =
        null;

    currentTurn = "white";

    renderBoard();

}
