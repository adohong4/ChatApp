import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef } from "react";

import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  useEffect(() => {
    getMessages(selectedUser._id);

    subscribeToMessages();

    return () => unsubscribeFromMessages();
  }, [selectedUser._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isMessagesLoading) {
    return (
      <div className="chat-container">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="chat-container">
      <ChatHeader />
      <div className="chat-messages">
        {messages.length === 0 ? (
          <p className="chat-begin">Hãy nhắn tin để cùng nhau bắt đầu cuộc trò chuyện thú vị nha.</p>
        ) : (
          <div className="chat">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`chat-message ${message.senderId === authUser._id ? "chat-message-end" : "chat-message-start"
                  }`}
                ref={messageEndRef}
              >
                <div className="chat-avatar">
                  <div className="chat-avatar-img">
                    <img
                      src={
                        message.senderId === authUser._id
                          ? authUser.profilePic || "/avatar.png"
                          : selectedUser.profilePic || "/avatar.png"
                      }
                      alt="profile pic"
                    />
                  </div>
                </div>
                <div className="chat-bubble">
                  {message.image && <img src={message.image} alt="Attachment" className="chat-image" />}
                  {message.text && <p>{message.text}</p>}
                  <time className="chat-time">{formatMessageTime(message.createdAt)}</time>
                </div>
              </div>
            ))}
          </div>)}</div>

      <MessageInput />
    </div>
  );
};
export default ChatContainer;
