// Get all requests
async function getAllRequests() {

    const response = await fetch(
        `${API_BASE_URL}/requests`
    );

    if (!response.ok) {
        throw new Error("Failed to fetch requests");
    }

    return await response.json();
}


// Get single request
async function getRequestById(id) {

    const response = await fetch(
        `${API_BASE_URL}/requests/${id}`
    );

    if (!response.ok) {
        const error = await response.json();

        throw new Error(
            error.message || "Request not found"
        );
    }

    return await response.json();
}


// Get active requests
async function getActiveRequests() {

    const response = await fetch(
        `${API_BASE_URL}/requests/active`
    );

    if (!response.ok) {

        const error = await response.json();

        throw new Error(
            error.message || "Failed to fetch active requests"
        );
    }

    return await response.json();
}


// Search and filter requests
async function searchRequests(filters = {}) {

    const params = new URLSearchParams();

    if (filters.search) {
        params.append("search", filters.search);
    }

    if (filters.status) {
        params.append("status", filters.status);
    }

    if (filters.priority) {
        params.append("priority", filters.priority);
    }

    if (filters.category) {
        params.append("category", filters.category);
    }

    if (filters.assignedTo) {
        params.append("assignedTo", filters.assignedTo);
    }

    if (filters.active) {
        params.append("active", "true");
    }

    const response = await fetch(
        `${API_BASE_URL}/requests/search?${params.toString()}`
    );

    if (!response.ok) {

        const error = await response.json();

        throw new Error(
            error.message || "Failed to search requests"
        );
    }

    return await response.json();
}


// Update request status
async function updateRequestStatus(id, status) {

    const response = await fetch(
        `${API_BASE_URL}/requests/${id}/status`,
        {
            method: "PATCH",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                status: status
            })
        }
    );

    const data = await response.json();

    if (!response.ok) {

        throw new Error(
            data.message || "Failed to update status"
        );
    }

    return data;
}


// Update request priority
async function updateRequestPriority(id, priority) {

    const response = await fetch(
        `${API_BASE_URL}/requests/${id}/priority`,
        {
            method: "PATCH",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                priority: priority
            })
        }
    );

    const data = await response.json();

    if (!response.ok) {

        throw new Error(
            data.message || "Failed to update priority"
        );
    }

    return data;
}


// Assign request
async function assignRequest(id, assignedTo) {

    const response = await fetch(
        `${API_BASE_URL}/requests/${id}/assign`,
        {
            method: "PATCH",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                assignedTo: assignedTo
            })
        }
    );

    const data = await response.json();

    if (!response.ok) {

        throw new Error(
            data.message || "Failed to assign request"
        );
    }

    return data;
}