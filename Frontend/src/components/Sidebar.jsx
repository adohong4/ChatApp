import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users } from "lucide-react";

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } = useChatStore();

  const { onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const filteredUsers = showOnlineOnly
    ? users.filter((user) => onlineUsers.includes(user._id))
    : users;

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="sidebar">
      {/* Header */}
      <div className="sidebar-header">
        <div className="sidebar-header-content">
          <Users className="icon-large" />
          <span className="sidebar-header-title">Liên hệ</span>
        </div>
        {/* Online Filter Toggle */}
        <div className="sidebar-online-filter">
          <label className="sidebar-filter-toggle">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox"
            />
            <span className="sidebar-filter-text">Người đang dùng hoạt động</span>
          </label>
          {/* <span className="sidebar-online-count">{(onlineUsers.length - 1)} online</span> */}
        </div>
      </div>

      {/* User List */}
      <div className="sidebar-user-list">
        {filteredUsers.map((user) => (
          <button
            key={user._id}
            onClick={() => setSelectedUser(user)}
            className={`sidebar-user ${selectedUser?._id === user._id ? "sidebar-user-active" : ""
              }`}
          >
            <div className="user-avatar-container">
              <img
                src={user.profilePic || "/avatar.png"}
                alt={user.name}
                className="user-avatar"
              />
              {onlineUsers.includes(user._id) && <span className="user-online-status" />}
            </div>
            {/* User info */}
            <div className="user-info">
              <div className="user-name">{user.fullName}</div>
              <div className="user-status">
                {onlineUsers.includes(user._id) ? "Online" : "Offline"}
              </div>
            </div>
          </button>
        ))}

        {filteredUsers.length === 0 && (
          <div className="sidebar-no-users">Không người dùng nào hoạt động</div>
        )}
      </div>
    </aside>
  );
};
export default Sidebar;
