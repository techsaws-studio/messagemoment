"use client";

import React from "react";

import { chatContext } from "@/contexts/chat-context";

import { ArrowDownOutlined } from "@ant-design/icons";
import "./new-message-tooltip.scss";

function NewMessageTooltip() {
  const { showNewMessageTooltip, expiryNewMessageTooltip, numberOfMessages } =
    chatContext();

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
  `;

  return (
    <span className={badgeClass.trim()}>
      <ArrowDownOutlined /> {label}
    </span>
  );
}

export default NewMessageTooltip;
