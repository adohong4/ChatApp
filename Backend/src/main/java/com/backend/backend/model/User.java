package com.backend.backend.model;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.lang.reflect.Array;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Document(collection = "user")
public class User {
    @Id
    private String _id;

    @Email(message = "Định dạng email sai")
    @NotBlank(message = "Điền đẩy đủ thông tin")
    private String email;

    @NotBlank(message = "Điền đẩy đủ thông tin")
    private String fullName;

    @Size(min = 8, message = "Mật khẩu quá ngắn, cần ít nhất 8 ký tự")
    @NotBlank(message = "Điền đẩy đủ thông tin")
    private String password;

    private String profilePic;
    private List<ObjectId> myReaction;
    private Date createAt;

    public Date getCreateAt() {
        return createAt;
    }

    public void setCreateAt(Date createAt) {
        this.createAt = createAt;
    }

    public User() {
        this.myReaction = new ArrayList<>(); // Khởi tạo danh sách
    }

    public List<ObjectId> getMyReaction() {
        return myReaction;
    }

    public void setMyReaction(List<ObjectId> myReaction) {
        this.myReaction = myReaction;
    }

    public String get_id() {
        return _id;
    }

    public void set_id(String _id) {
        this._id = _id;
    }

    public @Email(message = "Định dạng email sai") @NotBlank(message = "Điền đẩy đủ thông tin") String getEmail() {
        return email;
    }

    public void setEmail(@Email(message = "Định dạng email sai") @NotBlank(message = "Điền đẩy đủ thông tin") String email) {
        this.email = email;
    }

    public @NotBlank(message = "Điền đẩy đủ thông tin") String getFullName() {
        return fullName;
    }

    public void setFullName(@NotBlank(message = "Điền đẩy đủ thông tin") String fullName) {
        this.fullName = fullName;
    }

    public @Size(min = 8, message = "Mật khẩu quá ngắn, cần ít nhất 8 ký tự") @NotBlank(message = "Điền đẩy đủ thông tin") String getPassword() {
        return password;
    }

    public void setPassword(@Size(min = 8, message = "Mật khẩu quá ngắn, cần ít nhất 8 ký tự") @NotBlank(message = "Điền đẩy đủ thông tin") String password) {
        this.password = password;
    }

    public String getProfilePic() {
        return profilePic;
    }

    public void setProfilePic(String profilePic) {
        this.profilePic = profilePic;
    }
}
