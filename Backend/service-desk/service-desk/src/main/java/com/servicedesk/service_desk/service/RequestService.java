package com.servicedesk.service_desk.service;

import com.servicedesk.service_desk.dto.CreateRequestDto;
import com.servicedesk.service_desk.dto.UpdatePriorityDto;
import com.servicedesk.service_desk.dto.UpdateStatusDto;
import com.servicedesk.service_desk.dto.AssignRequestDto;
import com.servicedesk.service_desk.entity.Request;
import com.servicedesk.service_desk.entity.SupportPerson;
import com.servicedesk.service_desk.enums.RequestStatus;
import com.servicedesk.service_desk.enums.Category;
import com.servicedesk.service_desk.enums.Priority;
import com.servicedesk.service_desk.repository.RequestRepository;
import com.servicedesk.service_desk.repository.SupportPersonRepository;
import com.servicedesk.service_desk.exception.ResourceNotFoundException;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class RequestService {

    private final RequestRepository requestRepository;
    private final SupportPersonRepository supportPersonRepository;

    public RequestService(
            RequestRepository requestRepository,
            SupportPersonRepository supportPersonRepository) {

        this.requestRepository = requestRepository;
        this.supportPersonRepository = supportPersonRepository;
    }


    // Create new request
    public Request createRequest(CreateRequestDto dto) {

        // Validate title
        if (dto.getTitle() == null ||
                dto.getTitle().trim().isEmpty()) {

            throw new IllegalArgumentException(
                    "Title is required"
            );
        }

        // Validate title length
        if (dto.getTitle().trim().length() > 255) {

            throw new IllegalArgumentException(
                    "Title must not exceed 255 characters"
            );
        }

        // Validate description
        if (dto.getDescription() == null ||
                dto.getDescription().trim().isEmpty()) {

            throw new IllegalArgumentException(
                    "Description is required"
            );
        }

        // Validate description length
        if (dto.getDescription().trim().length() > 5000) {

            throw new IllegalArgumentException(
                    "Description must not exceed 5000 characters"
            );
        }

        // Validate requester name
        if (dto.getRequesterName() == null ||
                dto.getRequesterName().trim().isEmpty()) {

            throw new IllegalArgumentException(
                    "Requester name is required"
            );
        }

        // Validate requester name length
        if (dto.getRequesterName().trim().length() > 100) {

            throw new IllegalArgumentException(
                    "Requester name must not exceed 100 characters"
            );
        }

        // Validate requester email
        if (dto.getRequesterEmail() == null ||
                dto.getRequesterEmail().trim().isEmpty()) {

            throw new IllegalArgumentException(
                    "Requester email is required"
            );
        }

        // Validate category
        if (dto.getCategory() == null) {

            throw new IllegalArgumentException(
                    "Category is required"
            );
        }

        // Validate priority
        if (dto.getPriority() == null) {

            throw new IllegalArgumentException(
                    "Priority is required"
            );
        }

        Request request = new Request();

        request.setTitle(dto.getTitle().trim());
        request.setDescription(dto.getDescription().trim());
        request.setRequesterName(dto.getRequesterName().trim());
        request.setRequesterEmail(dto.getRequesterEmail().trim());
        request.setCategory(dto.getCategory());
        request.setPriority(dto.getPriority());

        // New request always starts as OPEN
        request.setStatus(RequestStatus.OPEN);

        LocalDateTime now = LocalDateTime.now();

        request.setCreatedAt(now);
        request.setUpdatedAt(now);

        return requestRepository.save(request);
    }


    // Get all requests
    public List<Request> getAllRequests() {

        return requestRepository.findAll();
    }


    // Get single request
    public Request getRequestById(Long id) {

        return requestRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Request not found with id: " + id
                        )
                );
    }


    // Update status
    public Request updateStatus(Long id, UpdateStatusDto dto) {

        // Find request
        Request request = requestRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Request not found with id: " + id
                        )
                );

        // Validate status
        if (dto.getStatus() == null) {

            throw new IllegalArgumentException(
                    "Status is required"
            );
        }

        // Get current status
        RequestStatus currentStatus = request.getStatus();

        // Get new status
        RequestStatus newStatus = dto.getStatus();

        // Closed request cannot be modified
        if (currentStatus == RequestStatus.CLOSED) {

            throw new IllegalStateException(
                    "Closed requests cannot be modified"
            );
        }

        // Request must be RESOLVED before CLOSED
        if (newStatus == RequestStatus.CLOSED
                && currentStatus != RequestStatus.RESOLVED) {

            throw new IllegalStateException(
                    "Request must be RESOLVED before it can be CLOSED"
            );
        }

        // Update status
        request.setStatus(newStatus);

        // Update modification time
        request.setUpdatedAt(LocalDateTime.now());

        // Save request
        return requestRepository.save(request);
    }


    // Update priority
    public Request updatePriority(Long id, UpdatePriorityDto dto) {

        // Find request
        Request request = requestRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Request not found with id: " + id
                        )
                );

        // Closed request cannot be modified
        if (request.getStatus() == RequestStatus.CLOSED) {

            throw new IllegalStateException(
                    "Closed requests cannot be modified"
            );
        }

        // Validate priority
        if (dto.getPriority() == null) {

            throw new IllegalArgumentException(
                    "Priority is required"
            );
        }

        // Update priority
        request.setPriority(dto.getPriority());

        // Update time
        request.setUpdatedAt(LocalDateTime.now());

        // Save request
        return requestRepository.save(request);
    }


    // Assign request to support person
    public Request assignRequest(Long id, AssignRequestDto dto) {

        // Find request
        Request request = requestRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Request not found with id: " + id
                        )
                );

        // Closed request cannot be modified
        if (request.getStatus() == RequestStatus.CLOSED) {

            throw new IllegalStateException(
                    "Closed requests cannot be modified"
            );
        }

        // Validate assigned person
        if (dto.getAssignedTo() == null ||
                dto.getAssignedTo().trim().isEmpty()) {

            throw new IllegalArgumentException(
                    "Assigned person is required"
            );
        }

        // Validate assigned person length
        if (dto.getAssignedTo().trim().length() > 100) {

            throw new IllegalArgumentException(
                    "Assigned person name is too long"
            );
        }

        // Find support person
        SupportPerson supportPerson =
                supportPersonRepository
                        .findByNameIgnoreCase(
                                dto.getAssignedTo().trim()
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Support person not found: "
                                                + dto.getAssignedTo().trim()
                                )
                        );

        // Assign support person's name
        request.setAssignedTo(supportPerson.getName());

        // Update time
        request.setUpdatedAt(LocalDateTime.now());

        // Save request
        return requestRepository.save(request);
    }


    // Delete request
    public void deleteRequest(Long id) {

        Request request = requestRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Request not found with id: " + id
                        )
                );

        requestRepository.delete(request);
    }


    // Search and filter requests
    public List<Request> searchRequests(
            String search,
            RequestStatus status,
            Priority priority,
            Category category,
            String assignedTo,
            boolean active) {

        // Validate search text length
        if (search != null &&
                search.trim().length() > 255) {

            throw new IllegalArgumentException(
                    "Search text must not exceed 255 characters"
            );
        }

        // Validate assigned person filter length
        if (assignedTo != null &&
                assignedTo.trim().length() > 100) {

            throw new IllegalArgumentException(
                    "Assigned person must not exceed 100 characters"
            );
        }

        // Remove unnecessary spaces
        if (search != null) {
            search = search.trim();
        }

        if (assignedTo != null) {
            assignedTo = assignedTo.trim();
        }

        // Search requests
        return requestRepository.searchRequests(
                search,
                status,
                priority,
                category,
                assignedTo,
                active
        );
    }


    // Get active requests
    public List<Request> getActiveRequests() {

        return requestRepository.findByStatusNot(
                RequestStatus.CLOSED
        );
    }
}