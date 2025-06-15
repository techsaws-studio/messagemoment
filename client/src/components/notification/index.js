import { chatContext } from "@/chat-context";
import React, { useEffect, useState } from "react";

const Notification = () => {
  const { setShowNotification, showNotification } = chatContext();
  const [isChatScreen, setIsChatScreen] = useState(false);

  useEffect(() => {
    if (window.location.pathname.includes("/chat")) {
        setIsChatScreen(true);
      }
    const timer = setTimeout(() => {
        setShowNotification({message: "Server currently unavailable. Please try again later!", visible: true });
    }, 3000); 
    const timer2 = setTimeout(() => {
        setShowNotification((prev)=>({...prev, visible: false}));
    }, 6000); 
    return () => clearTimeout(timer);
  }, []);
  return (
    <div
      className={`notification-popup ${isChatScreen ? "chatScreenPopup" : ""} ${
        showNotification.visible ? "showPopup" : ""
      }`}
    >
      <p className="medium">
        {showNotification.message ? showNotification.message : "Unknown message"}
      </p>
    </div>
  );
};

export default Notification;
