package com.taskify.app.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.taskify.app.model.Task;
import com.taskify.app.model.TaskHistory;

import java.util.List;
import java.util.Optional;

@Repository
public interface TaskHistoryRepository extends JpaRepository<TaskHistory, Long> {
    // Find task history by task ID
    List<TaskHistory> findByTaskId(Long taskId);
    
}