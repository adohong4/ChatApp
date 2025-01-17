package com.backend.backend.controller;


import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class WebSocketEventListener {
    private final Set<String> onlineUsers = ConcurrentHashMap.newKeySet();
    private final SimpMessagingTemplate messagingTemplate;

    public WebSocketEventListener(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    public void notify(String userId, String message) throws JsonProcessingException {
        Map<String, String> payload = new HashMap<>();
        payload.put("message", message);

        String jsonMessage = new ObjectMapper().writeValueAsString(payload);

        messagingTemplate.convertAndSend("/topic/notify/" + userId, jsonMessage);
    }

    public void onUserLogin(String userId) {
        onlineUsers.add(userId);
        messagingTemplate.convertAndSend("/topic/online-status", new UserStatus(userId, "online"));
    }

    public void onUserLogout(String userId) {
        onlineUsers.remove(userId);
        messagingTemplate.convertAndSend("/topic/online-status", new UserStatus(userId, "offline"));
    }

//    // API để lấy danh sách tất cả người dùng online
//    public Set<String> getOnlineUsers() {
//        return onlineUsers;
//    }

    // Lớp UserStatus để gửi thông tin trạng thái
    public static class UserStatus {
        private String userId;
        private String status;

        public UserStatus(String userId, String status) {
            this.userId = userId;
            this.status = status;
        }

        public String getUserId() {
            return userId;
        }

        public void setUserId(String userId) {
            this.userId = userId;
        }

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }
    }

}
