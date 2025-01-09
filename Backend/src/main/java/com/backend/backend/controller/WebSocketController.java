package com.backend.backend.controller;

import com.backend.backend.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class WebSocketController {
    @Autowired
    private MessageService messageService;

    @MessageMapping("/connect")
    public void connect(String userId, String socketId) {
        messageService.userConnected(userId, socketId);
    }

    @MessageMapping("/disconnect")
    public void disconnect(String userId) {
        messageService.userDisconnected(userId);
    }
}
