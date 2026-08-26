package com.servicedesk.service_desk.controller;

import com.servicedesk.service_desk.entity.SupportPerson;
import com.servicedesk.service_desk.service.SupportPersonService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/support-people")
@CrossOrigin(origins = "*")
public class SupportPersonController {

    private final SupportPersonService supportPersonService;

    public SupportPersonController(
            SupportPersonService supportPersonService) {

        this.supportPersonService = supportPersonService;
    }

    // Get all support people
    @GetMapping
    public List<SupportPerson> getAllSupportPeople() {

        return supportPersonService.getAllSupportPeople();
    }
}