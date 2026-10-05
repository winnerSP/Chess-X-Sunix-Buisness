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


        /*
         * Read the JSON even if the HTTP
         * status is not successful.
         */

        let data;

        try {

            data =
                await response.json();

        } catch {

            throw new Error(
                "Invalid server response."
            );
        }


        /*
         * SERVER REPLIED WITH A LOGIN FAILURE
         *
         * This is NOT a connection error.
         */

        if (data.success === false) {

            showMessage(
                data.message ||
                "Invalid username or password."
            );

            loginButton.disabled = false;

            return;
        }


        /*
         * HTTP ERROR WITHOUT A NORMAL
         * LOGIN RESPONSE
         */

        if (!response.ok) {

            throw new Error(
                "HTTP " + response.status
            );
        }


        /*
         * SUCCESS
         *
         * Store only account identity.
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
         * Go to Home.
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