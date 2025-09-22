"use client";

import React from "react";

import { chatContext } from "@/contexts/chat-context";

import { scrollManager } from "@/utils/scroll-utils";

import { ArrowDownOutlined } from "@ant-design/icons";
import "./new-message-tooltip.scss";

function NewMessageTooltip() {
  const {
    showNewMessageTooltip,
    expiryNewMessageTooltip,
    numberOfMessages,
    setShowNewMessageTooltip,
    setExpiryNewMessageTooltip,
    setNumberOfMessages,
  } = chatContext();

  const handleTooltipClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    scrollManager.forceScrollToBottom();
    setShowNewMessageTooltip(false);
    setExpiryNewMessageTooltip(false);
    setNumberOfMessages(0);
  };

  const getMessageText = () => {
    if (numberOfMessages > 0) {
      return `${numberOfMessages} NEW MESSAGE${
        numberOfMessages !== 1 ? "S" : ""
      } BELOW`;
    }
    return "NEW MESSAGE BELOW";
  };

  const badgeClass = `
    new-message-badge
    ${expiryNewMessageTooltip ? "badge-expiry" : ""}
    ${showNewMessageTooltip ? "badge-visible" : "badge-hidden"}
  `.trim();

  return (
    <div
      className={badgeClass}
      onClick={handleTooltipClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleTooltipClick(e);
        }
      }}
      style={{ cursor: "pointer" }}
    >
      [ {getMessageText()} <ArrowDownOutlined className="t-up" /> ]
    </div>
  );
}

export default NewMessageTooltip;
