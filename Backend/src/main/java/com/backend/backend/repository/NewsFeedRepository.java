package com.backend.backend.repository;

import com.backend.backend.model.NewsFeed;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface NewsFeedRepository extends MongoRepository<NewsFeed, String> {

}
