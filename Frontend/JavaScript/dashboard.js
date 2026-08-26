
/* ========================================
   DOM Elements
======================================== */

const dashboardTableBody =
    document.getElementById("requestTableBody");

const loadingState =
    document.getElementById("loadingState");

const emptyState =
    document.getElementById("emptyState");

const tableSection =
    document.getElementById("requestTableSection");

const dashboardMessage =
    document.getElementById("dashboardMessage");

const requestCount =
    document.getElementById("requestCount");


/* ========================================
   Filters
======================================== */

const searchInput =
    document.getElementById("searchInput");

const statusFilter =
    document.getElementById("statusFilter");

const priorityFilter =
    document.getElementById("priorityFilter");

const categoryFilter =
    document.getElementById("categoryFilter");

const assignedToFilter =
    document.getElementById("assignedToFilter");

const activeFilter =
    document.getElementById("activeFilter");

const clearFiltersButton =
    document.getElementById("clearFiltersButton");

const refreshButton =
    document.getElementById("refreshButton");


/* ========================================
   Modal Elements
======================================== */

const requestModal =
    document.getElementById("requestModal");

const modalContent =
    document.querySelector("#requestModal .modal-content");

const closeModalButton =
    document.getElementById("closeModalButton");

const modalMessage =
    document.getElementById("modalMessage");


/* ========================================
   Action Buttons
======================================== */

const updateStatusButton =
    document.getElementById("updateStatusButton");

const updatePriorityButton =
    document.getElementById("updatePriorityButton");

const assignButton =
    document.getElementById("assignButton");

const addNoteButton =
    document.getElementById("addNoteButton");


/* ========================================
   State
======================================== */

let allRequests = [];

let currentRequest = null;


/* ========================================
   DOM Ready
======================================== */

document.addEventListener("DOMContentLoaded", function () {

    loadDashboard();

    loadSupportPeople();

});


/* ========================================
   Load Dashboard
======================================== */

async function loadDashboard() {

    showLoading();

    clearDashboardMessage();

    try {

        allRequests =
            await getAllRequests();

        if (!Array.isArray(allRequests)) {

            allRequests = [];

        }

        updateStatistics(allRequests);

        renderRequests(allRequests);

    } catch (error) {

        console.error(
            "Dashboard load error:",
            error
        );

        showDashboardError(
            error.message ||
            "Failed to load requests"
        );

    }

}


/* ========================================
   Statistics
======================================== */

function updateStatistics(requests) {

    const total =
        requests.length;


    const open =
        requests.filter(
            request =>
                request.status === "OPEN"
        ).length;


    const inProgress =
        requests.filter(
            request =>
                request.status === "IN_PROGRESS"
        ).length;


    const waiting =
        requests.filter(
            request =>
                request.status === "WAITING_FOR_USER"
        ).length;


    const resolved =
        requests.filter(
            request =>
                request.status === "RESOLVED"
        ).length;


    const closed =
        requests.filter(
            request =>
                request.status === "CLOSED"
        ).length;


    setElementText(
        "totalRequests",
        total
    );


    setElementText(
        "openRequests",
        open
    );


    setElementText(
        "inProgressRequests",
        inProgress
    );


    setElementText(
        "waitingRequests",
        waiting
    );


    setElementText(
        "resolvedRequests",
        resolved
    );


    setElementText(
        "closedRequests",
        closed
    );

}


/* ========================================
   Render Requests
======================================== */

