package com.taskify.app.model;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table
@Data
public class Organizations  {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String name;
    private LocalDateTime createdAt;

    public Organizations(){}

    public Organizations(int id, LocalDateTime date, String name) {
        this.id = id;
        this.createdAt = date;
        this.name = name;
    }


    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public Organizations orElseThrow(Object object) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'orElseThrow'");
    }
}
