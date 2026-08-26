package com.servicedesk.service_desk.repository;

import com.servicedesk.service_desk.entity.Request;
import com.servicedesk.service_desk.enums.Category;
import com.servicedesk.service_desk.enums.Priority;
import com.servicedesk.service_desk.enums.RequestStatus;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface RequestRepository extends JpaRepository<Request, Long> {

    // Search and filter requests
    @Query("""
        SELECT r FROM Request r
        WHERE
            (:search IS NULL OR
             LOWER(r.title) LIKE LOWER(CONCAT('%', :search, '%')) OR
             LOWER(r.description) LIKE LOWER(CONCAT('%', :search, '%')) OR
             LOWER(r.requesterName) LIKE LOWER(CONCAT('%', :search, '%')) OR
             LOWER(r.requesterEmail) LIKE LOWER(CONCAT('%', :search, '%')))
        AND (:status IS NULL OR r.status = :status)
        AND (:priority IS NULL OR r.priority = :priority)
        AND (:category IS NULL OR r.category = :category)
        AND (:assignedTo IS NULL OR LOWER(r.assignedTo) = LOWER(:assignedTo))
        AND (:active = false OR r.status <> com.servicedesk.service_desk.enums.RequestStatus.CLOSED)
    """)
    List<Request> searchRequests(
            @Param("search") String search,
            @Param("status") RequestStatus status,
            @Param("priority") Priority priority,
            @Param("category") Category category,
            @Param("assignedTo") String assignedTo,
            @Param("active") boolean active
    );

    // Find active requests
    List<Request> findByStatusNot(RequestStatus status);
}