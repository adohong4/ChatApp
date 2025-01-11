package com.backend.backend.service;

import com.backend.backend.model.Message;
import com.backend.backend.model.User;
import com.backend.backend.repository.MessageRepository;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class MessageService {

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    private final Map<String, String> userSocketMap = new HashMap<>();

    public void saveMessage(Message message) {
        messageRepository.save(message); // Lưu tin nhắn vào cơ sở dữ liệu
    }

    public void sendMessageToReceiver(String receiverId, Message message) {
        // Gửi tin nhắn đến người nhận qua WebSocket
        messagingTemplate.convertAndSend("/topic/messages/" + receiverId, message);
    }


    public List<Message> getMessages(ObjectId myId, ObjectId userToChatId) {
        return messageRepository.findBySenderIdInAndReceiverIdIn(
                Arrays.asList(myId, userToChatId),
                Arrays.asList(myId, userToChatId)
        );
    }
}
