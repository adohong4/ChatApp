import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { LogOut, MessageSquare, Settings, User } from "lucide-react";
import { assets } from '../assets/assets';
import '../components/style/style.css'
const Navbar = () => {
  const { logout, authUser } = useAuthStore();

  return (
    <header className="header-container">
      <div className="header-inner">
        <div className="header-content">
          {/* Logo */}
          <div className="header-logo-container">
            <Link to="/" className="header-logo-link">
              <img src={assets.logo} alt="Logo" className="header-logo" />
            </Link>
          </div>

          {/* User Options */}
          <div className="header-options">
            <Link to="/settings" className="header-btn">
              <Settings className="header-icon" />
              <span className="header-btn-text">Cài đặt</span>
            </Link>

            {authUser && (
              <>
                <Link to="/profile" className="header-btn">
                  <User className="header-icon" />
                  <span className="header-btn-text">Thông tin cá nhân</span>
                </Link>

                <button className="header-btn" onClick={logout}>
                  <LogOut className="header-icon" />
                  <span className="header-btn-text">Đăng xuất</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
export default Navbar;
