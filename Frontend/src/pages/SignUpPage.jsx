import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare, User } from "lucide-react";
import { Link } from "react-router-dom";

import AuthImagePattern from "../components/AuthImagePattern";
import toast from "react-hot-toast";
import { assets } from '../assets/assets';
import '../style/style.css'
const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const { signup, isSigningUp } = useAuthStore();

  const validateForm = () => {
    if (!formData.fullName.trim()) return toast.error("Full name is required");
    if (!formData.email.trim()) return toast.error("Email is required");
    if (!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("Invalid email format");
    if (!formData.password) return toast.error("Password is required");
    if (formData.password.length < 6) return toast.error("Password must be at least 6 characters");

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const success = validateForm();

    if (success === true) signup(formData);
  };

  return (
    <div className="container register-page">
      {/* Left Side */}
      <div className="left-side">
        <div className="card">
          {/* Header */}
          <div className="card-header">
            <div className="card-header-title">Tạo tài khoản mới</div>
            <p className="card-header-subtitle">Hãy bắt đầu bằng việc tạo tài khoản miễn phí</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="form-control">
              <label className="label">Họ và tên</label>
              <div className="input-wrapper">
                <div className="input-icon">
                  <User />
                </div>
                <input
                  type="text"
                  className="input"
                  placeholder="Ví dụ: Nguyen Van A"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">Email</label>
              <div className="input-wrapper">
                <div className="input-icon">
                  <Mail />
                </div>
                <input
                  type="email"
                  className="input"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">Mật khẩu</label>
              <div className="input-wrapper">
                <div className="input-icon">
                  <Lock />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className="input"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  className="input-icon right-icon "
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>
            <div className="btn-dangky">
              <button type="submit" className="btn" disabled={isSigningUp}>
                {isSigningUp ? (
                  <>
                    <Loader2 className="animate-spin" />
                    Đang tải...
                  </>
                ) : (
                  "Tạo tài khoản"
                )}
              </button>
            </div>
            <div className="text-center">
              <p>
                Bạn đã có tài khoản?{" "}
                <Link to="/login" className="link">
                  Đăng Nhập
                </Link>
              </p>
            </div>
          </form>


        </div>
      </div>

      {/* Right Side */}
      <div className="right-side">
        <img src={assets.loginimg} alt="Login Logo" />
      </div>
    </div>
  );
};
export default SignUpPage;
