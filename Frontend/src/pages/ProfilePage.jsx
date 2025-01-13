import { useState, useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, Mail, User, Heart, MessageCircle, Share2 } from "lucide-react";
import { FaUser, FaHeart, FaCommentDots, FaShareAlt, FaNewspaper } from "react-icons/fa";
import { useNewsStore } from "../store/useNewsStore";
import { formatTime, formatDayTime } from "../lib/utils";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);
  const [comments, setComments] = useState({});
  const [isCommenting, setIsCommenting] = useState({}); // Trạng thái để kiểm tra mỗi bài đăng có đang mở phần bình luận hay không
  const { userNewsfeed, isUsersLoading, getUserNewsfeed, toggleReaction } = useNewsStore();

  useEffect(() => {
    getUserNewsfeed();
  }, [getUserNewsfeed]);

  useEffect(() => {
    if (!isUsersLoading) {
      setComments(userNewsfeed.reduce((acc, post) => ({ ...acc, [post.id]: post.comments }), {}));
      setIsCommenting(userNewsfeed.reduce((acc, post) => ({ ...acc, [post.id]: false }), {}));
    }
  }, [userNewsfeed, isUsersLoading]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedImg(URL.createObjectURL(file));
    await updateProfile(file);
  };

  const handleToggleReaction = async (newsFeedId) => {
    await toggleReaction(newsFeedId);
    getUserNewsfeed();
  };

  return (
    <div className="profile">
      <div className="profile__card">
        <div className="profile__title">
          <h1> <FaUser size={15}/>THÔNG TIN CÁ NHÂN</h1>
          {/* <p>Thông tin cá nhân của bạn</p> */}
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
            <span>{formatDayTime(authUser.createAt)}</span>
          </div>
          <div className="profile__account-row">
            <span>Trạng thái tài khoản</span>
            <span className="profile__status--active">Hoạt động</span>
          </div>
        </div>
      </div>

      <div className="profile__posts">
        <h2> <FaNewspaper size={25} /> BÀI ĐĂNG</h2>
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
                  <p className="pContent">{post.content}</p>
                  {post.newsPic && (
                    <div className="post__image-wrapper">
                      <img
                        src={post.newsPic || "/avatar.png"}
                        alt="Avatar"
                        className="post__avatar"
                      />
                    </div>
                  )}
                  <p className="react">{post.reaction} lượt thích</p>
                </div>


                <div className="post__actions">
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
                    <FaCommentDots size={20} />Bình luận
                  </button>
                  <button className="share-button">
                    <FaShareAlt size={20} />Chia sẻ
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
