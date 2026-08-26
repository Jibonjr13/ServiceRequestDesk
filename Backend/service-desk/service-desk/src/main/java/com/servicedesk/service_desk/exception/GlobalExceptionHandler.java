package com.servicedesk.service_desk.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // Handle resource not found exception
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleResourceNotFound(
            ResourceNotFoundException ex) {

        Map<String, String> response = new HashMap<>();

        response.put("message", ex.getMessage());

        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(response);
    }


    // Handle validation errors
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationErrors(
            MethodArgumentNotValidException ex) {

        Map<String, String> errors = new HashMap<>();

        ex.getBindingResult()
                .getFieldErrors()
                .forEach(error ->
                        errors.put(
                                error.getField(),
                                error.getDefaultMessage()
                        )
                );

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(errors);
    }


    // Handle invalid ID and invalid enum values
    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<Map<String, String>> handleTypeMismatch(
            MethodArgumentTypeMismatchException ex) {

        Map<String, String> response = new HashMap<>();

        String message =
                "Invalid value '" + ex.getValue()
                        + "' for parameter '" + ex.getName() + "'";

        response.put("message", message);

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(response);
    }


    // Handle malformed JSON
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<Map<String, String>> handleMalformedJson(
            HttpMessageNotReadableException ex) {

        Map<String, String> response = new HashMap<>();

        response.put(
                "message",
                "Malformed or invalid request data"
        );

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(response);
    }


    // Handle business rule violations
    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<Map<String, String>> handleIllegalState(
            IllegalStateException ex) {

        Map<String, String> response = new HashMap<>();

        response.put("message", ex.getMessage());

        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(response);
    }


    // Handle invalid business data
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> handleIllegalArgumentException(
            IllegalArgumentException ex) {

        Map<String, String> response = new HashMap<>();

        response.put("message", ex.getMessage());

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(response);
    }


    // Handle unexpected server errors
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleGeneralException(
            Exception ex) {

        Map<String, String> response = new HashMap<>();

        response.put(
                "message",
                "An unexpected server error occurred"
        );

        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(response);
    }
}