function renderRequests(requests) {

    hideLoading();

    if (!dashboardTableBody) {

        return;

    }

    dashboardTableBody.innerHTML = "";

    if (requestCount) {

        requestCount.textContent =
            `${requests.length} request(s)`;

    }


    if (requests.length === 0) {

        if (tableSection) {

            tableSection.classList.add("hidden");

        }

        if (emptyState) {

            emptyState.classList.remove("hidden");

        }

        return;

    }


    if (emptyState) {

        emptyState.classList.add("hidden");

    }


    if (tableSection) {

        tableSection.classList.remove("hidden");

    }


    requests.forEach(function (request) {

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>
                <strong>
                    ${escapeHtml(request.id)}
                </strong>
            </td>

            <td>
                <strong>
                    ${escapeHtml(request.title)}
                </strong>
            </td>

            <td>
                ${escapeHtml(
                    request.requesterName || "-"
                )}
            </td>

            <td>
                <span class="category-badge">
                    ${escapeHtml(
                        formatCategory(request.category)
                    )}
                </span>
            </td>

            <td>
                <span
                    class="priority-badge ${getPriorityClass(
                        request.priority
                    )}">
                    ${escapeHtml(
                        formatPriority(request.priority)
                    )}
                </span>
            </td>

            <td>
                <span
                    class="status-badge ${getStatusClass(
                        request.status
                    )}">
                    ${escapeHtml(
                        formatStatus(request.status)
                    )}
                </span>
            </td>

            <td>
                ${escapeHtml(
                    request.assignedTo || "Unassigned"
                )}
            </td>

            <td>
                ${escapeHtml(
                    formatDate(request.updatedAt)
                )}
            </td>

            <td>

                <button
                    class="btn btn-small view-request-button"
                    type="button"
                    data-request-id="${escapeHtml(request.id)}">

                    View

                </button>

            </td>

        `;


        dashboardTableBody.appendChild(row);

    });


    /*
       Event delegation for View buttons.
       This is safer than inline onclick.
    */

    dashboardTableBody
        .querySelectorAll(".view-request-button")
        .forEach(function (button) {

            button.addEventListener(
                "click",
                function () {

                    const id =
                        button.dataset.requestId;

                    openRequestDetails(id);

                }
            );

        });

}


/* ========================================
   Search & Filters
======================================== */

async function applyFilters() {

    showLoading();

    clearDashboardMessage();


    const search =
        searchInput ?
        searchInput.value.trim() :
        "";


    const status =
        statusFilter ?
        statusFilter.value :
        "";


    const priority =
        priorityFilter ?
        priorityFilter.value :
        "";


    const category =
        categoryFilter ?
        categoryFilter.value :
        "";


    const assignedTo =
        assignedToFilter ?
        assignedToFilter.value :
        "";


    const active =
        activeFilter ?
        activeFilter.checked :
        false;


    const params =
        new URLSearchParams();


    if (search !== "") {

        params.append(
            "search",
            search
        );

    }


    if (status !== "") {

        params.append(
            "status",
            status
        );

    }


    if (priority !== "") {

        params.append(
            "priority",
            priority
        );

    }


    if (category !== "") {

        params.append(
            "category",
            category
        );

    }


    if (assignedTo !== "") {

        params.append(
            "assignedTo",
            assignedTo
        );

    }


    if (active) {

        params.append(
            "active",
            "true"
        );

    }


    try {

        const response =
            await fetch(
                `${API_BASE_URL}/requests/search?${params.toString()}`
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Failed to search requests"
            );

        }


        allRequests =
            Array.isArray(data) ?
            data :
            [];


        updateStatistics(
            allRequests
        );


        renderRequests(
            allRequests
        );


    } catch (error) {

        console.error(
            "Filter error:",
            error
        );

        showDashboardError(
            error.message ||
            "Failed to search requests"
        );

    }

}


/* ========================================
   Clear Filters
======================================== */

function clearFilters() {

    if (searchInput) {

        searchInput.value = "";

    }

    if (statusFilter) {

        statusFilter.value = "";

    }

    if (priorityFilter) {

        priorityFilter.value = "";

    }

    if (categoryFilter) {

        categoryFilter.value = "";

    }

    if (assignedToFilter) {

        assignedToFilter.value = "";

    }

    if (activeFilter) {

        activeFilter.checked = false;

    }


    loadDashboard();

}


/* ========================================
   Refresh Dashboard
======================================== */

if (refreshButton) {

    refreshButton.addEventListener(
        "click",
        refreshDashboard
    );

}


/* ========================================
   Clear Filter Button
======================================== */

if (clearFiltersButton) {

    clearFiltersButton.addEventListener(
        "click",
        clearFilters
    );

}


/* ========================================
   Search
======================================== */

if (searchInput) {

    searchInput.addEventListener(
        "input",
        debounce(
            applyFilters,
            400
        )
    );

}


/* ========================================
   Filter Events
======================================== */

if (statusFilter) {

    statusFilter.addEventListener(
        "change",
        applyFilters
    );

}


if (priorityFilter) {

    priorityFilter.addEventListener(
        "change",
        applyFilters
    );

}


if (categoryFilter) {

    categoryFilter.addEventListener(
        "change",
        applyFilters
    );

}


if (assignedToFilter) {

    assignedToFilter.addEventListener(
        "change",
        applyFilters
    );

}


if (activeFilter) {

    activeFilter.addEventListener(
        "change",
        applyFilters
    );

}


/* ========================================
   Open Request Details
======================================== */

async function openRequestDetails(id) {

    clearModalMessage();


    const noteInput =
        document.getElementById("noteInput");


    if (noteInput) {

        noteInput.value = "";

    }


    const notesContainer =
        document.getElementById(
            "notesContainer"
        );


    if (notesContainer) {

        notesContainer.innerHTML = `
            <p class="notes-empty">
                Loading notes...
            </p>
        `;

    }


    try {

        currentRequest =
            await getRequestById(id);


        if (!currentRequest) {

            throw new Error(
                "Request not found"
            );

        }


        showRequestModal(
            currentRequest
        );


        await loadNotes(
            currentRequest.id
        );


    } catch (error) {

        console.error(
            "Open request error:",
            error
        );

        showModalError(
            `✕ ${
                error.message ||
                "Failed to load request"
            }`
        );

    }

}


/* ========================================
   Show Request Modal
======================================== */

function showRequestModal(request) {

    if (!requestModal) {

        return;

    }


    clearModalMessage();


    setElementText(
        "detailId",
        request.id
    );


    setElementText(
        "detailTitle",
        request.title
    );


    setElementText(
        "detailDescription",
        request.description
    );


    setElementText(
        "detailRequesterName",
        request.requesterName
    );


    setElementText(
        "detailRequesterEmail",
        request.requesterEmail
    );


    setElementText(
        "detailCategory",
        formatCategory(request.category)
    );


    setElementText(
        "detailPriority",
        formatPriority(request.priority)
    );


    setElementText(
        "detailStatus",
        formatStatus(request.status)
    );


    setElementText(
        "detailAssignedTo",
        request.assignedTo ||
        "Unassigned"
    );


    setElementText(
        "detailCreatedAt",
        formatDate(request.createdAt)
    );


    setElementText(
        "detailUpdatedAt",
        formatDate(request.updatedAt)
    );


    const priorityInput =
        document.getElementById(
            "priorityAction"
        );


    const statusInput =
        document.getElementById(
            "statusAction"
        );


    const assignInput =
        document.getElementById(
            "assignedToAction"
        );


    if (priorityInput) {

        priorityInput.value =
            request.priority || "";

    }


    if (statusInput) {

        statusInput.value =
            request.status || "";

    }


    if (assignInput) {

        /*
           Important:
           Backend expects support person's NAME.
        */

        assignInput.value =
            request.assignedTo || "";

    }


    /*
       Closed request:
       Disable modification buttons.
    */

    const isClosed =
        request.status === "CLOSED";


    if (updateStatusButton) {

        updateStatusButton.disabled =
            isClosed;

    }


    if (updatePriorityButton) {

        updatePriorityButton.disabled =
            isClosed;

    }


    if (assignButton) {

        assignButton.disabled =
            isClosed;

    }


    if (addNoteButton) {

        addNoteButton.disabled =
            isClosed;

    }


    requestModal.classList.remove(
        "hidden"
    );

}


/* ========================================
   Close Request Modal
======================================== */

function closeRequestModal() {

    if (!requestModal) {

        return;

    }


    requestModal.classList.add(
        "hidden"
    );


    clearModalMessage();


    currentRequest = null;

}


/* ========================================
   Overlay Click
======================================== */

if (requestModal) {

    requestModal.addEventListener(
        "click",
        function (event) {

            if (
                event.target ===
                requestModal
            ) {

                closeRequestModal();

            }

        }
    );

}


/* ========================================
   Modal Content Click
======================================== */

if (modalContent) {

    modalContent.addEventListener(
        "click",
        function (event) {

            event.stopPropagation();

        }
    );

}


/* ========================================
   Close Button
======================================== */

if (closeModalButton) {

    closeModalButton.addEventListener(
        "click",
        closeRequestModal
    );

}


/* ========================================
   ESC Key
======================================== */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Escape" &&
            requestModal &&
            !requestModal.classList.contains(
                "hidden"
            )
        ) {

            closeRequestModal();

        }

    }
);


/* ========================================
   UPDATE STATUS
======================================== */

async function updateStatus() {

    if (!currentRequest) {

        showModalError(
            "✕ No request selected"
        );

        return;

    }


    const input =
        document.getElementById(
            "statusAction"
        );


    if (!input) {

        showModalError(
            "✕ Status input not found"
        );

        return;

    }


    const status =
        input.value;


    if (!status) {

        showModalError(
            "✕ Status is required"
        );

        return;

    }


    try {

        setActionButtonsDisabled(true);

        clearModalMessage();


        const response =
            await fetch(
                `${API_BASE_URL}/requests/${currentRequest.id}/status`,
                {
                    method: "PATCH",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        status: status
                    })

                }
            );


        const data =
            await readResponse(response);


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Failed to update status"
            );

        }


        currentRequest =
            data;


        showRequestModal(
            data
        );


        showModalSuccess(
            "✓ Status updated successfully"
        );


        await refreshDashboard();


    } catch (error) {

        console.error(
            "Update status error:",
            error
        );

        showModalError(
            `✕ ${
                error.message ||
                "Failed to update status"
            }`
        );

    } finally {

        if (currentRequest) {

            setActionButtonsDisabled(
                currentRequest.status === "CLOSED"
            );

        } else {

            setActionButtonsDisabled(false);

        }

    }

}


/* ========================================
   UPDATE PRIORITY
======================================== */

async function updatePriority() {

    if (!currentRequest) {

        showModalError(
            "✕ No request selected"
        );

        return;

    }


    const input =
        document.getElementById(
            "priorityAction"
        );


    if (!input) {

        showModalError(
            "✕ Priority input not found"
        );

        return;

    }


    const priority =
        input.value;


    if (!priority) {

        showModalError(
            "✕ Priority is required"
        );

        return;

    }


    try {

        setActionButtonsDisabled(true);

        clearModalMessage();


        const response =
            await fetch(
                `${API_BASE_URL}/requests/${currentRequest.id}/priority`,
                {
                    method: "PATCH",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        priority: priority
                    })

                }
            );


        const data =
            await readResponse(response);


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Failed to update priority"
            );

        }


        currentRequest =
            data;


        showRequestModal(
            data
        );


        showModalSuccess(
            "✓ Priority updated successfully"
        );


        await refreshDashboard();


    } catch (error) {

        console.error(
            "Update priority error:",
            error
        );

        showModalError(
            `✕ ${
                error.message ||
                "Failed to update priority"
            }`
        );

    } finally {

        if (currentRequest) {

            setActionButtonsDisabled(
                currentRequest.status === "CLOSED"
            );

        } else {

            setActionButtonsDisabled(false);

        }

    }

}


/* ========================================
   ASSIGN REQUEST
======================================== */

async function assignRequest() {

    console.log(
        "Assign button clicked"
    );


    if (!currentRequest) {

        showModalError(
            "✕ No request selected"
        );

        return;

    }


    const input =
        document.getElementById(
            "assignedToAction"
        );


    if (!input) {

        showModalError(
            "✕ Assignment input not found"
        );

        return;

    }


    const assignedTo =
        input.value.trim();


    console.log(
        "Assigning request:",
        currentRequest.id,
        "to:",
        assignedTo
    );


    if (!assignedTo) {

        showModalError(
            "✕ Please select a support person"
        );

        return;

    }


    try {

        setActionButtonsDisabled(true);

        clearModalMessage();


        /*
           IMPORTANT:

           Backend AssignRequestDto expects:

           {
               "assignedTo": "Yusra"
           }

           It does NOT expect an ID.
        */

        const response =
            await fetch(
                `${API_BASE_URL}/requests/${currentRequest.id}/assign`,
                {
                    method: "PATCH",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        assignedTo: assignedTo
                    })

                }
            );


        console.log(
            "Assign response status:",
            response.status
        );


        const data =
            await readResponse(response);


        console.log(
            "Assign response data:",
            data
        );


        if (!response.ok) {

            throw new Error(
                data.message ||
                data.error ||
                "Failed to assign request"
            );

        }


        /*
           Update current request
        */

        currentRequest =
            data;


        /*
           Update modal UI
        */

        showRequestModal(
            data
        );


        /*
           Show success message
        */

        showModalSuccess(
            "✓ Request assigned successfully"
        );


        /*
           Refresh dashboard table
        */

        await refreshDashboard();


        /*
           IMPORTANT:

           refreshDashboard() must not
           close the modal.
        */


    } catch (error) {

        console.error(
            "Assign request error:",
            error
        );


        showModalError(
            `✕ ${
                error.message ||
                "Failed to assign request"
            }`
        );


    } finally {

        if (currentRequest) {

            setActionButtonsDisabled(
                currentRequest.status === "CLOSED"
            );

        } else {

            setActionButtonsDisabled(false);

        }

    }

}


/* ========================================
   ADD NOTE
======================================== */

async function addNote() {

    if (!currentRequest) {

        showModalError(
            "✕ No request selected"
        );

        return;

    }


    const input =
        document.getElementById(
            "noteInput"
        );


    if (!input) {

        showModalError(
            "✕ Note input not found"
        );

        return;

    }


    const content =
        input.value.trim();


    if (!content) {

        showModalError(
            "✕ Note cannot be empty"
        );

        return;

    }


    if (content.length > 5000) {

        showModalError(
            "✕ Note must not exceed 5000 characters"
        );

        return;

    }


    try {

        setActionButtonsDisabled(true);

        clearModalMessage();


        const response =
            await fetch(
                `${API_BASE_URL}/requests/${currentRequest.id}/notes`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        content: content
                    })

                }
            );


        const data =
            await readResponse(response);


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Failed to add note"
            );

        }


        input.value = "";


        showModalSuccess(
            "✓ Note added successfully"
        );


        await loadNotes(
            currentRequest.id
        );


    } catch (error) {

        console.error(
            "Add note error:",
            error
        );

        showModalError(
            `✕ ${
                error.message ||
                "Failed to add note"
            }`
        );

    } finally {

        if (currentRequest) {

            setActionButtonsDisabled(
                currentRequest.status === "CLOSED"
            );

        } else {

            setActionButtonsDisabled(false);

        }

    }

}


/* ========================================
   LOAD NOTES
======================================== */

async function loadNotes(requestId) {

    const notesContainer =
        document.getElementById(
            "notesContainer"
        );


    if (!notesContainer) {

        return;

    }


    try {

        const response =
            await fetch(
                `${API_BASE_URL}/requests/${requestId}/notes`
            );


        const data =
            await readResponse(response);


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Failed to load notes"
            );

        }


        notesContainer.innerHTML = "";


        if (
            !Array.isArray(data) ||
            data.length === 0
        ) {

            notesContainer.innerHTML = `
                <p class="notes-empty">
                    No notes yet.
                </p>
            `;

            return;

        }


        data.forEach(
            function (note) {

                const noteElement =
                    document.createElement(
                        "div"
                    );


                noteElement.className =
                    "note-item";


                noteElement.innerHTML = `

                    <p class="note-content">
                        ${escapeHtml(
                            note.content
                        )}
                    </p>

                    <span class="note-date">
                        ${escapeHtml(
                            formatDate(
                                note.createdAt
                            )
                        )}
                    </span>

                `;


                notesContainer.appendChild(
                    noteElement
                );

            }
        );


    } catch (error) {

        console.error(
            "Load notes error:",
            error
        );


        notesContainer.innerHTML = `

            <p class="notes-empty error">
                Failed to load notes.
            </p>

        `;

    }

}


/* ========================================
   REFRESH DASHBOARD
======================================== */

async function refreshDashboard() {

    const currentSearch =
        searchInput ?
        searchInput.value.trim() :
        "";


    const currentStatus =
        statusFilter ?
        statusFilter.value :
        "";


    const currentPriority =
        priorityFilter ?
        priorityFilter.value :
        "";


    const currentCategory =
        categoryFilter ?
        categoryFilter.value :
        "";


    const currentAssigned =
        assignedToFilter ?
        assignedToFilter.value :
        "";


    const currentActive =
        activeFilter ?
        activeFilter.checked :
        false;


    if (
        currentSearch ||
        currentStatus ||
        currentPriority ||
        currentCategory ||
        currentAssigned ||
        currentActive
    ) {

        await applyFilters();

    } else {

        await loadDashboard();

    }

}


/* ========================================
   UI - Loading
======================================== */

function showLoading() {

    if (loadingState) {

        loadingState.classList.remove(
            "hidden"
        );

    }


    if (tableSection) {

        tableSection.classList.add(
            "hidden"
        );

    }


    if (emptyState) {

        emptyState.classList.add(
            "hidden"
        );

    }

}


/* ========================================
   UI - Hide Loading
======================================== */

function hideLoading() {

    if (loadingState) {

        loadingState.classList.add(
            "hidden"
        );

    }

}


/* ========================================
   Dashboard Success
======================================== */

function showDashboardSuccess(text) {

    if (!dashboardMessage) {

        return;

    }


    dashboardMessage.textContent =
        `✓ ${text}`;


    dashboardMessage.className =
        "dashboard-message success";

}


/* ========================================
   Dashboard Error
======================================== */

function showDashboardError(text) {

    hideLoading();


    if (tableSection) {

        tableSection.classList.add(
            "hidden"
        );

    }


    if (emptyState) {

        emptyState.classList.remove(
            "hidden"
        );

    }


    if (dashboardMessage) {

        dashboardMessage.textContent =
            `✕ ${text}`;


        dashboardMessage.className =
            "dashboard-message error";

    }

}


/* ========================================
   Clear Dashboard Message
======================================== */

function clearDashboardMessage() {

    if (!dashboardMessage) {

        return;

    }


    dashboardMessage.textContent =
        "";


    dashboardMessage.className =
        "dashboard-message";

}


/* ========================================
   Modal Success
======================================== */

function showModalSuccess(text) {

    if (!modalMessage) {

        return;

    }


    modalMessage.textContent =
        text;


    modalMessage.className =
        "modal-message success";

}


/* ========================================
   Modal Error
======================================== */

function showModalError(text) {

    if (!modalMessage) {

        return;

    }


    modalMessage.textContent =
        text;


    modalMessage.className =
        "modal-message error";

}


/* ========================================
   Clear Modal Message
======================================== */

function clearModalMessage() {

    if (!modalMessage) {

        return;

    }


    modalMessage.textContent =
        "";


    modalMessage.className =
        "modal-message";

}


/* ========================================
   Disable Action Buttons
======================================== */

function setActionButtonsDisabled(
    disabled
) {

    const buttons =
        document.querySelectorAll(
            ".request-actions button"
        );


    buttons.forEach(
        function (button) {

            button.disabled =
                disabled;

        }
    );

}


/* ========================================
   IMPORTANT BUTTON EVENT LISTENERS
======================================== */

/*
   This was missing in your old JS.

   Without these listeners:
   - Assign doesn't call assignRequest()
   - Update Status doesn't call updateStatus()
   - Update Priority doesn't call updatePriority()
   - Add Note doesn't call addNote()
*/


if (updateStatusButton) {

    updateStatusButton.addEventListener(
        "click",
        updateStatus
    );

}


if (updatePriorityButton) {

    updatePriorityButton.addEventListener(
        "click",
        updatePriority
    );

}


if (assignButton) {

    assignButton.addEventListener(
        "click",
        assignRequest
    );

}


if (addNoteButton) {

    addNoteButton.addEventListener(
        "click",
        addNote
    );

}


/* ========================================
   Set Element Text
======================================== */

function setElementText(
    id,
    value
) {

    const element =
        document.getElementById(id);


    if (element) {

        element.textContent =
            value ?? "-";

    }

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
   Format Priority
======================================== */

function formatPriority(priority) {

    if (!priority) {

        return "-";

    }


    return priority
        .charAt(0).toUpperCase() +
        priority.slice(1).toLowerCase();

}


/* ========================================
   Format Category
======================================== */

function formatCategory(category) {

    if (!category) {

        return "-";

    }


    return category
        .charAt(0).toUpperCase() +
        category.slice(1).toLowerCase();

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

        return String(date);

    }


    return parsedDate.toLocaleString();

}


/* ========================================
   Status Badge Class
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
   Priority Badge Class
======================================== */

function getPriorityClass(priority) {

    if (!priority) {

        return "";

    }


    return (
        "priority-" +
        priority.toLowerCase()
    );

}


/* ========================================
   HTML Safety
======================================== */

function escapeHtml(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }


    return String(value)

        .replaceAll(
            "&",
            "&amp;"
        )

        .replaceAll(
            "<",
            "&lt;"
        )

        .replaceAll(
            ">",
            "&gt;"
        )

        .replaceAll(
            '"',
            "&quot;"
        )

        .replaceAll(
            "'",
            "&#039;"
        );

}


/* ========================================
   Read API Response Safely
======================================== */

async function readResponse(response) {

    const text =
        await response.text();


    if (!text) {

        return {};

    }


    try {

        return JSON.parse(text);

    } catch (error) {

        return {

            message:
                text ||
                `HTTP ${response.status}`

        };

    }

}


/* ========================================
   Debounce
======================================== */

function debounce(
    callback,
    delay
) {

    let timer;


    return function () {

        clearTimeout(timer);


        timer =
            setTimeout(
                () => callback(),
                delay
            );

    };

}


/* ========================================
   Load Support People
======================================== */

async function loadSupportPeople() {

    const filterSelect =
        document.getElementById(
            "assignedToFilter"
        );


    const actionSelect =
        document.getElementById(
            "assignedToAction"
        );


    if (
        !filterSelect ||
        !actionSelect
    ) {

        return;

    }


    try {

        const response =
            await fetch(
                `${API_BASE_URL}/support-people`
            );


        const data =
            await readResponse(response);


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Failed to load support people"
            );

        }


        /*
           Backend should return an array.
        */

        const supportPeople =
            Array.isArray(data) ?
            data :
            [];


        /*
           Clear dropdowns.
        */

        filterSelect.innerHTML = `

            <option value="">
                All Support People
            </option>

        `;


        actionSelect.innerHTML = `

            <option value="">
                Select support person
            </option>

        `;


        /*
           Add support people.
        */

        supportPeople.forEach(
            function (person) {

                /*
                   Support person name.
                */

                const name =
                    typeof person === "string"
                    ? person
                    : person.name;


                if (!name) {

                    return;

                }


                /*
                   Filter dropdown.
                */

                const filterOption =
                    document.createElement(
                        "option"
                    );


                filterOption.value =
                    name;


                filterOption.textContent =
                    name;


                filterSelect.appendChild(
                    filterOption
                );


                /*
                   Assignment dropdown.
                */

                const actionOption =
                    document.createElement(
                        "option"
                    );


                /*
                   IMPORTANT:

                   Value is NAME because
                   backend expects name.
                */

                actionOption.value =
                    name;


                actionOption.textContent =
                    name;


                actionSelect.appendChild(
                    actionOption
                );

            }
        );


        /*
           If a request is already open,
           restore its assigned person.
        */

        if (
            currentRequest &&
            currentRequest.assignedTo
        ) {

            actionSelect.value =
                currentRequest.assignedTo;

        }


    } catch (error) {

        console.error(
            "Error loading support people:",
            error
        );


        /*
           Show error inside assignment dropdown.
        */

        actionSelect.innerHTML = `

            <option value="">
                Failed to load support people
            </option>

        `;

    }

}

