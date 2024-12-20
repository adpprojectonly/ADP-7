package com.taskify.app.service;

import org.springframework.stereotype.Service;

import com.taskify.app.model.Task;
import com.taskify.app.model.TaskHistory;
import com.taskify.app.repository.TaskHistoryRepository;

@Service
public class TaskHistoryService {

    private final TaskHistoryRepository taskHistoryRepository;

    public TaskHistoryService(TaskHistoryRepository taskHistoryRepository) {
        this.taskHistoryRepository = taskHistoryRepository;
    }

    public void logChange(Task task, String fieldName, String oldValue, String newValue) {
        TaskHistory history = new TaskHistory();
        history.setTask(task);
        history.setChangedById(task.getAssignedToId()); // Replace with actual logged-in user
        history.setFieldName(fieldName);
        history.setOldValue(oldValue);
        history.setNewValue(newValue);
        taskHistoryRepository.save(history);
    }
}