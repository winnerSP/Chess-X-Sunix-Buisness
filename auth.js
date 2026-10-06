/* =========================================
   CHESS X SUNIX
   AUTHENTICATION CONTROLLER
========================================= */


/*
 * GET CURRENT USER
 */

function getCurrentUser() {

    const userId =
        sessionStorage.getItem("cxsdb_user_id");

    const username =
        sessionStorage.getItem("cxsdb_username");


    if (!userId || !username) {
        return null;
    }


    return {

        id: userId,

        username: username

    };

}


/*
 * CHECK WHETHER USER IS LOGGED IN
 */

function isLoggedIn() {

    return getCurrentUser() !== null;

}


/*
 * LOGOUT
 */

function logoutUser() {

    sessionStorage.removeItem(
        "cxsdb_user_id"
    );

    sessionStorage.removeItem(
        "cxsdb_username"
    );

    window.location.href =
        "index.html";

}


/*
 * PROTECT A PAGE
 *
 * Use this on pages that require
 * an authenticated account.
 */

function requireLogin() {

    if (!isLoggedIn()) {

        window.location.href =
            "login.html";

        return false;

    }

    return true;

}