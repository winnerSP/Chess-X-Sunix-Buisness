let activeBotRating = null;


function startBotGame(botRating) {

    activeBotRating = botRating;

    resetBoard();

    const status =
        document.getElementById("game-status");

    if (status) {

        status.textContent =
            "You are White. Bot rating: " +
            botRating;

    }

}


document.addEventListener(
    "DOMContentLoaded",
    () => {

        createBoard();

    }
);
