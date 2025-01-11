import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, Mail, User } from "lucide-react";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedImg(URL.createObjectURL(file)); // Hiển thị ảnh đã chọn trước khi upload
    await updateProfile(file); // Gửi tệp trực tiếp
  };


  return (
    <div className="profile">
      <div className="profile__card">
        <div className="profile__title">
          <h1>Thông tin cá nhân</h1>
          <p>Thông tin cá nhân của bạn</p>
        </div>

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
          <p>{isUpdatingProfile ? "Uploading..." : "Click to update photo"}</p>
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
    </div>
  );
};
export default ProfilePage;
