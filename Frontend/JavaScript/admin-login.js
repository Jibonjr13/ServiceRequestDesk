// Get login form
const adminLoginForm =
    document.getElementById("adminLoginForm");


// Get message area
const loginMessage =
    document.getElementById("loginMessage");


// Get login button
const loginButton =
    document.getElementById("loginButton");


// Handle login
adminLoginForm.addEventListener(
    "submit",
    async function (event) {

        // Stop normal form submission
        event.preventDefault();


        // Get username
        const username =
            document
                .getElementById("username")
                .value
                .trim();


        // Get password
        const password =
            document
                .getElementById("password")
                .value;


        // Frontend validation
        if (username === "") {

            showLoginMessage(
                "Username is required"
            );

            return;
        }


        if (password === "") {

            showLoginMessage(
                "Password is required"
            );

            return;
        }


        try {

            // Disable button
            loginButton.disabled = true;

            loginButton.textContent = "Logging in...";


            // Send login request
            const response = await fetch(
                `${API_BASE_URL}/admin/login`,
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


            // Get response
            const data =
                await response.text();


            // Login failed
            if (!response.ok) {

                showLoginMessage(data);

                return;
            }


            // Login successful
            showLoginMessage(
                "Login successful"
            );


            // Go to dashboard
            window.location.href =
                "dashboard.html";


        } catch (error) {

            showLoginMessage(
                "Unable to connect to the server"
            );


        } finally {

            loginButton.disabled = false;

            loginButton.textContent = "Login";

        }

    }
);


// Show login message
function showLoginMessage(text) {

    loginMessage.textContent = text;

}

