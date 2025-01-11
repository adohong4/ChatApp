import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import AuthImagePattern from "../components/AuthImagePattern";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare } from "lucide-react";
import { assets } from '../assets/assets';
import '../style/style.css'
const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { login, isLoggingIn } = useAuthStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    login(formData);
  };

  return (
    <div className="login-page">
      {/* Left Side - Form */}
      <div className="left-side-login">
        <div className="left-side">
          {/* Logo */}
          <div className="top-logo-login">
            <img src={assets.logo} alt="Logo" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="form-control">
              <label className="label">Email</label>
              <div className="input-wrapper">
                <Mail className="icon" />
                <input
                  type="email"
                  className="input-field"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">Mật Khẩu</label>
              <div className="input-wrapper">
                <Lock className="icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  className="input-field"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
                <button
                  type="button"
                  className="show-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>
            <div className="btn-login">
              <button
                type="submit"
                className="submit-button"
                disabled={isLoggingIn}
              >
                {isLoggingIn ? (
                  <>
                    <Loader2 className="animate-spin" />
                    Đang tải...
                  </>
                ) : (
                  "Đăng Nhập"
                )}
              </button>
            </div>
            <div className="text-center">
              <p>
                Bạn chưa có tài khản?{" "}
                <Link to="/signup" className="link-text">
                  Tạo tài khoản mới.
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>


      {/* Right Side - Image/Pattern */}
      <div className="right-side-login">
        <img src={assets.loginimg} alt="Login Logo" />
      </div>
    </div>
  );
};
export default LoginPage;
