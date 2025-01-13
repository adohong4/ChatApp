package com.backend.backend.controller;

import com.backend.backend.model.NewsFeed;
import com.backend.backend.model.User;
import com.backend.backend.service.NewsService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/newsfeed")
public class NewsController {

    @Autowired
    private NewsService newsService;

    @PostMapping("/create")
    public ResponseEntity<?> createNews(
            @RequestParam String content,
            @RequestParam("newspic") MultipartFile newsPic, // Nhận file upload
            HttpServletRequest request
    ) {
        try {
            User user = (User) request.getAttribute("user");
            if (user == null) {
                return ResponseEntity.status(401).body("Unauthorized - No user found");
            }

            NewsFeed newsFeed = newsService.createNews(user, content, newsPic);
            return ResponseEntity.ok(newsFeed);
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Failed to upload image: " + e.getMessage());
        }
    }

    @PostMapping("/getAll")
    public ResponseEntity<?> getAllNewsWithUserDetails(HttpServletRequest request) {
        try {
            User currentUser = (User) request.getAttribute("user");
            if (currentUser == null) {
                return ResponseEntity.status(401).body("Unauthorized - No user found");
            }

            List<Map<String, Object>> newsWithUserDetails = newsService.getAllPost(currentUser);
            return ResponseEntity.ok(newsWithUserDetails);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to fetch news: " + e.getMessage());
        }
    }

    @PostMapping("/getByUser")
    public ResponseEntity<?> getPostsByUser(HttpServletRequest request) {
        User user = (User) request.getAttribute("user");

        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated");
        }

        try {
            List<Map<String, Object>> userPosts = newsService.getPostsByUser(user.get_id().toString(), user);

            return ResponseEntity.ok(userPosts);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to fetch posts: " + e.getMessage());
        }
    }

    @PostMapping("/toggle/{newsFeedId}")
    public ResponseEntity<?> toggleReaction(@PathVariable String newsFeedId, HttpServletRequest request) {
        User user = (User) request.getAttribute("user");

        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
        }

        try {
            newsService.toggleReaction(user.get_id(), newsFeedId);
            
            return ResponseEntity.ok("Reaction toggled successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to toggle reaction: " + e.getMessage());
        }
    }
}
