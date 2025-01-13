import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";

export const useNewsStore = create((set, get) => ({

    newsfeed: [],
    userNewsfeed: [],
    isUsersLoading: false,
    isNewsfeedLoading: false,

    getAllNewsfeed: async () => {
        set({ isNewsfeedLoading: true })
        try {
            const res = await axiosInstance.post("/newsfeed/getAll");
            set({ newsfeed: res.data });
        } catch (error) {
            toast.error("Lỗi hiển thị bản tin")
        } finally {
            set({ isNewsfeedLoading: false })
        }
    },

    getUserNewsfeed: async () => {
        set({ isUsersLoading: true })
        try {
            const res = await axiosInstance.post("/newsfeed/getByUser");
            console.log("dataaaaaaaaa: ", res.data)
            set({ userNewsfeed: res.data });
        } catch (error) {
            toast.error("Lỗi hiển thị bản tin cá nhân")
        }
        finally {
            set({ isUsersLoading: false })
        }
    },
}));