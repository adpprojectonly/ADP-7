package com.taskify.app.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.taskify.app.model.User;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    // Find user by email (for login/authentication)
    Optional<User> findByEmail(String email);

    // Find user by their ID
    Optional<User> findById(Integer id);

    // Find user by their username (if applicable)
    // Optional<User> findByUsername(String username);

    // Find all users belonging to an organization
    List<User> findByOrganization(Integer organizationId);


}