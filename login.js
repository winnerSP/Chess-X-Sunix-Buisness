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


    if (!username || !password) {

        showMessage(
            "Please enter your username and password."
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
            data.code === "ACCOUNT_NOT_FOUND"
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

        if (
            data.code === "INVALID_PASSWORD"
        ) {

            showMessage(
                "Incorrect password."
            );

            loginButton.disabled = false;

            return;
        }


        /*
         * GENERAL LOGIN FAILURE
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
         * LOGIN SUCCESS
         */

        if (!data.user_id) {

            showMessage(
                "Login failed: account information was not returned."
            );

            loginButton.disabled = false;

            return;
        }


        /*
         * Store only account identity.
         * Never store the password.
         */

        sessionStorage.setItem(
            "cxsdb_user_id",
            String(data.user_id)
        );

        sessionStorage.setItem(
            "cxsdb_username",
            data.username || username
        );


        document
            .getElementById("password")
            .value = "";


        showMessage(
            "Login successful."
        );


        setTimeout(() => {

            window.location.href =
                "home.html";

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
    () => {

        window.location.href =
            "Account.html";
    }
);