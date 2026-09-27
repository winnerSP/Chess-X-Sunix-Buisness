function createUser(username) {

    return {

        username: username,

        rating: 800,

        games: 0,

        wins: 0,

        losses: 0,

        draws: 0

    };

}


function login() {

    const input =
        document.getElementById("username");

    if (!input) {
        return;
    }

    const username =
        input.value.trim();

    if (!username) {
        return;
    }


    const user =
        createUser(username);

    saveCurrentUser(user);

    const status =
        document.getElementById("login-status");

    if (status) {

        status.textContent =
            "Logged in as " + username;

    }

}


function logoutUser() {

    localStorage.removeItem(
        "currentUser"
    );

    window.location.href =
        "index.html";

}
