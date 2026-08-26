package com.servicedesk.service_desk.dto;

import com.servicedesk.service_desk.enums.Priority;

import jakarta.validation.constraints.NotNull;

public class UpdatePriorityDto {

    // Priority is required
    @NotNull(message = "Priority is required")
    private Priority priority;

    // Getter for priority
    public Priority getPriority() {
        return priority;
    }

    // Setter for priority
    public void setPriority(Priority priority) {
        this.priority = priority;
    }
}