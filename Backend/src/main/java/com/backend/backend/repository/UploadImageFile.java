package com.backend.backend.repository;

import org.springframework.web.multipart.MultipartFile;

public interface UploadImageFile {
    String uploadImage(MultipartFile file);
}
