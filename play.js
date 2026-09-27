/* =========================================
   CHESS X SUNIX
   PLAY CONTROLLER
========================================= */

let activeBotRating = null;

function startBotGame(botRating) {

    activeBotRating = botRating;

    resetGame();

    gameOver = false;
    selectedSquare = null;

    renderBoard();

    const status = document.getElementById("game-status");

    if (status) {
        status.textContent =
            "You are White • Bot Rating: " + botRating;
    }
}
