package com.backend.backend.controller;

import com.backend.backend.dto.request.MessageRequest;
import com.backend.backend.model.Message;
import com.backend.backend.model.User;
import com.backend.backend.service.MessageService;
import com.backend.backend.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/api/messages")
public class MessageController {

    @Autowired
    private UserService userService;

    @Autowired
    private MessageService messageService;

    @PostMapping("/send/{id}")
    public ResponseEntity<?> sendMessage(@PathVariable("id") String receiverId, @RequestBody MessageRequest messageRequest, HttpServletRequest request) {
        User sender = (User) request.getAttribute("user");

        if (sender == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized - No User Found");
        }

        try {
            Message message = new Message();
            message.setSenderId(new ObjectId(sender.get_id())); // Đảm bảo là ObjectId
            message.setReceiverId(new ObjectId(receiverId)); // Đảm bảo là ObjectId
            message.setText(messageRequest.getText());
            message.setImage(messageRequest.getImage());
            message.setCreatedAt(new Date());

            messageService.saveMessage(message);

            return ResponseEntity.status(HttpStatus.CREATED).body(message);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error sending message: " + e.getMessage());
        }
    }

    @PostMapping("/{id}")
    public ResponseEntity<List<Message>> getMessages(@PathVariable("id") String userToChatId, HttpServletRequest request) {
        User sender = (User) request.getAttribute("user");

        if (sender == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }

        List<Message> messages;
        try {
            messages = messageService.getMessages(new ObjectId(sender.get_id()), new ObjectId(userToChatId));
            return ResponseEntity.status(HttpStatus.OK).body(messages);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}
