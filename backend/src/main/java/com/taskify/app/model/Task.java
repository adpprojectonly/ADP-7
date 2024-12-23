package com.taskify.app.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Entity
@Table
@Data
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = true)
    private String actualUsername;

    @Column(name = "assigned_to_id")
    private Long assignedToId;
    
    @Column(name = "created_by_id")
    private Long createdById;
    
    @Column(name = "reportee_id")
    private Long reporteeId;

    @Column(nullable = true)
    private String description;

    @Column(nullable = true) 
    private String attachedDocument;

    @Column(nullable = false)
    private Integer organizationId;

    @Enumerated(EnumType.STRING)
    private TaskStatus status = TaskStatus.TO_DO;

    @Transient
    private Map<String, Object> originalValues = new HashMap<>();

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    @PreUpdate
    private void preUpdate() {
        // Store original values for fields to compare changes
        originalValues.put("status", this.status);
        originalValues.put("assignedToId", this.assignedToId);
    }

    public Task(){}

    public Task(Long id, String title, String description, LocalDateTime createdAt, Long assignedToId, Long createdById, Long reporteeId) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.createdAt = createdAt;
        this.assignedToId = assignedToId;
        this.createdById = createdById;
        this.reporteeId = reporteeId;
    }

}
