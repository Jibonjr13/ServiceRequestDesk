package com.servicedesk.service_desk.service;

import com.servicedesk.service_desk.entity.Admin;
import com.servicedesk.service_desk.repository.AdminRepository;

import org.springframework.stereotype.Service;

@Service
public class AdminService {

    private final AdminRepository adminRepository;

    public AdminService(AdminRepository adminRepository) {

        this.adminRepository = adminRepository;
    }

    // Admin login
    public boolean login(String username, String password) {

        Admin admin =
                adminRepository.findByUsername(username)
                        .orElse(null);

        if (admin == null) {
            return false;
        }

        return admin.getPassword().equals(password);
    }
}

