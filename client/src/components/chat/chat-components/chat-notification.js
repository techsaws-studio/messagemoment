import { chatContext } from "@/contexts/chat-context";
import React from "react";

const ChatNotification = () => {
  const { chatScreenNotification } = chatContext();
  return (
    <>
      {chatScreenNotification?.visible && (
        <div className="chatNotification">
          <p className="medium">
            {chatScreenNotification
              ? chatScreenNotification?.message
              : "Unknown message"}
          </p>
        </div>
      )}
    </>
  );
};

export default ChatNotification;
