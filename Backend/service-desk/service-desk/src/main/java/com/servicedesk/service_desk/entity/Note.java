package com.servicedesk.service_desk.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "notes")
public class Note {

    // Primary key
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Note content
    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    // Note creation time
    private LocalDateTime createdAt;

    // Many notes can belong to one request
    @ManyToOne
    @JoinColumn(name = "request_id", nullable = false)
    private Request request;


    // Getter for id
    public Long getId() {
        return id;
    }

    // Setter for id
    public void setId(Long id) {
        this.id = id;
    }


    // Getter for content
    public String getContent() {
        return content;
    }

    // Setter for content
    public void setContent(String content) {
        this.content = content;
    }


    // Getter for createdAt
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    // Setter for createdAt
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }


    // Getter for request
    @JsonIgnore
    public Request getRequest() {
        return request;
    }

    // Setter for request
    public void setRequest(Request request) {
        this.request = request;
    }
}