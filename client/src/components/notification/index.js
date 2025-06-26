"use client";

import React, { useEffect, useState } from "react";

import { chatContext } from "@/contexts/chat-context";

import { useServerHealth } from "@/hooks/useServerHealth";

const Notification = () => {
  const { setShowNotification, showNotification } = chatContext();
  const [isChatScreen, setIsChatScreen] = useState(false);

  const { isServerDown } = useServerHealth({
    checkInterval: 60000,
    enableAutoCheck: true,
  });

  useEffect(() => {
    if (window.location.pathname.includes("/chat")) {
      setIsChatScreen(true);
    }
  }, []);

  useEffect(() => {
    if (isServerDown) {
      setShowNotification({
        message: "Server currently unavailable. Please try again later!",
        visible: true,
      });
    } else {
      setShowNotification((prev) => ({ ...prev, visible: false }));
    }
  }, [isServerDown, setShowNotification]);

  return (
    <div
      className={`notification-popup ${isChatScreen ? "chatScreenPopup" : ""} ${
        showNotification.visible ? "showPopup" : ""
      }`}
    >
      <p className="medium">
        {showNotification.message
          ? showNotification.message
          : "Unknown message"}
      </p>
    </div>
  );
};

export default Notification;
