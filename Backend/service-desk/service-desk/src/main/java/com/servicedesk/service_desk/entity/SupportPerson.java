package com.servicedesk.service_desk.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "support_people")
public class SupportPerson {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Support person's name
    @Column(nullable = false, unique = true)
    private String name;

    // Support person's email
    @Column(nullable = false, unique = true)
    private String email;

    // Getter for id
    public Long getId() {
        return id;
    }

    // Setter for id
    public void setId(Long id) {
        this.id = id;
    }

    // Getter for name
    public String getName() {
        return name;
    }

    // Setter for name
    public void setName(String name) {
        this.name = name;
    }

    // Getter for email
    public String getEmail() {
        return email;
    }

    // Setter for email
    public void setEmail(String email) {
        this.email = email;
    }
}