import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { chatContext } from "@/contexts/chat-context";

import { healthMonitor } from "@/utils/health-check";

const Notification = () => {
  const [isChatScreen, setIsChatScreen] = useState(false);
  const [redirectTimer, setRedirectTimer] = useState(null);

  const { setShowNotification, showNotification } = chatContext();
  const router = useRouter();

  useEffect(() => {
    if (window.location.pathname.includes("/chat")) {
      setIsChatScreen(true);
    }

    const isMaintenancePage = window.location.pathname.includes("/maintenance");
    if (isMaintenancePage) {
      return;
    }

    const unsubscribe = healthMonitor.subscribe((healthStatus) => {
      console.log("🔔 Health status changed:", healthStatus);

      if (!healthStatus.isHealthy) {
        let message = healthStatus.message;
        let redirectDelay = 5000;

        if (healthStatus.status === "degraded") {
          message = healthStatus.message;
          redirectDelay = 8000;
        }

        setShowNotification({
          message: message,
          visible: true,
        });

        const timer = setTimeout(() => {
          console.log("🔄 Redirecting to maintenance page...");
          router.push("/maintenance");
        }, redirectDelay);

        setRedirectTimer(timer);
      } else if (healthStatus.isHealthy && showNotification.visible) {
        setShowNotification((prev) => ({
          ...prev,
          visible: false,
        }));

        if (redirectTimer) {
          clearTimeout(redirectTimer);
          setRedirectTimer(null);
        }

        setTimeout(() => {
          setShowNotification({
            message: healthStatus.message || "All systems restored! ✅",
            visible: true,
          });

          setTimeout(() => {
            setShowNotification((prev) => ({
              ...prev,
              visible: false,
            }));
          }, 4000);
        }, 500);
      }
    });

    healthMonitor.startMonitoring();

    return () => {
      unsubscribe();
      if (redirectTimer) {
        clearTimeout(redirectTimer);
      }
    };
  }, [setShowNotification, router, redirectTimer, showNotification.visible]);

  const handleHideNotification = () => {
    setShowNotification((prev) => ({
      ...prev,
      visible: false,
    }));

    if (redirectTimer) {
      clearTimeout(redirectTimer);
      setRedirectTimer(null);
    }
  };

  return (
    <div
      className={`notification-popup ${isChatScreen ? "chatScreenPopup" : ""} ${
        showNotification.visible ? "showPopup" : ""
      }`}
      onClick={handleHideNotification}
    >
      <p className="medium">{showNotification.message || "Unknown message"}</p>
    </div>
  );
};

export default Notification;
