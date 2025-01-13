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
            set({ userNewsfeed: res.data });
        } catch (error) {
            toast.error("Lỗi hiển thị bản tin cá nhân")
        }
        finally {
            set({ isUsersLoading: false })
        }
    },

    createNewsfeed: async (content, newsPic) => {
        set({ isNewsfeedLoading: true });
        try {
            // Kiểm tra nếu không có content và newsPic thì không gửi yêu cầu
            if (!content && !newsPic) {
                toast.error("Cần ít nhất một nội dung hoặc ảnh để đăng bài.");
                return;
            }
            const formData = new FormData();

            formData.append("content", content);
            formData.append("newspic", newsPic);


            console.log("Form Data:", [...formData]);

            // Gửi yêu cầu POST
            const res = await axiosInstance.post("/newsfeed/create", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            // Cập nhật state
            set((state) => ({
                newsfeed: [res.data, ...state.newsfeed],
            }));
            toast.success("Đăng bài thành công");
        } catch (error) {
            console.log("lỗi gì đây: ", error);
            toast.error(
                error.response?.data?.message || "Đã xảy ra lỗi khi đăng bài"
            );
        } finally {
            set({ isNewsfeedLoading: false });
        }
    },

}));