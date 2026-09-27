function saveCurrentUser(user) {

    localStorage.setItem(
        "currentUser",
        JSON.stringify(user)
    );

}


function getCurrentUser() {

    const data =
        localStorage.getItem(
            "currentUser"
        );

    if (!data) {
        return null;
    }

    return JSON.parse(data);

}


function savePlayers(players) {

    localStorage.setItem(
        "players",
        JSON.stringify(players)
    );

}


function getPlayers() {

    const data =
        localStorage.getItem(
            "players"
        );

    if (!data) {
        return [];
    }

    return JSON.parse(data);

}
