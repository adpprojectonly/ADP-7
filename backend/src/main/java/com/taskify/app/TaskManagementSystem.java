package com.taskify.app;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.crypto.password.PasswordEncoder;


@SpringBootApplication
public class TaskManagementSystem {

	public static void main(String[] args) {
		SpringApplication.run(TaskManagementSystem.class, args);
	}

}
