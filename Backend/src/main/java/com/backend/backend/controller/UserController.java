package com.backend.backend.controller;

import com.backend.backend.dto.request.UserLoginRequest;
import com.backend.backend.dto.request.UserRegisterRequest;
import com.backend.backend.dto.response.UserResponse;
import com.backend.backend.model.User;
import com.backend.backend.repository.UserRepository;
import com.backend.backend.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class UserController {

    private WebSocketEventListener webSocketEventListener;

    @Autowired
    private UserService userService;

    public UserController(WebSocketEventListener webSocketEventListener) {
        this.webSocketEventListener = webSocketEventListener;
    }

    @PostMapping("/api/auth/register")
    User createUser(@RequestBody UserRegisterRequest request, HttpServletResponse response){
        return userService.createUser(request, response);
    }

    @PostMapping("/api/auth/login")
    public ResponseEntity<User> login(@RequestBody UserLoginRequest request, HttpServletResponse response){
        User user = userService.login(request, response);

//        if (user != null) {
//            webSocketEventListener.onUserLogin(user.get_id()); // Giả sử bạn có phương thức getId() trong User
//        }

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
            User user = (User) request.getAttribute("user"); // Lấy thông tin người dùng từ request

        if (user != null) {
            webSocketEventListener.onUserLogout(user.get_id()); // Cập nhật trạng thái offline
        }
        userService.logout(response);
        return ResponseEntity.ok().body("Dang xuat thanh cong");
    }

    @PostMapping("/api/messages/users")
    List<User> getUser(){
        return userService.getUser();
    }

}
