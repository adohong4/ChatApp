package com.backend.backend.dto.response;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
public class LoginResponse {
    // Getters và Setters
    private String token;
    private String email;
    private String fullName;

    // Constructor có tham số
    public LoginResponse(String token, String email, String fullName) {
        this.token = token;
        this.email = email;
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public String getFullName() {
        return fullName;
    }

    public String getToken() {
        return token;
    }
}
