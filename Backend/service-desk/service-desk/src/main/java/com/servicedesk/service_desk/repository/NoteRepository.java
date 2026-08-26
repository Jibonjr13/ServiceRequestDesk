package com.servicedesk.service_desk.repository;

import com.servicedesk.service_desk.entity.Note;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NoteRepository extends JpaRepository<Note, Long> {

    // Find all notes of a request
    List<Note> findByRequestId(Long requestId);
}