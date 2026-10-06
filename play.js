/* =========================================
   CHESS X SUNIX
   PLAY CONTROLLER
========================================= */

let activeBotRating = null;


/*
 * START BOT GAME
 */

function startBotGame(botRating) {

    activeBotRating = botRating;

    resetGame();

    gameOver = false;
    selectedSquare = null;

    renderBoard();

    const status =
        document.getElementById("game-status");

    if (status) {

        status.textContent =
            "You are White • Bot Rating: " +
            botRating;
    }
}


/*
 * PLAY ONLINE
 *
 * Multiplayer will be connected to the
 * CXSDB backend later.
 */

function playOnline() {

    const status =
        document.getElementById("game-status");

    if (status) {

        status.textContent =
            "Online Play • Multiplayer is coming soon.";
    }

    console.log(
        "CHESS X SUNIX: Online Play selected."
    );
}