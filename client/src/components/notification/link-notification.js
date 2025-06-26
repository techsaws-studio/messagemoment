"use client";

import React, { useEffect } from "react";

import { chatContext } from "@/contexts/chat-context";

const LinkNotification = () => {
  const { showLinkNotification } = chatContext();

  useEffect(() => {
    if (showLinkNotification.visible) {
      const timer = setTimeout(() => {
        handleNotificationClose();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [showLinkNotification.visible]);

  if (!showLinkNotification.visible) return null;

  return (
    <div
      className={`notification-popup ${
        showLinkNotification.visible ? "showPopup" : ""
      }`}
    >
      <p className="medium">
        {showLinkNotification.message
          ? showLinkNotification.message
          : "Unknown message"}
      </p>
    </div>
  );
};

export default LinkNotification;
