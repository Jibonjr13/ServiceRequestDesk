package com.servicedesk.service_desk.service;

import com.servicedesk.service_desk.dto.CreateNoteDto;
import com.servicedesk.service_desk.entity.Note;
import com.servicedesk.service_desk.enums.RequestStatus;
import com.servicedesk.service_desk.entity.Request;
import com.servicedesk.service_desk.exception.ResourceNotFoundException;
import com.servicedesk.service_desk.repository.NoteRepository;
import com.servicedesk.service_desk.repository.RequestRepository;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NoteService {

    private final NoteRepository noteRepository;
    private final RequestRepository requestRepository;


    // Constructor
    public NoteService(
            NoteRepository noteRepository,
            RequestRepository requestRepository) {

        this.noteRepository = noteRepository;
        this.requestRepository = requestRepository;
    }


    // Create note
    public Note createNote(Long requestId, CreateNoteDto dto) {

        // Find request
        Request request = requestRepository.findById(requestId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Request not found with id: " + requestId
                        )
                );


        // Validate note content
        if (dto.getContent() == null ||
                dto.getContent().trim().isEmpty()) {

            throw new IllegalArgumentException(
                    "Note cannot be empty"
            );
        }


        // Validate note length
        if (dto.getContent().trim().length() > 5000) {

            throw new IllegalArgumentException(
                    "Note must not exceed 5000 characters"
            );
        }


        // Closed request cannot receive new notes
        if (request.getStatus() == RequestStatus.CLOSED) {

            throw new IllegalStateException(
                    "Closed requests cannot be modified"
            );
        }


        // Create note
        Note note = new Note();

        // Set note content
        note.setContent(dto.getContent().trim());

        // Set creation time
        note.setCreatedAt(LocalDateTime.now());

        // Connect note with request
        note.setRequest(request);


        // Save note
        return noteRepository.save(note);
    }



    // Get all notes of a request
    public List<Note> getNotesByRequestId(Long requestId) {

        // Check whether request exists
        if (!requestRepository.existsById(requestId)) {

            throw new ResourceNotFoundException(
                    "Request not found with id: " + requestId
            );
        }

        // Return all notes of this request
        return noteRepository.findByRequestId(requestId);
    }
}