package com.servicedesk.service_desk.dto;

import com.servicedesk.service_desk.enums.Category;
import com.servicedesk.service_desk.enums.Priority;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class CreateRequestDto {

    // Title validation
    @NotBlank(message = "Title is required")
    @Size(max = 255, message = "Title must not exceed 255 characters")
    private String title;

    // Description validation
    @NotBlank(message = "Description is required")
    @Size(max = 5000, message = "Description must not exceed 5000 characters")
    private String description;

    // Requester name validation
    @NotBlank(message = "Requester name is required")
    @Size(max = 100, message = "Requester name must not exceed 100 characters")
    private String requesterName;

    // Requester email validation
    @NotBlank(message = "Requester email is required")
    @Email(message = "Invalid email format")
    @Size(max = 255, message = "Requester email must not exceed 255 characters")
    private String requesterEmail;

    // Category validation
    @NotNull(message = "Category is required")
    private Category category;

    // Priority validation
    @NotNull(message = "Priority is required")
    private Priority priority;


    // Getter and setter for title
    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }


    // Getter and setter for description
    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }


    // Getter and setter for requester name
    public String getRequesterName() {
        return requesterName;
    }

    public void setRequesterName(String requesterName) {
        this.requesterName = requesterName;
    }


    // Getter and setter for requester email
    public String getRequesterEmail() {
        return requesterEmail;
    }

    public void setRequesterEmail(String requesterEmail) {
        this.requesterEmail = requesterEmail;
    }


    // Getter and setter for category
    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }


    // Getter and setter for priority
    public Priority getPriority() {
        return priority;
    }

    public void setPriority(Priority priority) {
        this.priority = priority;
    }
}