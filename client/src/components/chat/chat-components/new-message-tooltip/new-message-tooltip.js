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

  let label = "New Message";
  if (numberOfMessages > 0) {
    label = `${numberOfMessages} New Message${
      numberOfMessages !== 1 ? "s" : ""
    }`;
  }

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
      <ArrowDownOutlined /> {label}
    </div>
  );
}

export default NewMessageTooltip;
