package com.backend.backend.dto.request;


import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import org.springframework.data.mongodb.core.mapping.Document;



@Data
@NoArgsConstructor
@AllArgsConstructor
@Document
public class LoginRequest {
    @Email(message = "Định dạng email sai")
    @NotBlank(message = "Điền đẩy đủ thông tin")
    private String email;

    @NotBlank(message = "Điền đẩy đủ thông tin")
    private String password;

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }
}
