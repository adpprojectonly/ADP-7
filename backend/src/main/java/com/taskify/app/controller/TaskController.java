package com.taskify.app.controller;

import com.taskify.app.model.Task;
import com.taskify.app.model.TaskStatus;
import com.taskify.app.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/tasks")
public class TaskController {

    @Autowired
    private TaskService taskService;

    @GetMapping
    public ResponseEntity<List<Task>> getAllTasks() {
        // Only those tasks are returned where the current logged in user plays a role.
        List<Task> tasks = taskService.getAllTasks(); 
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Task> getTaskById(@PathVariable Long id) {
        Optional<Task> task = taskService.getTaskById(id);
        return task.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Task> createTask(@RequestBody Task task) {
        Task createdTask = taskService.createTask(task);
        return ResponseEntity.status(201).body(createdTask);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Task> updateTask(@PathVariable Long id, @RequestBody Task taskDetails) {
        Optional<Task> updatedTask = taskService.updateTask(id, taskDetails);
        return updatedTask.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // @PatchMapping("/{id}/{status}")
    // public ResponseEntity<Task> updateTaskStatus(@PathVariable Long id, @PathVariable String status) {
    //     TaskStatus current_status;
    //     if (status.equals("IN_PROGRESS")) {
    //         current_status = TaskStatus.IN_PROGRESS;
    //     } else if (status.equals("COMPLETED")) {
    //         current_status = TaskStatus.COMPLETED;
    //     } else if (status.equals("TO_DO")) {
    //         current_status = TaskStatus.TO_DO;
    //     } else if (status.equals("BLOCKED")) {
    //         current_status = TaskStatus.BLOCKED;
    //     } else {
    //         return ResponseEntity.badRequest().build();
    //     }
    //     System.out.println(current_status);
    //     Optional<Task> updatedTask = taskService.updateTaskStatus(id, current_status);
    //     return updatedTask.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    // }

    @PatchMapping("/{id}/{status}")
    public ResponseEntity<Task> updateTaskStatus(@PathVariable Long id, @PathVariable String status, @RequestHeader("userId") Long userId) {
        TaskStatus current_status;
        if (status.equals("IN_PROGRESS")) {
            current_status = TaskStatus.IN_PROGRESS;
        } else if (status.equals("COMPLETED")) {
            current_status = TaskStatus.COMPLETED;
        } else if (status.equals("TO_DO")) {
            current_status = TaskStatus.TO_DO;
        } else if (status.equals("BLOCKED")) {
            current_status = TaskStatus.BLOCKED;
        } else {
            return ResponseEntity.badRequest().build();
        }

        Optional<Task> taskOptional = taskService.getTaskById(id);
        if (taskOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Task task = taskOptional.get();
        if (!task.getAssignedToId().equals(userId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        Optional<Task> updatedTask = taskService.updateTaskStatus(id, current_status);
        return updatedTask.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        boolean isDeleted = taskService.deleteTask(id);
        if (isDeleted) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}