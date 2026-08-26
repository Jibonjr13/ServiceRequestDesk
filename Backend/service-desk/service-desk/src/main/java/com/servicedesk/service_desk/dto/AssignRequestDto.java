package com.servicedesk.service_desk.dto;

import jakarta.validation.constraints.NotBlank;

public class AssignRequestDto {

    // Assigned person is required
    @NotBlank(message = "Assigned person is required")
    private String assignedTo;

    // Getter for assignedTo
    public String getAssignedTo() {
        return assignedTo;
    }

    // Setter for assignedTo
    public void setAssignedTo(String assignedTo) {
        this.assignedTo = assignedTo;
    }
}