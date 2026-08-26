package com.servicedesk.service_desk.repository;

import com.servicedesk.service_desk.entity.SupportPerson;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SupportPersonRepository
        extends JpaRepository<SupportPerson, Long> {

    // Find support person by name
    Optional<SupportPerson> findByNameIgnoreCase(String name);
}