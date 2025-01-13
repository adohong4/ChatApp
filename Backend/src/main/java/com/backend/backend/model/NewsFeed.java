package com.backend.backend.model;

import com.backend.backend.dto.request.ObjectIdDeserializer;
import com.backend.backend.dto.request.ObjectIdSerializer;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.lang.reflect.Array;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Document(collection = "newsfeed")
public class NewsFeed {

    @Id
    private String _id;

    @JsonSerialize(using = ObjectIdSerializer.class)
    @JsonDeserialize(using = ObjectIdDeserializer.class)
    private ObjectId createdId;

    private String content;
    private String newsPic;
    private Date createdAt;
    private List<ObjectId> reaction;

    public NewsFeed() {
        this.reaction = new ArrayList<>(); // Khởi tạo danh sách
    }

    public String get_id() {
        return _id;
    }

    public void set_id(String _id) {
        this._id = _id;
    }

    public ObjectId getCreatedId() {
        return createdId;
    }

    public void setCreatedId(ObjectId createdId) {
        this.createdId = createdId;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getNewsPic() {
        return newsPic;
    }

    public void setNewsPic(String newsPic) {
        this.newsPic = newsPic;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public List<ObjectId> getReaction() {
        return reaction;
    }

    public void setReaction(List<ObjectId> reaction) {
        this.reaction = reaction;
    }
}
