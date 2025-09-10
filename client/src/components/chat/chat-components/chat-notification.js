import React, { Fragment } from "react";

import { chatContext } from "@/contexts/chat-context";

const ChatNotification = () => {
  const { chatScreenNotification } = chatContext();

  return (
    <Fragment>
      {chatScreenNotification?.visible && (
        <div className="chatNotification">
          <p className="medium">
            {chatScreenNotification
              ? chatScreenNotification?.message
              : "Unknown message"}
          </p>
        </div>
      )}
    </Fragment>
  );
};

export default ChatNotification;
