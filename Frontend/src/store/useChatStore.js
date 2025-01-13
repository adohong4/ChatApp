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
  subscribeToMessages: (message) => {
    const { users, selectedUser, messages } = get();
  
    let newMessage;
    try {
      if (typeof message === "string") {
        newMessage = JSON.parse(message); // Parse nếu dữ liệu là string
      } else {
        newMessage = message; // Dữ liệu đã là object
      }
    } catch (error) {
      console.error("Lỗi parse tin nhắn:", error, message);
      return;
    }
  
    // Kiểm tra newMessage hợp lệ
    if (!newMessage || !newMessage.senderId || !newMessage.receiverId) {
      console.error("Dữ liệu tin nhắn không hợp lệ:", newMessage);
      return;
    }
  
    const { senderId } = newMessage;
  
    console.log("Danh sách users hiện tại:", users);
    console.log("Sender ID:", senderId);
  
    // Kiểm tra nếu senderId có trong danh sách users
    const senderExists = users.some((user) => user._id === senderId);
  
    if (!senderExists) {
      console.warn(`Sender ID ${senderId} không có trong danh sách users.`);
      return;
    }
  
    // Đưa senderId lên đầu danh sách users
    const updatedUsers = [
      ...users.filter((user) => user._id === senderId), // Lấy user có senderId
      ...users.filter((user) => user._id !== senderId), // Giữ các user khác
    ];
  
    set({ users: updatedUsers }); // Cập nhật lại danh sách users
    toast.success("Bạn có tin nhắn mới!");
  
    // Kiểm tra tin nhắn có thuộc về người dùng đang trò chuyện hay không
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
