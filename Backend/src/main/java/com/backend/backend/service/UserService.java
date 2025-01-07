package com.backend.backend.service;

import com.backend.backend.dto.request.UserRegisterRequest;
import com.backend.backend.model.User;
import com.backend.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public User createUser(UserRegisterRequest request){
        User user = new User();

        user.setEmail(request.getEmail());
        user.setFullName(request.getFullName());
        user.setPassword(request.getPassword());

        return userRepository.save(user);
    }
}
