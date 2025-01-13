package com.backend.backend.service;

import com.backend.backend.model.NewsFeed;
import com.backend.backend.model.User;
import com.backend.backend.repository.NewsFeedRepository;
import com.backend.backend.repository.UserRepository;
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class NewsService {

    private final NewsFeedRepository newsFeedRep;
    private final UserRepository userRepository;
    private final UserService userService;
    private final Cloudinary cloudinary;


    @Autowired
    public NewsService(NewsFeedRepository newsFeedRep, UserRepository userRepository,  UserService userService, Cloudinary cloudinary) {
        this.newsFeedRep = newsFeedRep;
        this.userService = userService;
        this.cloudinary = cloudinary;
        this.userRepository = userRepository;
    }

    private static final long MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB

    public NewsFeed createNews(User user, String content, MultipartFile newsPic) throws IOException {
        String uploadedImageUrl = null;

        if (newsPic != null && !newsPic.isEmpty()) {
            if (newsPic.getSize() > MAX_FILE_SIZE) {
                throw new  IllegalArgumentException("Kích thước tệp không được vượt quá 2 MB.");
            }

            Map<String, Object> uploadResult = cloudinary.uploader().upload(newsPic.getBytes(), ObjectUtils.asMap("resource_type", "auto"));
            uploadedImageUrl = (String) uploadResult.get("secure_url");
        }

        // Tạo bài viết mới
        NewsFeed newsFeed = new NewsFeed();
        newsFeed.setCreatedId(new ObjectId(user.get_id()));
        newsFeed.setContent(content);
        newsFeed.setNewsPic(uploadedImageUrl);
        newsFeed.setCreatedAt(new Date());
        newsFeed.setReaction(new ArrayList<>());

        return newsFeedRep.save(newsFeed);
    }

    public List<Map<String, Object>> getAllPost(User currentUser){
        List<NewsFeed> newsFeeds = newsFeedRep.findAll();
        List<Map<String, Object>> result = new ArrayList<>();

        return newsFeeds.stream()
                .sorted(Comparator.comparing(NewsFeed::getCreatedAt).reversed()) //sortTime
                .map(newsFeed -> {

            User user = userService.findById(newsFeed.getCreatedId().toString());
            if (user == null) {
                throw new IllegalStateException("User not found for createdId: " + newsFeed.getCreatedId());
            }

            Map<String, Object> newsWithUserDetails = new HashMap<>();
            boolean hasReacted = currentUser.getMyReaction() != null && currentUser.getMyReaction().contains(new ObjectId(newsFeed.get_id()));

            newsWithUserDetails.put("_id", newsFeed.get_id());
            newsWithUserDetails.put("createdId", newsFeed.getCreatedId().toString());
            newsWithUserDetails.put("fullName", user != null ? user.getFullName() : "Unknown User");
            newsWithUserDetails.put("profilePic", user != null ? user.getProfilePic() : "default-pic-url");
            newsWithUserDetails.put("content", newsFeed.getContent());
            newsWithUserDetails.put("newsPic", newsFeed.getNewsPic());
            newsWithUserDetails.put("createdAt", newsFeed.getCreatedAt());
            newsWithUserDetails.put("reaction", newsFeed.getReaction() != null ? newsFeed.getReaction().size() : 0);
            newsWithUserDetails.put("hasReacted", hasReacted);

            return newsWithUserDetails;

        }).collect(Collectors.toList());
    }

    public List<Map<String, Object>> getPostsByUser(String userId, User currentUser) {
        List<NewsFeed> newsFeeds = newsFeedRep.findAll();
        List<Map<String, Object>> result = new ArrayList<>();

        newsFeeds.stream()
                .sorted(Comparator.comparing(NewsFeed::getCreatedAt).reversed()) //sortTime
                .filter(newsFeed -> newsFeed.getCreatedId().toString().equals(userId))
                .forEach(newsFeed -> {
                    Map<String, Object> newsWithUserDetails = new HashMap<>();
                    boolean hasReacted = currentUser.getMyReaction() != null && currentUser.getMyReaction().contains(new ObjectId(newsFeed.get_id()));
                    newsWithUserDetails.put("_id", newsFeed.get_id());
                    newsWithUserDetails.put("createdId", newsFeed.getCreatedId().toString());
                    newsWithUserDetails.put("content", newsFeed.getContent());
                    newsWithUserDetails.put("newsPic", newsFeed.getNewsPic());
                    newsWithUserDetails.put("createdAt", newsFeed.getCreatedAt());
                    newsWithUserDetails.put("reaction", newsFeed.getReaction() != null ? newsFeed.getReaction().size() : 0);
                    newsWithUserDetails.put("hasReacted", hasReacted);

                    result.add(newsWithUserDetails);
                });

        return result;
    }

    public void toggleReaction(String userId, String newsFeedId) {
        NewsFeed newsFeed = newsFeedRep.findById(newsFeedId)
                .orElseThrow(() -> new RuntimeException("NewsFeed not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<ObjectId> reactions = newsFeed.getReaction();
        List<ObjectId> myReactions = user.getMyReaction();

        // Kiểm tra xem ID của user có trong danh sách reactions và myReactions không
        int reactionIndex = reactions.indexOf(new ObjectId(user.get_id()));
        int myReactionIndex = myReactions.indexOf(new ObjectId(newsFeedId));

        System.out.println("reactionIndex: " + reactionIndex);
        System.out.println("myReactionIndex: " + myReactionIndex);

        if (reactionIndex >= 0 && myReactionIndex >= 0) {
            reactions.remove(reactionIndex);
            myReactions.remove(myReactionIndex);
            System.out.println("Removed reaction");
        } else {
            reactions.add(new ObjectId(user.get_id()));
            myReactions.add(new ObjectId(newsFeedId));
            System.out.println("Added reaction");
        }

        newsFeed.setReaction(reactions);
        user.setMyReaction(myReactions);
        newsFeedRep.save(newsFeed);
        userRepository.save(user);
    }


}
