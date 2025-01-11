package com.backend.backend.repository;

import com.backend.backend.model.Message;
import com.backend.backend.model.User;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface MessageRepository extends MongoRepository<Message, String> {
    List<Message> findBySenderIdInAndReceiverIdIn(List<ObjectId> senderIds, List<ObjectId> receiverIds);
}
