package com.backend.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
@Data
public class LoginResponse {
    // Getters và Setters
    private String _id;
    private String email;
    private String fullName;
    private String profilePic;

    public LoginResponse(String _id, String email, String fullName, String profilePic) {
        this._id = _id;
        this.email = email;
        this.fullName = fullName;
        this.profilePic = profilePic;
    }

    public String getEmail() {
        return email;
    }

    public String getFullName() {
        return fullName;
    }

    public String get_id() {
        return _id;
    }

    public String getProfilePic() {
        return profilePic;
    }
}
