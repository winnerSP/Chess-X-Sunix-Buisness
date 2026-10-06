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
 */

function playOnline() {

    const username =
        sessionStorage.getItem("cxsdb_username");

    const userId =
        sessionStorage.getItem("cxsdb_user_id");

    const status =
        document.getElementById("game-status");


    /*
     * PLAYER IS NOT LOGGED IN
     */

    if (!username || !userId) {

        if (status) {

            status.textContent =
                "You must log in before playing online.";
        }

        return;
    }


    /*
     * PLAYER IS LOGGED IN
     */

    if (status) {

        status.textContent =
            "Online Play • Welcome, " +
            username +
            "! Matchmaking is coming soon.";
    }

    console.log(
        "CHESS X SUNIX: Online Play selected by " +
        username
    );
}