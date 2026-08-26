
/* ========================================
   Get Elements
======================================== */

const trackLoading =
    document.getElementById("trackLoading");

const trackError =
    document.getElementById("trackError");

const trackDetails =
    document.getElementById("trackDetails");

const trackActions =
    document.getElementById("trackActions");


/* ========================================
   Get Request ID From URL
======================================== */

const urlParams =
    new URLSearchParams(
        window.location.search
    );


const requestId =
    urlParams.get("id");


/* ========================================
   Load Request
======================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        if (!requestId) {

            showError(
                "No request ID was provided."
            );

            return;
        }


        loadRequest(requestId);

    }
);


/* ========================================
   Load Request From Backend
======================================== */

async function loadRequest(id) {

    showLoading();


    try {

        const response =
            await fetch(
                `${API_BASE_URL}/requests/${encodeURIComponent(id)}`
            );


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
                    : "Request not found.";

            throw new Error(
                errorMessage
            );

        }


        if (!data) {

            throw new Error(
                "Request data was not returned."
            );

        }


        /* ========================================
           Render Request
        ======================================== */

        renderRequest(data);


    } catch (error) {

        console.error(
            "Load request error:",
            error
        );


        showError(
            error.message ||
            "Failed to load request."
        );

    }

}


/* ========================================
   Render Request
======================================== */

function renderRequest(request) {

    setText(
        "detailId",
        request.id
    );


    setText(
        "detailTitle",
        request.title
    );


    setText(
        "detailDescription",
        request.description
    );


    setText(
        "detailRequesterName",
        request.requesterName
    );


    setText(
        "detailCategory",
        formatCategory(
            request.category
        )
    );


    setText(
        "detailPriority",
        formatPriority(
            request.priority
        )
    );


    setText(
        "detailCreatedAt",
        formatDate(
            request.createdAt
        )
    );


    setText(
        "detailUpdatedAt",
        formatDate(
            request.updatedAt
        )
    );


    /* ========================================
       Status
    ======================================== */

    const statusElement =
        document.getElementById(
            "detailStatus"
        );


    if (statusElement) {

        statusElement.textContent =
            formatStatus(
                request.status
            );


        statusElement.className =
            "track-status " +
            getStatusClass(
                request.status
            );

    }


    /* ========================================
       Show Details
    ======================================== */

    hideLoading();


    if (trackError) {

        trackError.style.display =
            "none";

    }


    if (trackDetails) {

        trackDetails.style.display =
            "grid";

    }


    if (trackActions) {

        trackActions.style.display =
            "block";

    }

}


/* ========================================
   Loading
======================================== */

function showLoading() {

    if (trackLoading) {

        trackLoading.style.display =
            "block";

    }


    if (trackDetails) {

        trackDetails.style.display =
            "none";

    }


    if (trackActions) {

        trackActions.style.display =
            "none";

    }

}


function hideLoading() {

    if (trackLoading) {

        trackLoading.style.display =
            "none";

    }

}


/* ========================================
   Error
======================================== */

function showError(message) {

    hideLoading();


    if (trackDetails) {

        trackDetails.style.display =
            "none";

    }


    if (trackActions) {

        trackActions.style.display =
            "none";

    }


    if (trackError) {

        trackError.textContent =
            message;

        trackError.style.display =
            "block";

    }

}


/* ========================================
   Set Text Safely
======================================== */

function setText(id, value) {

    const element =
        document.getElementById(id);


    if (!element) {
        return;
    }


    element.textContent =
        value ?? "-";

}


/* ========================================
   Format Status
======================================== */

function formatStatus(status) {

    if (!status) {

        return "-";

    }


    return status
        .toLowerCase()
        .split("_")
        .map(
            word =>
                word.charAt(0).toUpperCase() +
                word.slice(1)
        )
        .join(" ");

}


/* ========================================
   Status CSS Class
======================================== */

function getStatusClass(status) {

    if (!status) {

        return "";

    }


    return (
        "status-" +
        status
            .toLowerCase()
            .replaceAll("_", "-")
    );

}


/* ========================================
   Format Category
======================================== */

function formatCategory(category) {

    if (!category) {

        return "-";

    }


    return (
        category.charAt(0).toUpperCase() +
        category.slice(1).toLowerCase()
    );

}


/* ========================================
   Format Priority
======================================== */

function formatPriority(priority) {

    if (!priority) {

        return "-";

    }


    return (
        priority.charAt(0).toUpperCase() +
        priority.slice(1).toLowerCase()
    );

}


/* ========================================
   Format Date
======================================== */

function formatDate(date) {

    if (!date) {

        return "-";

    }


    const parsedDate =
        new Date(date);


    if (
        isNaN(
            parsedDate.getTime()
        )
    ) {

        return date;

    }


    return parsedDate.toLocaleString();

}

