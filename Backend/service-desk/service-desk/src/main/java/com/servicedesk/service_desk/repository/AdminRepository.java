package com.servicedesk.service_desk.repository;

import com.servicedesk.service_desk.entity.Admin;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AdminRepository extends JpaRepository<Admin, Long> {

    Optional<Admin> findByUsername(String username);
}

