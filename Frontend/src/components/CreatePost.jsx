import React, { useState, useEffect } from "react";
import { FaImage, FaPaperPlane, FaHeart, FaCommentDots, FaShareAlt } from "react-icons/fa";
import { Camera, Mail, User, Heart, MessageCircle, Share2 } from "lucide-react";
import { useNewsStore } from "../store/useNewsStore";
import { useAuthStore } from "../store/useAuthStore";
import { formatTime } from "../lib/utils";
import toast from "react-hot-toast";

const PostCreatorWithIcons = () => {
  const [image, setImage] = useState(null);
  const [emojiPickerVisible, setEmojiPickerVisible] = useState(false);
  const emojis = ["😀", "😂", "😍", "🔥", "👍", "💡", "🎉", "🌟", "❤️", "😊"];
  const { newsfeed, isNewsfeedLoading, getAllNewsfeed, toggleReaction } = useNewsStore();
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

  const handleToggleReaction = async (newsFeedId) => {
    await toggleReaction(newsFeedId);
    getAllNewsfeed();
  };

  useEffect(() => {
    getAllNewsfeed();
  }, [getAllNewsfeed]);

  const addEmoji = (emoji) => {
    setContent((prevContent) => prevContent + emoji);
  };

  return (
    <div className="post-creator-container" style={{ maxHeight: '800px', overflowY: 'scroll' }}>
      <form onSubmit={handleSubmit}>
        <div className="post-input-container">
          <div className="post">
            <div className="profile-pic-1">
              <img src={authUser.profilePic} alt="User" className="rounded-full" />
            </div>

            <textarea
              className="post-input"
              placeholder="Hôm nay của bạn có gì?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />


            <p>{isNewsfeedLoading ? "Đang tải bài viết..." : ""}</p>
          </div>
          <div className="last-input">
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
                  <FaImage size={24} /> Hình ảnh
                </label>
              </div>
              
            </div>
              <div className="emoji-picker-container">
                <button
                  type="button"
                  className="emoji-picker-button"
                  onClick={() => setEmojiPickerVisible(!emojiPickerVisible)}
                >
                  😊 Biểu tượng/ Cảm Xúc
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
                <FaPaperPlane size={24} /> Đăng Trạng thái
              </button>
              
          </div>
          {image && (
                <div className="image-preview">
                  <img src={image} alt="Preview" />
                  <button onClick={() => setImage(null)}>X</button>
                </div>
              )}
        </div>
      </form>
      {/* News Post */}
      <div className="post-list" >
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
              <p className="pContent">{post.content}</p>
              {post.newsPic && <img src={post.newsPic} alt="Post" />}
              <p className="react">{post.reaction} lượt thích</p>
            </div>
            <div className="post-actions">
              <button onClick={() => handleToggleReaction(post._id)} className="like-button">
                {post.hasReacted ? (
                  <>
                    <FaHeart size={20} color="red" />
                    <span style={{ color: "red" }}>Yêu Thích</span>
                  </>
                ) : (
                  <>
                    <Heart size={20} color="gray" /> Yêu Thích
                  </>
                )}
              </button>

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
