package com.servicedesk.service_desk.controller;

import com.servicedesk.service_desk.dto.AssignRequestDto;
import com.servicedesk.service_desk.dto.CreateRequestDto;
import com.servicedesk.service_desk.dto.UpdatePriorityDto;
import com.servicedesk.service_desk.dto.UpdateStatusDto;
import com.servicedesk.service_desk.entity.Request;
import com.servicedesk.service_desk.enums.Category;
import com.servicedesk.service_desk.enums.Priority;
import com.servicedesk.service_desk.enums.RequestStatus;
import com.servicedesk.service_desk.service.RequestService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/requests")
@CrossOrigin(origins = "*")
public class RequestController {

    private final RequestService requestService;

    public RequestController(RequestService requestService) {
        this.requestService = requestService;
    }


    // Create Request
    @PostMapping
    public Request createRequest(
            @Valid @RequestBody CreateRequestDto dto) {

        return requestService.createRequest(dto);
    }


    // Get All Requests
    @GetMapping
    public List<Request> getAllRequests() {

        return requestService.getAllRequests();
    }


    // Get active requests
    @GetMapping("/active")
    public List<Request> getActiveRequests() {

        return requestService.getActiveRequests();
    }


    //serach request
    @GetMapping("/search")
    public List<Request> searchRequests(

            @RequestParam(required = false) String search,

            @RequestParam(required = false) RequestStatus status,

            @RequestParam(required = false) Priority priority,

            @RequestParam(required = false) Category category,

            @RequestParam(required = false) String assignedTo,

            @RequestParam(defaultValue = "false") boolean active) {

        return requestService.searchRequests(
                search,
                status,
                priority,
                category,
                assignedTo,
                active
        );
    }


    // Get Single Request
    @GetMapping("/{id}")
    public Request getRequestById(
            @PathVariable Long id) {

        return requestService.getRequestById(id);
    }



    // Update Status
    @PatchMapping("/{id}/status")
    public Request updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateStatusDto dto) {

        return requestService.updateStatus(id, dto);
    }


    // Update Priority
    @PatchMapping("/{id}/priority")
    public Request updatePriority(
            @PathVariable Long id,
            @Valid @RequestBody UpdatePriorityDto dto) {

        return requestService.updatePriority(id, dto);
    }


    // Assign Request
    @PatchMapping("/{id}/assign")
    public Request assignRequest(
            @PathVariable Long id,
            @Valid @RequestBody AssignRequestDto dto) {

        return requestService.assignRequest(id, dto);
    }


    // Delete Request
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteRequest(@PathVariable Long id) {

        requestService.deleteRequest(id);
    }
}