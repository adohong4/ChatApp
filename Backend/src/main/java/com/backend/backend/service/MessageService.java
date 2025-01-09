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
        messageRepository.save(message);
    }

    public void addUserSocket(String userId, String socketId) {
        userSocketMap.put(userId, socketId);
        messagingTemplate.convertAndSend("/topic/onlineUsers", userSocketMap.keySet());
    }

    public void removeUserSocket(String userId) {
        userSocketMap.remove(userId);
        messagingTemplate.convertAndSend("/topic/onlineUsers", userSocketMap.keySet());
    }

    public String getReceiverSocketId(String userId) {
        return userSocketMap.get(userId);
    }

    public void sendMessageToReceiver(String receiverId, Message message) {
        String receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId != null) {
            messagingTemplate.convertAndSendToUser(receiverSocketId, "/newMessage", message);
        }
    }

    public void userConnected(String userId, String socketId) {
        addUserSocket(userId, socketId);
    }

    public void userDisconnected(String userId) {
        removeUserSocket(userId);
    }

    public List<Message> getMessages(ObjectId myId, ObjectId userToChatId) {
        return messageRepository.findBySenderIdInAndReceiverIdIn(
                Arrays.asList(myId, userToChatId),
                Arrays.asList(myId, userToChatId)
        );
    }
}
