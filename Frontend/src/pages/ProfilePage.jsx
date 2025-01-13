import { useState, useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, Mail, User, Heart, MessageCircle, Share2 } from "lucide-react";
import { useNewsStore } from "../store/useNewsStore";
import { formatTime } from "../lib/utils";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);
  const [likes, setLikes] = useState({});
  const [comments, setComments] = useState({});
  const [commentText, setCommentText] = useState("");
  const [isCommenting, setIsCommenting] = useState({}); // Trạng thái để kiểm tra mỗi bài đăng có đang mở phần bình luận hay không
  const { userNewsfeed, isUsersLoading, getUserNewsfeed } = useNewsStore();

  useEffect(() => {
    getUserNewsfeed();
  }, [getUserNewsfeed]);

  useEffect(() => {
    if (!isUsersLoading) {
      setLikes(userNewsfeed.reduce((acc, post) => ({ ...acc, [post.id]: post.likes }), {}));
      setComments(userNewsfeed.reduce((acc, post) => ({ ...acc, [post.id]: post.comments }), {}));
      setIsCommenting(userNewsfeed.reduce((acc, post) => ({ ...acc, [post.id]: false }), {}));
    }
  }, [userNewsfeed, isUsersLoading]);

  const handleLike = (postId) => {
    setLikes((prevLikes) => ({
      ...prevLikes,
      [postId]: prevLikes[postId] + 1,
    }));
  };

  const handleAddComment = (postId) => {
    if (!commentText.trim()) return;

    const newComment = {
      userName: authUser.fullName, // Thêm tên người bình luận
      text: commentText,
    };

    setComments((prevComments) => ({
      ...prevComments,
      [postId]: [...prevComments[postId], newComment],
    }));
    setCommentText("");
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedImg(URL.createObjectURL(file));
    await updateProfile(file);
  };

  const handleToggleCommentSection = (postId) => {
    setIsCommenting((prevState) => ({
      ...prevState,
      [postId]: !prevState[postId], // Chuyển đổi trạng thái hiển thị bình luận của bài đăng
    }));
  };

  return (
    <div className="profile">
      <div className="profile__card">
        <div className="profile__title">
          <h1>Thông tin cá nhân</h1>
          <p>Thông tin cá nhân của bạn</p>
        </div>
        <div className="top__profile">
          <div className="profile__avatar">
            <div className="profile__avatar-image">
              <img
                src={selectedImg || authUser.profilePic || "/avatar.png"}
                alt="Profile"
              />
              <label htmlFor="avatar-upload" className="profile__avatar-upload">
                <Camera size={20} />
                <input
                  type="file"
                  id="avatar-upload"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: "none" }}
                  disabled={isUpdatingProfile}
                />
              </label>
            </div>
            <p>{isUpdatingProfile ? "Đang tải ảnh..." : ""}</p>
          </div>

          <div className="profile__info">
            <div className="profile__info-item">
              <User size={16} />
              <p>{authUser?.fullName}</p>
            </div>

            <div className="profile__info-item">
              <Mail size={16} />
              <p>{authUser?.email}</p>
            </div>
          </div>
        </div>

        <div className="profile__account">
          <div className="profile__account-row">
            <span>Thành viên từ</span>
            <span>{authUser.createdAt?.split("T")[0]}</span>
          </div>
          <div className="profile__account-row">
            <span>Trạng thái tài khoản</span>
            <span className="profile__status--active">Hoạt động</span>
          </div>
        </div>
      </div>

      <div className="profile__posts">
        <h2>Bài đăng của bạn</h2>
        {userNewsfeed.length === 0 ? (
          <p>Chưa có bài đăng nào.</p>
        ) : (
          <div className="posts__list">
            {userNewsfeed.map((post) => (
              <div key={post.id} className="post__card">

                <div className="post__header">
                  <img
                    src={authUser.profilePic || "/avatar.png"}
                    alt="Avatar"
                    className="post__avatar"
                  />
                  <div className="post__info">
                    <h4 className="post__author">{authUser.fullName}</h4>
                    <span className="post__date">{formatTime(post.createdAt)}</span>
                  </div>
                </div>


                <div className="post__content">
                  <p>{post.content}</p>
                  {post.newsPic && (
                    <div className="post__image-wrapper">
                      {/* <img src={post.newsPic} alt="Post" className="post__image" /> */}
                      <img
                        src={post.newsPic || "/avatar.png"}
                        alt="Avatar"
                        className="post__avatar"
                      />
                    </div>
                  )}
                </div>


                <div className="post__actions">
                  <button onClick={() => handleLike(post.id)} className="like-button">
                    <Heart size={20} color={likes[post.id] > 0 ? "red" : "gray"} />{" "}
                    {post.reaction}{likes[post.id]} Thích
                  </button>
                  <button
                    className="comment-button"
                    onClick={() => handleToggleCommentSection(post.id)}
                  >
                    Bình luận
                  </button>
                  <button className="share-button">Chia sẻ</button>
                </div>
                {isCommenting[post.id] && (
                  <div className="comments-section">
                    <div className="comments-list">
                      {comments[post.id]?.map((comment, index) => (
                        <div key={index} className="comment-item">
                          <p><strong>{comment.userName}:</strong> {comment.text}</p> {/* Hiển thị tên người bình luận */}
                        </div>
                      ))}
                    </div>

                    <div className="comment-input">
                      <input
                        type="text"
                        placeholder="Nhập bình luận..."
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
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
