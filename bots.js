/* =========================================
   CHESS X SUNIX
   ENGINE BOT
========================================= */


/* =========================================
   BOT MOVE
========================================= */

function botMove() {

    if (gameOver) {
        return;
    }


    if (currentTurn !== BLACK) {
        return;
    }


    const status =
        document.getElementById(
            "game-status"
        );


    if (status) {

        status.textContent =
            "CHESS X SUNIX ENGINE is thinking...";

    }


    /*
        Bot strength will eventually control
        search depth.

        For now:

        800  -> depth 1
        1000 -> depth 2
        1200 -> depth 2
        1500 -> depth 3
    */

    let depth = 2;


    if (
        typeof activeBotRating !==
        "undefined"
    ) {

        if (activeBotRating >= 1500) {

            depth = 3;

        } else if (
            activeBotRating >= 1000
        ) {

            depth = 2;

        } else {

            depth = 1;

        }

    }


    const move =
        findBestMove(depth);


    if (!move) {

        if (
            typeof checkGameStatus ===
            "function"
        ) {

            checkGameStatus();

        }

        return;

    }


    makeMove(
        move.fromRow,
        move.fromCol,
        move.toRow,
        move.toCol
    );


    renderBoard();


    if (
        typeof checkGameStatus ===
        "function"
    ) {

        checkGameStatus();

    }


    if (status) {

        status.textContent =
            currentTurn.toUpperCase() +
            " TO MOVE.";

    }

}
