import { Tooltip } from "antd";
import React from "react";
import leave_tooltip from "@/assets/icons/chat/leave_tooltip.svg";
import Image from "next/image";
import { chatContext } from "@/chat-context";

const DisconnectBtn = () => {
  // context
  const { setShowChatLeaveModal } = chatContext();
  return (
    <Tooltip
      overlayClassName="copylink-tooltip"
      title={<Image src={leave_tooltip} alt="leave_tooltip" />}
    >
      <button
        className="disconnect-btn"
        onClick={() => setShowChatLeaveModal(true)}
      >
        <p className="chat-text">Disconnect</p>
      </button>
    </Tooltip>
  );
};

export default DisconnectBtn;
