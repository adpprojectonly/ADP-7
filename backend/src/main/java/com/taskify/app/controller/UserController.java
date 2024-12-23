package com.taskify.app.controller;

import org.apache.catalina.connector.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.taskify.app.dto.ReqRes;
import com.taskify.app.service.UsersManagementService;

@RestController
public class UserController {
        
    @Autowired
    private UsersManagementService usersManagementService;

    @GetMapping("/user/get-profile")
    public ResponseEntity<ReqRes> getMyProfile(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        ReqRes response = usersManagementService.getMyInfo(email);
        return  ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/user/get-profile/{id}")
    public ResponseEntity<ReqRes> getUserById(@PathVariable Integer id) {
        ReqRes response = usersManagementService.getUsersById(id);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/user/get-org-profiles/{id}")
    public ResponseEntity<ReqRes> getAllUsers(@PathVariable Integer id){
        return ResponseEntity.ok(usersManagementService.getUsersByOrganizationId(id));
    }

    

    
}
