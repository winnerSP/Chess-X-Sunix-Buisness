document.addEventListener(
    "DOMContentLoaded",
    () => {

        const user =
            getCurrentUser();


        if (!user) {
            return;
        }


        document.getElementById(
            "profile-name"
        ).textContent =
            user.username;


        document.getElementById(
            "profile-rating"
        ).textContent =
            user.rating;


        document.getElementById(
            "profile-games"
        ).textContent =
            user.games;


        document.getElementById(
            "profile-wins"
        ).textContent =
            user.wins;


        document.getElementById(
            "profile-losses"
        ).textContent =
            user.losses;


        document.getElementById(
            "profile-draws"
        ).textContent =
            user.draws;

    }
);
