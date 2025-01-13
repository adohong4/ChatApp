import { useChatStore } from "../store/useChatStore";

import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";
import CreatePost from "../components/CreatePost";
const HomePage = () => {
  const { selectedUser } = useChatStore();

  return (
    <div className="chat-screen">
      <div className="chat-center-container">
        <div className="chat-box">
          <div className="chat-content">
            <Sidebar />
            {/* {!selectedUser ? <NoChatSelected /> : <ChatContainer />} */}
            {!selectedUser ? <CreatePost /> : <ChatContainer />}
            
          </div>
        </div>
      </div>
    </div>
  );
};
export default HomePage;  
