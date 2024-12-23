package com.taskify.app.model;

public enum TaskStatus {
    TO_DO,         // Task not yet started
    IN_PROGRESS,   // Task is currently being worked on
    COMPLETED,     // Task has been finished
    BLOCKED;       // Task is blocked for some reason
}