import { MessageSquare } from "lucide-react";
import { assets } from '../assets/assets';
const NoChatSelected = () => {
  return (
    <div className="welcome-container">
      <div className="welcome-content">
        {/* Icon Display */}
        <div className="icon-display">
          <div className="icon-wrapper">
            <div className="icon animate-bounce">
              <img src={assets.logo} alt="Logo" className="icon-logo" />
            </div>
          </div>
        </div>

        {/* Welcome Text */}
        <h2 className="welcome-title">Chào mừng bạn đến với Talkie Time!</h2>
        <p className="welcome-text">
          Chọn một cuộc trò chuyện từ thanh bên để bắt đầu trò chuyện.
        </p>
      </div>
    </div>
  );
};

export default NoChatSelected;
