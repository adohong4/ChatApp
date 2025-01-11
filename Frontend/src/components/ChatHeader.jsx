import { X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();

  return (
    <div className="chat-header">
      <div className="chat-header-container">
        <div className="chat-header-left">
          {/* Avatar */}
          <div className="chat-avatar">
            <div className="chat-avatar-img">
              <img
                src={selectedUser.profilePic || "/avatar.png"}
                alt={selectedUser.fullName}
              />
            </div>
          </div>

          {/* User info */}
          <div className="chat-user-info">
            <h3 className="chat-user-name">{selectedUser.fullName}</h3>
            <p className="chat-user-status">
              {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        {/* Close button */}
        <button
          className="chat-close-button"
          onClick={() => setSelectedUser(null)}
        >
          <span className="close-icon">✕</span>
        </button>
      </div>
    </div>
  );
};
export default ChatHeader;
