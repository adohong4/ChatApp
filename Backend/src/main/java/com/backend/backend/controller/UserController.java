package com.backend.backend.controller;

import com.backend.backend.dto.request.UserLoginRequest;
import com.backend.backend.dto.request.UserRegisterRequest;
import com.backend.backend.dto.response.UserResponse;
import com.backend.backend.model.User;
import com.backend.backend.repository.UserRepository;
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

    @PostMapping("/api/auth/register")
    User createUser(@RequestBody UserRegisterRequest request, HttpServletResponse response){
        return userService.createUser(request, response);
    }

    @PostMapping("/api/auth/login")
    public ResponseEntity<User> login(@RequestBody UserLoginRequest request, HttpServletResponse response){
        User user = userService.login(request, response);
        return ResponseEntity.ok(user);
    }

    @PostMapping("/api/auth/logout")
    public ResponseEntity<?> Logout(HttpServletResponse response){
        userService.logout(response);
        return ResponseEntity.ok().body("Dang xuat thanh cong");
    }
}
