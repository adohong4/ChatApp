package com.backend.backend.controller;


import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class WebSocketEventListener {
    private final Set<String> onlineUsers = ConcurrentHashMap.newKeySet();
    private final SimpMessagingTemplate messagingTemplate;

    public WebSocketEventListener(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    // Khi người dùng đăng nhập
    public void onUserLogin(String userId) {
        onlineUsers.add(userId);
        messagingTemplate.convertAndSend("/topic/online-status", new UserStatus(userId, "online"));
    }

    // Khi người dùng đăng xuất
    public void onUserLogout(String userId) {
        onlineUsers.remove(userId);
        messagingTemplate.convertAndSend("/topic/online-status", new UserStatus(userId, "offline"));
    }

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
