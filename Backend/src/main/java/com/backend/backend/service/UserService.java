package com.backend.backend.service;

import com.backend.backend.dto.response.LoginResponse;
import com.backend.backend.config.JwtToken;
import com.backend.backend.dto.request.UserRegisterRequest;
import com.backend.backend.dto.request.LoginRequest;
import com.backend.backend.model.User;
import com.backend.backend.repository.UserRepository;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtToken jwtToken;

    public User createUser(UserRegisterRequest request, HttpServletResponse response){

        // Kiểm tra độ dài mật khẩu
        if (request.getPassword().length() < 8) {
            throw new IllegalArgumentException("Password must be at least 8 characters");
        }

        // Kiểm tra xem email đã tồn tại chưa
        Optional<User> existingUser = userRepository.findByEmail(request.getEmail());
        if (existingUser.isPresent()) {
            throw new IllegalArgumentException("Email already exists");
        }

        String hashedPassword = passwordEncoder.encode(request.getPassword());

        User user = new User();
        user.setEmail(request.getEmail());
        user.setFullName(request.getFullName());
        user.setPassword(hashedPassword);
        user.setProfilePic("");

        User savedUser = userRepository.save(user);

        jwtToken.generateToken(savedUser, response);

        return savedUser;
    }

    public void logout(HttpServletResponse response){
        response.setHeader("Set-Cookie", "jwt=; HttpOnly; Max-Age=0; Path=/;");
    }

    public LoginResponse login(LoginRequest loginRequest, HttpServletResponse response) throws Exception {
        User user = userRepository.findByEmail(loginRequest.getEmail()).orElse(null);
        if (user != null) {
            if (passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
                String token = jwtToken.generateToken(user, response);
                return new LoginResponse(token, user.getEmail(), user.getFullName());
            } else {
                throw new Exception("Tài khoản hoặc mật khẩu không chính xác");
            }
        } else {
            throw new Exception("Tài khoản không tồn tại");
        }
    }

}
