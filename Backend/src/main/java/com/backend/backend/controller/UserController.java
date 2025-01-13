package com.backend.backend.controller;

import com.backend.backend.dto.request.UserLoginRequest;
import com.backend.backend.dto.request.UserRegisterRequest;
import com.backend.backend.model.User;
import com.backend.backend.service.UserService;
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
public class UserController {

    private WebSocketEventListener webSocketEventListener;

    @Autowired
    private UserService userService;


    @Autowired
    private Cloudinary cloudinary;

    public UserController(WebSocketEventListener webSocketEventListener) {
        this.webSocketEventListener = webSocketEventListener;
    }

    private static final long MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB

    @PostMapping("/api/auth/register")

    User createUser(@RequestBody UserRegisterRequest request, HttpServletResponse response){
        return userService.createUser(request, response);
    }

    @PostMapping("/api/auth/login")
    public ResponseEntity<User> login(@RequestBody UserLoginRequest request, HttpServletResponse response){
        User user = userService.login(request, response);

        if (user != null) {
            webSocketEventListener.onUserLogin(user.get_id());
        }

        return ResponseEntity.ok(user);
    }

    @PostMapping("/api/auth/check")
    public ResponseEntity<User> checkAuth(HttpServletRequest request) {
        User user = (User) request.getAttribute("user");

        if (user != null) {
            return ResponseEntity.ok(user);
        } else {
            return ResponseEntity.status(401).body(null); // Unauthorized
        }
    }

    @PostMapping("/api/auth/logout")
    public ResponseEntity<?> Logout(HttpServletRequest request, HttpServletResponse response){
        User user = (User) request.getAttribute("user");

        if (user != null) {
            webSocketEventListener.onUserLogout(user.get_id());
        }

        userService.logout(response);
        return ResponseEntity.ok().body("Dang xuat thanh cong");
    }


    @PostMapping("/api/messages/users")
    List<User> getUser(){
        return userService.getUser();
    }

    @PostMapping("/api/auth/update-profile")
    public ResponseEntity<?> updateProfilePic(@RequestParam("profilePic") MultipartFile file, HttpServletRequest request) {
        if (file.getSize() > MAX_FILE_SIZE) {
            return ResponseEntity.badRequest().body("Kích thước tệp không được vượt quá 2 MB.");
        }

        User user = (User) request.getAttribute("user");
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized - No user found");
        }

        try {
            Map<String, Object> uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap("resource_type", "auto"));
            String imageUrl = (String) uploadResult.get("secure_url");

            user.setProfilePic(imageUrl);
            userService.updateUser(user);

            return ResponseEntity.ok(user);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Có lỗi xảy ra khi tải ảnh lên.");
        }
    }
}
