package com.servicedesk.service_desk.dto;

import com.servicedesk.service_desk.enums.RequestStatus;

import jakarta.validation.constraints.NotNull;

public class UpdateStatusDto {

    // Status is required
    @NotNull(message = "Status is required")
    private RequestStatus status;

    // Getter for status
    public RequestStatus getStatus() {
        return status;
    }

    // Setter for status
    public void setStatus(RequestStatus status) {
        this.status = status;
    }
}