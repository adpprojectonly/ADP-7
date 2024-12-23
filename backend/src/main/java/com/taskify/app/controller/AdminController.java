package com.taskify.app.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.taskify.app.dto.ReqRes;
import com.taskify.app.model.User;
import com.taskify.app.service.UsersManagementService;

@RestController
public class AdminController {
    
    @Autowired
    private UsersManagementService usersManagementService;

    @GetMapping("/admin/get-all-users")
    public ResponseEntity<ReqRes> getAllUsers(){
        return ResponseEntity.ok(usersManagementService.getAllUsers());
    }

    @GetMapping("/admin/get-users/{userId}")
    public ResponseEntity<ReqRes> getUSerByID(@PathVariable Integer userId){
        return ResponseEntity.ok(usersManagementService.getUsersById(userId));
    }

    @PutMapping("/admin/update/{userId}")
    public ResponseEntity<ReqRes> updateUser(@PathVariable Integer userId, @RequestBody User reqres){
        return ResponseEntity.ok(usersManagementService.updateUser(userId, reqres));
    }

    @DeleteMapping("/admin/delete/{userId}")
    public ResponseEntity<ReqRes> deleteUSer(@PathVariable Integer userId){
        return ResponseEntity.ok(usersManagementService.deleteUser(userId));
    }

    @GetMapping("/admin/get-org-profiles/{id}")
    public ResponseEntity<ReqRes> getAllUsers(@PathVariable Integer id){
        return ResponseEntity.ok(usersManagementService.getUsersByOrganizationId(id));
    }    

}
