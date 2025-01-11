import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";


export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.post("/messages/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.post(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      // Gửi yêu cầu POST để lưu tin nhắn và gửi qua WebSocket
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);

      // Cập nhật tin nhắn vào state
      set((state) => ({
        messages: [...state.messages, res.data],
      }));

      console.log("Tin nhắn đã được gửi:", res.data);
    } catch (error) {
      toast.error("Lỗi khi gửi tin nhắn.");
    }
  },

  // Lắng nghe tin nhắn từ WebSocket
  subscribeToMessages: (newMessage) => {
    const { selectedUser } = get();

    if (!newMessage || typeof newMessage !== "object") {
      console.error("Dữ liệu tin nhắn không hợp lệ:", newMessage);
      return;
    }
    toast.success("Bạn có tin nhắn mới từ ");
    // Kiểm tra tin nhắn có thuộc về người dùng được chọn hay không
    if (
      selectedUser &&
      (newMessage.senderId === selectedUser._id || newMessage.receiverId === selectedUser._id)
    ) {
      set((state) => ({
        messages: [...state.messages, newMessage],
      }));

    } else {
      console.log("Tin nhắn không thuộc về người dùng đang trò chuyện, bỏ qua.");
    }
  },


  unsubscribeFromMessages: () => {
    const stompClient = useAuthStore.getState().stompClient;
    if (stompClient) stompClient.unsubscribe();
  },

  setSelectedUser: (user) => {
    set({ selectedUser: user, messages: [] }); // Reset messages khi đổi người dùng
    get().getMessages(user._id); // Lấy tin nhắn cho người dùng mới
  },

}));
