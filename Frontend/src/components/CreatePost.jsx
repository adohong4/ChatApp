import React, { useState } from "react";
import { FaImage, FaPaperPlane, FaHeart, FaCommentDots, FaShareAlt } from "react-icons/fa";

const PostCreatorWithIcons = () => {
  const [postText, setPostText] = useState("");
  const [image, setImage] = useState(null);
  const [posts, setPosts] = useState([]);
  const [emojiPickerVisible, setEmojiPickerVisible] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [isCommenting, setIsCommenting] = useState({}); // Trạng thái để kiểm tra khi nào hiển thị phần bình luận
  const emojis = ["😀", "😂", "😍", "🔥", "👍", "💡", "🎉", "🌟", "❤️", "😊"];

  const user = {
    id: "user123", // Thêm ID người dùng để theo dõi ai bình luận
    fullName: "John Doe",
    profilePicture: "https://via.placeholder.com/50",
  };

  const handlePostSubmit = () => {
    if (postText.trim() === "" && !image) {
      alert("Please enter some text or upload an image!");
      return;
    }

    const newPost = {
      id: Date.now(),
      text: postText,
      image,
      createdAt: new Date(),
      likes: 0,
      liked: false,
      comments: [],
    };

    setPosts([newPost, ...posts]);
    setPostText("");
    setImage(null);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setImage(reader.result);
    reader.readAsDataURL(file);
  };

  const addEmoji = (emoji) => {
    setPostText(postText + emoji);
  };

  const toggleLike = (postId) => {
    setPosts(
      posts.map((post) =>
        post.id === postId
          ? {
            ...post,
            liked: !post.liked,
            likes: post.liked ? post.likes - 1 : post.likes + 1,
          }
          : post
      )
    );
  };

  const formatTime = (date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  const handleToggleCommentSection = (postId) => {
    setIsCommenting((prevState) => ({
      ...prevState,
      [postId]: !prevState[postId], // Mở hoặc đóng phần bình luận cho bài đăng
    }));
  };

  const handleAddComment = (postId) => {
    if (!commentText.trim()) return;

    const newComment = {
      userId: user.id,
      userName: user.fullName, // Lưu tên người bình luận
      text: commentText,
    };

    setPosts(
      posts.map((post) =>
        post.id === postId
          ? {
            ...post,
            comments: [...post.comments, newComment],
          }
          : post
      )
    );

    setCommentText("");
  };

  return (
    <div className="post-creator-container">
      <div className="post-input-container">
        <div className="post">
          <textarea
            className="post-input"
            placeholder="Hôm nay của bạn có gì?"
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
          />

          <div className="controls">
            <div className="emoji-picker-container">
              <button
                className="emoji-picker-button"
                onClick={() => setEmojiPickerVisible(!emojiPickerVisible)}
              >
                😊
              </button>
              {emojiPickerVisible && (
                <div className="emoji-picker">
                  {emojis.map((emoji, index) => (
                    <button
                      key={index}
                      className="emoji-button"
                      onClick={() => addEmoji(emoji)}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button className="post-submit-button" onClick={handlePostSubmit}>
              <FaPaperPlane size={24} />
            </button>
          </div>
        </div>

        <div className="image-upload-container">
          <div className="image-upload">
            <input
              type="file"
              accept="image/*"
              id="imageUpload"
              onChange={handleImageUpload}
              style={{ display: "none" }}
            />
            <label htmlFor="imageUpload" className="upload-button">
              <FaImage size={24} />
            </label>
          </div>
          {image && (
            <div className="image-preview">
              <img src={image} alt="Preview" />
              <button onClick={() => setImage(null)}>Xóa</button>
            </div>
          )}
        </div>

      </div>


      <div className="post-list" style={{ maxHeight: '600px', overflowY: 'scroll' }}>
        {posts.map((post) => (
          <div key={post.id} className="post-item">
            <div className="post-header">
              <div className="profile-pic">
                <img
                  src={user.profilePicture}
                  alt="User"
                  className="rounded-full"
                />
              </div>
              <div className="user-info">
                <h4 className="user-name">{user.fullName}</h4>
                <p className="time">{formatTime(new Date(post.createdAt))}</p>
              </div>
            </div>
            <div className="post-content">
              <p>{post.text}</p>
              {post.image && <img src={post.image} alt="Post" />}
            </div>
            <div className="post-actions">
              <button
                onClick={() => toggleLike(post.id)}
                className="like-button"
                aria-label="Like or Unlike"
              >
                <FaHeart size={20} color={post.liked ? "red" : "gray"} />
              </button>
              <span>{post.likes} likes</span>
              <button
                className="comment-button"
                onClick={() => handleToggleCommentSection(post.id)} // Hiển thị hoặc ẩn phần bình luận
              >
                <FaCommentDots size={20} /> Bình luận
              </button>
              <button className="share-button">
                <FaShareAlt size={20} /> Chia sẻ
              </button>
            </div>

            {/* Phần bình luận */}
            {isCommenting[post.id] && (
              <div className="comments-section">
                <div className="comments-list">
                  {post.comments.map((comment, index) => (
                    <div key={index} className="comment-item">
                      <p><strong>{comment.userName}:</strong> {comment.text}</p> {/* Hiển thị tên người bình luận */}
                    </div>
                  ))}
                </div>

                <div className="comment-input">
                  <input
                    type="text"
                    placeholder="Viết bình luận của bạn"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                  />
                  <button onClick={() => handleAddComment(post.id)}>Gửi</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostCreatorWithIcons;
