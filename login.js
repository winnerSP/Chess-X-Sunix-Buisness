const CXSDB_SERVER =
    "https://vigilant-fiesta-5vgq74r9pq7jf7jq6-8080.app.github.dev";


const form =
    document.getElementById("loginForm");

const message =
    document.getElementById("loginMessage");

const loginButton =
    document.getElementById("loginButton");

const createAccountButton =
    document.getElementById("createAccountButton");


function showMessage(text) {
    message.textContent = text;
}


/*
 * LOGIN
 */

form.addEventListener("submit", async (event) => {

    /*
     * VERY IMPORTANT:
     *
     * Stop the browser's normal form submission.
     *
     * Without this, the browser can put the
     * form values into the URL.
     */

    event.preventDefault();
    event.stopPropagation();


    const username =
        document
            .getElementById("username")
            .value
            .trim();

    const password =
        document
            .getElementById("password")
            .value;

    const terms =
        document
            .getElementById("terms")
            .checked;


    if (!terms) {

        showMessage(
            "Please accept the Terms & Conditions."
        );

        return;
    }


    if (!username) {

        showMessage(
            "Please enter your username."
        );

        return;
    }


    if (!password) {

        showMessage(
            "Please enter your password."
        );

        return;
    }


    loginButton.disabled = true;

    showMessage(
        "Checking account..."
    );


    try {

        /*
         * Credentials are sent in the HTTP POST BODY.
         *
         * They are NOT placed in the URL.
         */

        const response =
            await fetch(
                CXSDB_SERVER + "/login",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        username: username,
                        password: password
                    })
                }
            );


        if (!response.ok) {

            throw new Error(
                "HTTP " + response.status
            );
        }


        const data =
            await response.json();


        /*
         * USERNAME DOES NOT EXIST
         */

        if (
            data.code ===
            "ACCOUNT_NOT_FOUND"
        ) {

            showMessage(
                "Username not found."
            );

            loginButton.disabled = false;

            return;
        }


        /*
         * WRONG PASSWORD
         */

        if (!data.success) {
    showMessage(
        data.message || "Login failed."
    );

    loginButton.disabled = false;
    return;
}


        /*
         * OTHER LOGIN FAILURE
         */

        if (!data.success) {

            showMessage(
                data.message ||
                "Login failed."
            );

            loginButton.disabled = false;

            return;
        }


        /*
         * SUCCESS
         *
         * Store only the account identity.
         *
         * NEVER store the password.
         */

        if (data.user_id !== undefined) {

            sessionStorage.setItem(
                "cxsdb_user_id",
                String(data.user_id)
            );
        }


        if (data.username) {

            sessionStorage.setItem(
                "cxsdb_username",
                data.username
            );
        }


        /*
         * Clear the password immediately.
         */

        document
            .getElementById("password")
            .value = "";


        showMessage(
            "Login successful."
        );


        /*
         * Go to Home without putting
         * account information in the URL.
         */

        setTimeout(() => {

            window.location.href =
                "index.html";

        }, 500);

    }


    catch (error) {

        console.error(
            "CXSDB LOGIN ERROR:",
            error
        );


        showMessage(
            "Unable to connect to the server."
        );

        loginButton.disabled = false;
    }

});


/*
 * CREATE ACCOUNT
 */

createAccountButton.addEventListener(
    "click",
    (event) => {

        event.preventDefault();

        window.location.href =
            "Account.html";
    }
);