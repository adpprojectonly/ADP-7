package com.taskify.app.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.taskify.app.model.Task;
import com.taskify.app.model.TaskStatus;

import java.util.List;
import java.util.Optional;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    // Find tasks by status
    List<Task> findByStatus(TaskStatus status);

    // Find tasks assigned to a specific user (Assignee)
    // List<Task> findByAssigneeId(Long assigneeId);

    // Find tasks that a user is a reportee for
    // List<Task> findByReporteesId(Long reporteeId);
    // Find tasks by organization ID
    List<Task> findByOrganizationId(Integer organizationId);

    // Find a task by its ID
    Optional<Task> findById(Long id);

    Optional<Task> findByTitle(String taskTitle);
}