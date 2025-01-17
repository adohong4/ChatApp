import { useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { Image, Send, X } from "lucide-react";
import toast from "react-hot-toast";
import { emojis } from "../constants/index"

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const { sendMessage } = useChatStore();
  const [emojiPickerVisible, setEmojiPickerVisible] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;

    try {
      await sendMessage({
        text: text.trim(),
        image: imagePreview,
      });

      // Clear form
      setText("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const addEmoji = (emoji) => {
    setText((prevContent) => prevContent + emoji);
  };

  return (
    <div className="message-input-container">
      {imagePreview && (
        <div className="image-preview-wrapper">
          <div className="image-preview-container">
            <img src={imagePreview} alt="Preview" className="image-preview" />
            <button
              onClick={removeImage}
              className="remove-image-button"
              type="button"
            >
              <X className="remove-image-icon" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="message-form">
        <div className="message-input-wrapper">
          <button
            type="button"
            className={`file-upload-button ${imagePreview ? "file-upload-active" : ""
              }`}
            onClick={() => fileInputRef.current?.click()}
          >
            <Image size={20} />
          </button>
          <div className="emoji-picker-container emoji-picker-1">
            <button
              type="button"
              className="emoji-picker-button"
              onClick={() => setEmojiPickerVisible(!emojiPickerVisible)}
            >
              😊
            </button>
            {emojiPickerVisible && (
              <div className="emoji-picker-input">
                {emojis.map((emoji, index) => (
                  <button
                    key={index}
                    className="emoji-button"
                    type="button"
                    onClick={() => addEmoji(emoji)}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            className="hidden-file-input"
            ref={fileInputRef}
            onChange={handleImageChange}
          />

          
          <input
            type="text"
            className="message-input"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

        </div>
        <button
          type="submit"
          className="send-button"
          disabled={!text.trim() && !imagePreview}
        >
          <Send size={22} />
        </button>
      </form>
    </div>
  );
};
export default MessageInput;
