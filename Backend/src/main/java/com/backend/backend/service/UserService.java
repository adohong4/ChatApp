package com.backend.backend.service;

import com.backend.backend.config.JwtToken;
import com.backend.backend.dto.request.UserLoginRequest;
import com.backend.backend.dto.request.UserRegisterRequest;
import com.backend.backend.dto.response.UserResponse;
import com.backend.backend.model.User;
import com.backend.backend.repository.UserRepository;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    private UserRepository userRepository;
    private PasswordEncoder passwordEncoder;
    private JwtToken jwtToken;

    @Autowired
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtToken jwtToken){
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtToken = jwtToken;
    }

    public User createUser(UserRegisterRequest request, HttpServletResponse response){

        if (request.getPassword().length() < 8) {
            throw new IllegalArgumentException("Password must be at least 8 characters");
        }

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
        user.setCreateAt(new Date());

        User savedUser = userRepository.save(user);

        jwtToken.generateToken(savedUser, response);

        return savedUser;
    }

    public User login(UserLoginRequest request, HttpServletResponse response) {
        User user = findByEmail(request.getEmail());
        if (user == null) {
            throw new IllegalArgumentException("User not found");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Invalid password");
        }

        jwtToken.generateToken(user, response);

        return user;
    }


    public void logout(HttpServletResponse response){
        response.setHeader("Set-Cookie", "jwt=; HttpOnly; Max-Age=0; Path=/;");
    }

    public User findByEmail(String email) {
        Optional<User> user = userRepository.findByEmail(email);
        return user.orElse(null);
    }

    public User findById(String id) {
        Optional<User> user = userRepository.findById(id);
        return user.orElse(null);
    }

    public List<User> getUser(String userId){
        List<User> users = userRepository.findAll();
        return users.stream()
                .filter(user -> !user.get_id().equals(userId))
                .toList();
    }

    public User updateUser(User user) {
        return userRepository.save(user);
    }

    public User getUserById(String id) {
        return userRepository.findById(id).orElse(null);
    }

}
