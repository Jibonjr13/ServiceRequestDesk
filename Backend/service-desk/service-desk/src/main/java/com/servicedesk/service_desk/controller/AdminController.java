package com.servicedesk.service_desk.controller;

import com.servicedesk.service_desk.service.AdminService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {

        this.adminService = adminService;
    }

    // Admin login
    @PostMapping("/login")
    public ResponseEntity<String> login(
            @RequestBody LoginRequest loginRequest) {

        boolean success =
                adminService.login(
                        loginRequest.getUsername(),
                        loginRequest.getPassword()
                );

        if (success) {

            return ResponseEntity.ok(
                    "Login successful"
            );
        }

        return ResponseEntity
                .status(401)
                .body("Invalid username or password");
    }


    // Login request class
    public static class LoginRequest {

        private String username;

        private String password;


        public String getUsername() {

            return username;
        }


        public void setUsername(String username) {

            this.username = username;
        }


        public String getPassword() {

            return password;
        }


        public void setPassword(String password) {

            this.password = password;
        }
    }
}

