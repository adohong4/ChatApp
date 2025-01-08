package com.backend.backend.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserResponse {
    String email;
    String fullName;
    String password;
    String profilePic;

    public UserResponse(String email, String fullName, String password, String profilePic) {
        this.email = email;
        this.fullName = fullName;
        this.password = password;
        this.profilePic = profilePic;
    }
}
