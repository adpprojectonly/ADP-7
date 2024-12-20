package com.taskify.app.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.taskify.app.model.Organizations;
import com.taskify.app.model.User;

import lombok.Data;

import java.util.List;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
public class ReqRes {

    private int statusCode;
    private String error;
    private String message;
    private String token;
    private String profilePicture;
    private int organizationId; // This field should be ignored
    private Organizations organization;
    private String refreshToken;
    private String expirationTime;
    private String username;
    private String city;
    private String role;
    private String email;
    private String password;
    private User user;
    private List<User> ourUsersList;


}
