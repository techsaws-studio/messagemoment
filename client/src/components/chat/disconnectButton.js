import React from "react";
import { Tooltip } from "antd";
import Image from "next/image";

import { chatContext } from "@/contexts/chat-context";

import leave_tooltip from "@/assets/icons/chat/leave_tooltip.svg";

const DisconnectBtn = () => {
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
