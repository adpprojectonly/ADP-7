package com.taskify.app.utils;

import com.taskify.app.model.Organizations;
import com.taskify.app.model.Task;
import com.taskify.app.model.TaskStatus;
import com.taskify.app.model.User;
import com.taskify.app.repository.OrganizationRepository;
import com.taskify.app.repository.TaskRepository;
import com.taskify.app.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.boot.CommandLineRunner;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Configuration
public class PopulateDB {

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Bean
    public CommandLineRunner createDummyOrganizations(OrganizationRepository organizationRepository) {
        return args -> {
            List<Organizations> organizations = Arrays.asList(
                new Organizations(1, LocalDateTime.now(), "Epam Systems"),
                new Organizations(2, LocalDateTime.now(), "Samsung R&D"),
                new Organizations(3, LocalDateTime.now(), "Plivo"),
                new Organizations(4, LocalDateTime.now(), "Affinsys AI")
            );

            for (Organizations org : organizations) {
                if (!organizationRepository.existsById(org.getId())) {
                    organizationRepository.save(org);
                    System.out.println("Created Organization: " + org.getName());
                }
            }
        };
    }

    @Bean
    public CommandLineRunner createUsers(UserRepository userRepository, OrganizationRepository organizationRepository) {
        return args -> {
            List<Organizations> organizations = organizationRepository.findAll();
            for (Organizations org : organizations) {
                // Create Admin User for the Organization
                String adminEmail = "admin@" + org.getName().toLowerCase().replace(" ", "") + ".com";
                Optional<User> adminOpt = userRepository.findByEmail(adminEmail);
                if (!adminOpt.isPresent()) {
                    User admin = new User();
                    admin.setUsername("Admin " + org.getName());
                    admin.setPassword(passwordEncoder.encode("Admin@123")); // Secure password
                    admin.setOrganization(org.getId());
                    admin.setProfilePicture("https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png");
                    admin.setRole("ADMIN");
                    admin.setEmail(adminEmail);
                    userRepository.save(admin);
                    System.out.println("Created Admin User: " + adminEmail);
                }

                // Create 5 Normal Users for the Organization
                for (int i = 1; i <= 5; i++) {
                    String userEmail = "user" + i + "@" + org.getName().toLowerCase().replace(" ", "") + ".com";
                    Optional<User> userOpt = userRepository.findByEmail(userEmail);
                    if (!userOpt.isPresent()) {
                        User user = new User();
                        user.setUsername("User " + i + " of " + org.getName());
                        user.setPassword(passwordEncoder.encode("User@123")); // Secure password
                        user.setOrganization(org.getId());
                        user.setProfilePicture("https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png");
                        user.setRole("USER");
                        user.setEmail(userEmail);
                        userRepository.save(user);
                        System.out.println("Created Normal User: " + userEmail);
                    }
                }
            }
        };
    }

    @Bean
    public CommandLineRunner createDummyTasks(TaskRepository taskRepository, UserRepository userRepository, OrganizationRepository organizationRepository) {
        return args -> {
            List<Organizations> organizations = organizationRepository.findAll();
            for (Organizations org : organizations) {
                // Fetch Admin User for Assignment
                String adminEmail = "admin@" + org.getName().toLowerCase().replace(" ", "") + ".com";
                Optional<User> adminOpt = userRepository.findByEmail(adminEmail);
                if (adminOpt.isPresent()) {
                    User admin = adminOpt.get();
                    Long adminId = admin.getId();

                    // Fetch Normal Users
                    List<User> users = userRepository.findAll().stream()
                            .filter(user -> user.getOrganization().equals(org.getId()) && user.getRole().equals("USER"))
                            .toList();

                    // Create Tasks
                    for (User user : users) {
                        for (int i = 1; i <= 6; i++) {
                            String taskTitle = "Task " + i + " for " + user.getUsername();
                            Optional<Task> taskOpt = taskRepository.findByTitle(taskTitle);
                            if (!taskOpt.isPresent()) {
                                Task task = new Task();
                                task.setTitle(taskTitle);
                                task.setDescription("Description for " + taskTitle);
                                task.setCreatedAt(LocalDateTime.now());
                                task.setAssignedToId(user.getId()); // Assign to the current user
                                task.setCreatedById(adminId); // Created by admin
                                task.setReporteeId(users.get((i + 1) % users.size()).getId()); // Reportee is another user
                                task.setOrganizationId(org.getId());

                                // Set task status
                                if (i <= 3) {
                                    task.setStatus(TaskStatus.TO_DO);
                                } else if (i <= 5) {
                                    task.setStatus(TaskStatus.IN_PROGRESS);
                                } else {
                                    task.setStatus(TaskStatus.COMPLETED);
                                }

                                taskRepository.save(task);
                                System.out.println("Created Task: " + taskTitle);
                            }
                        }
                    }
                }
            }
        };
    }
}