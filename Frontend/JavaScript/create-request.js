
/* ========================================
   Get Elements
======================================== */

const requestForm =
    document.getElementById("requestForm");

const message =
    document.getElementById("message");

const submitButton =
    document.getElementById("submitButton");


/* ========================================
   Form Submit
======================================== */

if (requestForm) {

    requestForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            clearMessage();


            /* ========================================
               Get Form Values
            ======================================== */

            const title =
                document
                    .getElementById("title")
                    .value
                    .trim();

            const description =
                document
                    .getElementById("description")
                    .value
                    .trim();

            const requesterName =
                document
                    .getElementById("requesterName")
                    .value
                    .trim();

            const requesterEmail =
                document
                    .getElementById("requesterEmail")
                    .value
                    .trim();

            const category =
                document
                    .getElementById("category")
                    .value;

            const priority =
                document
                    .getElementById("priority")
                    .value;


            /* ========================================
               Validation
            ======================================== */

            if (title === "") {

                showError("Title is required.");

                return;
            }


            if (description === "") {

                showError(
                    "Description is required."
                );

                return;
            }


            if (requesterName === "") {

                showError(
                    "Requester name is required."
                );

                return;
            }


            if (requesterEmail === "") {

                showError(
                    "Requester email is required."
                );

                return;
            }


            if (!isValidEmail(requesterEmail)) {

                showError(
                    "Please enter a valid email address."
                );

                return;
            }


            if (category === "") {

                showError(
                    "Category is required."
                );

                return;
            }


            if (priority === "") {

                showError(
                    "Priority is required."
                );

                return;
            }


            /* ========================================
               Request Data
            ======================================== */

            const requestData = {

                title: title,

                description: description,

                requesterName: requesterName,

                requesterEmail: requesterEmail,

                category: category,

                priority: priority

            };


            /* ========================================
               Send Request
            ======================================== */

            try {

                submitButton.disabled = true;

                submitButton.textContent =
                    "Submitting...";


                const response =
                    await fetch(
                        `${API_BASE_URL}/requests`,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(
                                    requestData
                                )
                        }
                    );


                /* ========================================
                   Read Response
                ======================================== */

                let data = null;


                try {

                    data =
                        await response.json();

                } catch (error) {

                    data = null;

                }


                /* ========================================
                   Backend Error
                ======================================== */

                if (!response.ok) {

                    const errorMessage =
                        data &&
                        data.message
                            ? data.message
                            : "Failed to create request.";

                    showError(errorMessage);

                    return;
                }


                /* ========================================
                   Request ID
                ======================================== */

                if (!data || !data.id) {

                    showError(
                        "Request was created, but request ID was not returned."
                    );

                    return;
                }


                const requestId =
                    data.id;


                /* ========================================
                   Create Tracking Link
                ======================================== */

                const trackingUrl =
                    `track.html?id=${encodeURIComponent(requestId)}`;


                /* ========================================
                   Success Message
                ======================================== */

                message.className = "success";


                message.innerHTML = `

                    <div>
                        Request created successfully.
                    </div>

                    <div>
                        Your Request ID:
                        <strong>${requestId}</strong>
                    </div>

                    <div class="tracking-link-wrapper">

                        <a
                            href="${trackingUrl}"
                            class="tracking-link"
                        >
                            View and Track Your Request
                        </a>

                    </div>

                    <small>
                        Save this link to check your request status later.
                    </small>

                `;


                /* ========================================
                   Reset Form
                ======================================== */

                requestForm.reset();


            } catch (error) {

                console.error(
                    "Create request error:",
                    error
                );


                showError(
                    "Unable to connect to the server. Please try again."
                );


            } finally {

                submitButton.disabled = false;

                submitButton.textContent =
                    "Submit Request";

            }

        }
    );

}


/* ========================================
   Email Validation
======================================== */

function isValidEmail(email) {

    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailPattern.test(email);

}


/* ========================================
   Show Success
======================================== */

function showSuccess(text) {

    if (!message) {
        return;
    }

    message.textContent = text;

    message.className = "success";

}


/* ========================================
   Show Error
======================================== */

function showError(text) {

    if (!message) {
        return;
    }

    message.textContent = text;

    message.className = "error";

}


/* ========================================
   Clear Message
======================================== */

function clearMessage() {

    if (!message) {
        return;
    }

    message.textContent = "";

    message.className = "";

}

