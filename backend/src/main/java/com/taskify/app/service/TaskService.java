package com.taskify.app.service;

import com.taskify.app.model.Task;
import com.taskify.app.model.TaskStatus;
import com.taskify.app.model.User;
import com.taskify.app.repository.TaskRepository;
import com.taskify.app.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TaskService {
    
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TaskRepository taskRepository;

    // public List<Task> getAllTasks() {
    //     return taskRepository.findAll();
    // }

    // public List<Task> getAllTasks() {
    //     Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    //     String email = authentication.getName();
    //     Optional<User> userOptional = userRepository.findByEmail(email);
    //     if (userOptional.isPresent()) {
    //         if(userOptional.get().getRole() == "ADMIN") {
    //         return taskRepository.findAll().stream()
    //             .filter(task -> userOptional.get().getOrganization().equals(task.getOrganizationId()))
    //             .collect(Collectors.toList());
    //         } else {
    //             Long userId = userOptional.get().getId();
    //             return taskRepository.findAll().stream()
    //                     .filter(task -> userId.equals(task.getAssignedToId()) ||
    //                                     userId.equals(task.getCreatedById()) ||
    //                                     userId.equals(task.getReporteeId()))
    //                     .collect(Collectors.toList());
    //         }
    //     }
    //     return List.of();
    // }

    public List<Task> getAllTasks() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        Optional<User> userOptional = userRepository.findByEmail(email);
        if (userOptional.isPresent()) {
            User currentUser = userOptional.get();
            List<Task> tasks;
            if ("ADMIN".equals(currentUser.getRole())) {
                tasks = taskRepository.findAll().stream()
                    .filter(task -> currentUser.getOrganization().equals(task.getOrganizationId()))
                    .collect(Collectors.toList());
            } else {
                Long userId = currentUser.getId();
                tasks = taskRepository.findAll().stream()
                    .filter(task -> userId.equals(task.getAssignedToId()) ||
                                    userId.equals(task.getCreatedById()) ||
                                    userId.equals(task.getReporteeId()))
                    .collect(Collectors.toList());
            }

            // Fetch actualUserName for each task
            tasks.forEach(task -> {
                Optional<User> assignedToUserOptional = userRepository.findById(task.getAssignedToId().intValue());
                assignedToUserOptional.ifPresent(user -> task.setActualUsername(user.getActualUsername()));
            });

            return tasks;
        }
        return List.of();
    }

    public Optional<Task> getTaskById(Long id) {
        return taskRepository.findById(id);
    }

    public Task createTask(Task task) {
        task.setCreatedAt(LocalDateTime.now());
        task.setUpdatedAt(LocalDateTime.now());
        return taskRepository.save(task);
    }

    public Optional<Task> updateTask(Long id, Task taskDetails) {
        return taskRepository.findById(id).map(task -> {
            task.setTitle(taskDetails.getTitle());
            task.setAssignedToId(taskDetails.getAssignedToId());
            task.setCreatedById(taskDetails.getCreatedById());
            task.setReporteeId(taskDetails.getReporteeId());
            task.setDescription(taskDetails.getDescription());
            task.setAttachedDocument(taskDetails.getAttachedDocument());
            task.setStatus(taskDetails.getStatus());
            task.setUpdatedAt(LocalDateTime.now());
            return taskRepository.save(task);
        });
    }

    public Optional<Task> updateTaskStatus(Long id, TaskStatus status) {
        return taskRepository.findById(id).map(task -> {
            task.setStatus(status);
            task.setUpdatedAt(LocalDateTime.now());
            return taskRepository.save(task);
        });
    }

    public boolean deleteTask(Long id) {
        return taskRepository.findById(id).map(task -> {
            taskRepository.delete(task);
            return true;
        }).orElse(false);
    }
}