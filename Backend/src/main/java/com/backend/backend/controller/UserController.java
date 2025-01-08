package com.backend.backend.controller;

import com.backend.backend.dto.response.LoginResponse;
import com.backend.backend.dto.request.UserRegisterRequest;
import com.backend.backend.dto.request.LoginRequest;
import com.backend.backend.model.User;
import com.backend.backend.service.UserService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UserController {
    @Autowired
    private UserService userService;


    @PostMapping("/api/user/register")
    User createUser(@RequestBody UserRegisterRequest request, HttpServletResponse response){
        return userService.createUser(request, response);
    }

    @PostMapping("/api/user/logout")
    public ResponseEntity<?> Logout(HttpServletResponse response){
        userService.logout(response);
        return ResponseEntity.ok().body("Dang xuat thanh cong");
    }

    @PostMapping(value = "/api/user/login", produces = "application/json")
    public ResponseEntity<?> Login(@RequestBody LoginRequest loginRequest, HttpServletResponse response) throws Exception {
        LoginResponse loginResponse = userService.login(loginRequest, response);
        return ResponseEntity.ok().body(loginResponse);
    }

}
