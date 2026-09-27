/* =========================================
   CHESS X SUNIX
   GAME CONTROLLER
========================================= */

let gameOver = false;


/* =========================================
   CHECK GAME STATUS
========================================= */

function checkGameStatus() {

    const status =
        document.getElementById(
            "game-status"
        );

    if (
        isCheckmate(currentTurn)
    ) {

        gameOver = true;

        const winner =
            currentTurn === WHITE
                ? BLACK
                : WHITE;

        if (status) {

            status.textContent =
                winner.toUpperCase() +
                " WINS — CHECKMATE!";

        }

        return;

    }


    if (
        isStalemate(currentTurn)
    ) {

        gameOver = true;

        if (status) {

            status.textContent =
                "DRAW — STALEMATE.";

        }

        return;

    }


    if (
        isKingInCheck(currentTurn)
    ) {

        if (status) {

            status.textContent =
                currentTurn.toUpperCase() +
                " IS IN CHECK!";

        }

        return;

    }


    if (status) {

        status.textContent =
            currentTurn.toUpperCase() +
            " TO MOVE.";

    }

}


/* =========================================
   START GAME
========================================= */

function startGame() {

    resetGame();

    gameOver = false;

    if (
        typeof renderBoard === "function"
    ) {
        renderBoard();
    }

    checkGameStatus();

}
