```javascript
const CXSDB_SERVER =
    "https://vigilant-fiesta-5vgq74r9pq7jf7jq6-8080.app.github.dev";

const loginForm =
    document.getElementById("loginForm");

const usernameInput =
    document.getElementById("username");

const passwordInput =
    document.getElementById("password");

const termsCheckbox =
    document.getElementById("termsCheckbox");

const loginButton =
    document.getElementById("loginButton");

const signupButton =
    document.getElementById("signupButton");

const loginMessage =
    document.getElementById("loginMessage");


// ========================================
// BUTTON STATE
// ========================================

function updateButtons() {

    const accepted =
        termsCheckbox.checked;

    loginButton.disabled =
        !accepted;

    signupButton.disabled =
        !accepted;
}


termsCheckbox.addEventListener(
    "change",
    updateButtons
);

updateButtons();


// ========================================
// LOGIN
// ========================================

loginForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        if (!termsCheckbox.checked) {

            loginMessage.textContent =
                "You must agree to the Terms and Conditions.";

            return;
        }


        const username =
            usernameInput.value.trim();

        const password =
            passwordInput.value;


        if (!username || !password) {

            loginMessage.textContent =
                "Enter your username and password.";

            return;
        }


        loginButton.disabled = true;
        signupButton.disabled = true;

        loginMessage.textContent =
            "Logging in...";


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


            const result =
                await response.json();


            if (
                response.ok &&
                result.success
            ) {

                loginMessage.textContent =
                    "Login successful!";


                // Clear the password immediately.
                passwordInput.value = "";


                // Continue to the main website.
                window.location.href =
                    "index.html";

            }
            else {

                loginMessage.textContent =
                    result.message ||
                    "Login failed.";

                passwordInput.value = "";

                updateButtons();
            }

        }
        catch (error) {

            console.error(
                "CXSDB login error:",
                error
            );

            loginMessage.textContent =
                "Unable to connect to the CXSDB server.";

            passwordInput.value = "";

            updateButtons();
        }

    }
);


// ========================================
// CREATE ACCOUNT
// ========================================

signupButton.addEventListener(
    "click",
    async function () {

        if (!termsCheckbox.checked) {

            loginMessage.textContent =
                "You must agree to the Terms and Conditions.";

            return;
        }


        const username =
            usernameInput.value.trim();

        const password =
            passwordInput.value;


        if (!username || !password) {

            loginMessage.textContent =
                "Enter a username and password.";

            return;
        }


        signupButton.disabled = true;
        loginButton.disabled = true;

        loginMessage.textContent =
            "Creating account...";


        try {

            const response =
                await fetch(
                    CXSDB_SERVER + "/signup",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({
                            username: username,
                            password: password,
                            termsAccepted: true
                        })
                    }
                );


            const result =
                await response.json();


            if (
                response.ok &&
                result.success
            ) {

                loginMessage.textContent =
                    "Account created successfully!";

                passwordInput.value = "";

                updateButtons();

            }
            else {

                loginMessage.textContent =
                    result.message ||
                    "Account creation failed.";

                passwordInput.value = "";

                updateButtons();
            }

        }
        catch (error) {

            console.error(
                "CXSDB signup error:",
                error
            );

            loginMessage.textContent =
                "Unable to connect to the CXSDB server.";

            passwordInput.value = "";

            updateButtons();
        }

    }
);
```
