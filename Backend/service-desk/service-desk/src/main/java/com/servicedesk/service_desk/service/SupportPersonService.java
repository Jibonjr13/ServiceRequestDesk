package com.servicedesk.service_desk.service;

import com.servicedesk.service_desk.entity.SupportPerson;
import com.servicedesk.service_desk.repository.SupportPersonRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SupportPersonService {

    private final SupportPersonRepository supportPersonRepository;

    public SupportPersonService(
            SupportPersonRepository supportPersonRepository) {

        this.supportPersonRepository = supportPersonRepository;
    }

    // Get all support people
    public List<SupportPerson> getAllSupportPeople() {

        return supportPersonRepository.findAll();
    }
}