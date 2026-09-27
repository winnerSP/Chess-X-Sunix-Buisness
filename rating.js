function calculateRatingChange(
    playerRating,
    opponentRating,
    result
) {

    const K = 32;

    const expected =
        1 /
        (
            1 +
            Math.pow(
                10,
                (opponentRating - playerRating) / 400
            )
        );


    return Math.round(
        K * (result - expected)
    );

}


function updateRating(
    player,
    opponentRating,
    result
) {

    const change =
        calculateRatingChange(
            player.rating,
            opponentRating,
            result
        );


    player.rating += change;

    if (player.rating < 0) {
        player.rating = 0;
    }

    return change;

}
