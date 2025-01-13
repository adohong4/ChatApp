import React, { useState, useEffect } from "react";
import { FaImage, FaPaperPlane, FaHeart, FaCommentDots, FaShareAlt } from "react-icons/fa";
import { useNewsStore } from "../store/useNewsStore";
import { useAuthStore } from "../store/useAuthStore";
import { formatTime } from "../lib/utils";
import toast from "react-hot-toast";

const PostCreatorWithIcons = () => {
  const [postText, setPostText] = useState("");
  const [image, setImage] = useState(null);
  const [emojiPickerVisible, setEmojiPickerVisible] = useState(false);
  const emojis = ["😀", "😂", "😍", "🔥", "👍", "💡", "🎉", "🌟", "❤️", "😊"];
  const { newsfeed, isNewsfeedLoading, getAllNewsfeed } = useNewsStore();
  const { authUser } = useAuthStore();
  const createNewsfeed = useNewsStore((state) => state.createNewsfeed);
  const [content, setContent] = useState("");
  const [newsPic, setNewsPic] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result);
    reader.readAsDataURL(file);
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Kích thước tệp không được vượt quá 2MB");
      } else {
        setNewsPic(file);
      }
    } 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() && !newsPic) {
      toast.error("Nội dung không được để trống");
      return;
    }

    try {
      await createNewsfeed(content.trim(), newsPic || null);
      getAllNewsfeed();
      setContent("");
      setNewsPic(null);
      setImage(null);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAllNewsfeed();
  }, [getAllNewsfeed]);

  const addEmoji = (emoji) => {
    setContent((prevContent) => prevContent + emoji);
  };

  return (
    <div className="post-creator-container">
      <form onSubmit={handleSubmit}>
        <div className="post-input-container">
          <div className="post">
            <div className="profile-pic">
              <img src={authUser.profilePic} alt="User" className="rounded-full" />
            </div>

            <textarea
              className="post-input"
              placeholder="Hôm nay của bạn có gì?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />

            <div className="controls">
              <div className="emoji-picker-container">
                <button
                  type="button"
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
                        type="button"
                        onClick={() => addEmoji(emoji)}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button type="submit" className="post-submit-button">
                <FaPaperPlane size={24} />
              </button>
            </div>
            <p>{isNewsfeedLoading ? "Đang tải bài viết..." : ""}</p>
          </div>

          <div className="image-upload-container">
            <div className="image-upload">
              <input
                type="file"
                accept="image/*"
                id="imageUpload"
                onChange={handleFileChange}
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
      </form>
      {/* News Post */}
      <div className="post-list" style={{ maxHeight: '600px', overflowY: 'scroll' }}>
        {newsfeed.map((post) => (
          <div key={post.id} className="post-item">
            <div className="post-header">
              <div className="profile-pic">
                <img
                  src={post.profilePic}
                  alt="User"
                  className="rounded-full"
                />
              </div>
              <div className="user-info">
                <h4 className="user-name">{post.fullName}</h4>
                <p className="time">{formatTime(new Date(post.createdAt))}</p>
              </div>
            </div>
            <div className="post-content">
              <p>{post.content}</p>
              {post.newsPic && <img src={post.newsPic} alt="Post" />}
              <p>{post.reaction} lượt thích</p>
            </div>
            <div className="post-actions">
              <button
                className="like-button"
                aria-label="Like or Unlike"
              >
                <FaHeart size={20} color={post.liked ? "red" : "gray"} />
              </button>
              <span>{post.likes} likes</span>
              <button className="comment-button">
                <FaCommentDots size={20} /> Bình luận
              </button>
              <button className="share-button">
                <FaShareAlt size={20} /> Chia sẻ
              </button>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default PostCreatorWithIcons;
