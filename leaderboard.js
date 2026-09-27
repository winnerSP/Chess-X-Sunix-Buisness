function displayLeaderboard() {

    const container =
        document.getElementById(
            "leaderboard"
        );

    if (!container) {
        return;
    }


    const players =
        getPlayers();


    players.sort(
        (a, b) =>
            b.rating - a.rating
    );


    container.innerHTML = "";


    if (players.length === 0) {

        container.innerHTML =
            "<p>No players yet.</p>";

        return;

    }


    players.forEach(
        (player, index) => {

            const row =
                document.createElement(
                    "div"
                );

            row.className =
                "feature-card";

            row.innerHTML =

                "<h2>#" +
                (index + 1) +
                " " +
                player.username +
                "</h2>" +

                "<p>Rating: " +
                player.rating +
                "</p>";

            container.appendChild(row);

        }
    );

}


document.addEventListener(
    "DOMContentLoaded",
    displayLeaderboard
);
