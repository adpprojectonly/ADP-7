// package com.taskify.app.service;

// import org.springframework.stereotype.Service;

// import com.taskify.app.model.AuditLog;
// import com.taskify.app.model.User;
// import com.taskify.app.repository.AuditLogRepository;

// import java.time.LocalDateTime;

// @Service
// public class AuditLogService {

//     private final AuditLogRepository auditLogRepository;

//     public AuditLogService(AuditLogRepository auditLogRepository) {
//         this.auditLogRepository = auditLogRepository;
//     }

//     public void logAction(User user, String action, String entityName, Long entityId, String metadata) {
//         AuditLog auditLog = new AuditLog();
//         auditLog.setUser(user);
//         auditLog.setAction(action);
//         auditLog.setEntityName(entityName);
//         auditLog.setEntityId(entityId);
//         auditLog.setMetadata(metadata);
//         auditLog.setTimestamp(LocalDateTime.now());
//         auditLogRepository.save(auditLog);
//     }
// }

