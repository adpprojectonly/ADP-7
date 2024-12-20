package com.taskify.app.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.taskify.app.model.AuditLog;

import java.util.List;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
    // Find audit logs by entity (e.g., task or user)
    // List<AuditLog> findByEntityIdAndEntityType(Long entityId, String entityType);

    // Find audit logs by user
    List<AuditLog> findByUserId(Long userId);
}
