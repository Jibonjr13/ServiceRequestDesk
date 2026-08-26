package com.servicedesk.service_desk.controller;

import com.servicedesk.service_desk.dto.CreateNoteDto;
import com.servicedesk.service_desk.entity.Note;
import com.servicedesk.service_desk.service.NoteService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/requests")
@CrossOrigin(origins = "*")
public class NoteController {

    private final NoteService noteService;

    // Constructor
    public NoteController(NoteService noteService) {
        this.noteService = noteService;
    }

    // Create note
    @PostMapping("/{requestId}/notes")
    @ResponseStatus(HttpStatus.CREATED)
    public Note createNote(
            @PathVariable Long requestId,
            @Valid @RequestBody CreateNoteDto dto) {

        return noteService.createNote(requestId, dto);
    }

    // Get all notes of a request
    @GetMapping("/{requestId}/notes")
    public List<Note> getNotes(
            @PathVariable Long requestId) {

        return noteService.getNotesByRequestId(requestId);
    }
}