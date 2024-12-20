package com.taskify.app.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.taskify.app.model.Organizations;

@Repository
public interface OrganizationRepository extends JpaRepository<Organizations, Integer> {
    // Find user by email (for login/authentication)
    Organizations findById(int id);
    
}