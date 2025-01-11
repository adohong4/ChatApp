import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { over } from 'stompjs';
import SockJS from "sockjs-client";
import { useChatStore } from "./useChatStore.js";

const BASE_URL = "http://localhost:5001";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  stompClient: null,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.post("/auth/check");
      console.log("check Auth: ", res.data)
      const updatedAuthUser = res.data._id;

      set({ authUser: res.data });

      get().connectSocket(updatedAuthUser);

    } catch (error) {
      console.log("Error in checkAuth:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },


  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Đăng ký thành công");
      get().connectSocket(res.data._id);

      await get().checkAuth();
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Đăng nhập thành công");

      get().connectSocket(res.data._id);

      await get().checkAuth();
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Đăng xuất thành công");
      get().disconnectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("error in update profile:", error);
      toast.error(error.response.data.message);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  // Cấu hình WebSocket và kết nối
  connectSocket: (userId) => {
    const { stompClient } = get();

    if (stompClient && stompClient.connected) {
      console.log("WebSocket already connected, skipping subscription.");
      return;
    }

    console.log("Kết nối với userId:", userId);
    let socket = new SockJS(`${BASE_URL}/ws`);
    const newStompClient = over(socket);

    newStompClient.connect({}, () => {
      // console.log("WebSocket connected");

      // stompClient.subscribe(`/topic/online-status`, (message) => {
      //   const userStatus = JSON.parse(message.body);
      //   get().updateOnlineUsers(userStatus);
      // });

      stompClient.subscribe(`/topic/messages/${userId}`, (message) => {
        const newMessage = JSON.parse(message.body);
        useChatStore.getState().subscribeToMessages(newMessage); // Gọi phương thức cập nhật tin nhắn
      });
    }, (error) => {
      console.error("WebSocket error:", error);
    });

    set({ stompClient: newStompClient });
    // console.log("stompClient được khởi tạo:", stompClient);
  },


  // Ngắt kết nối WebSocket
  disconnectSocket: () => {
    const { stompClient } = get();
    if (stompClient) {
      stompClient.disconnect(() => {
        console.log("WebSocket disconnected");
      });
    }
    set({ stompClient: null });
  },

  // Cập nhật danh sách người dùng online
  // updateOnlineUsers: (userStatus) => {
  //   set((state) => {
  //     const { onlineUsers } = state;
  //     if (userStatus.status === "online") {
  //       // Thêm người dùng vào danh sách online
  //       if (!onlineUsers.includes(userStatus.userId)) {
  //         return { onlineUsers: [...onlineUsers, userStatus.userId] };
  //       }
  //     } else if (userStatus.status === "offline") {
  //       // Xóa người dùng khỏi danh sách online
  //       return { onlineUsers: onlineUsers.filter(id => id !== userStatus.userId) };
  //     }
  //     return state; // Không thay đổi gì nếu không có sự thay đổi trạng thái
  //   });
  // },

  // Cập nhật người dùng đã đăng nhập
  setAuthUser: (user) => set({ authUser: user }),
}));
