"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { chatContext } from "@/contexts/chat-context";

import { ChatHeader } from "@/components/chat/header";
import MessageBox from "@/components/chat/messagesBox";
import Loader from "@/components/loader";

import { ApiRequest } from "@/utils/api-request";

function ChatPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSessionExpired, setIsSessionExpired] = useState(false);
  const [isSessionLocked, setIsSessionLocked] = useState(false);
  const [sessionStatus, setSessionStatus] = useState(null);

  const { sessionId } = useParams();
  const { setSessionData } = chatContext();

  const fetchSessionData = async (sessionId) => {
    try {
      const validationResponse = await ApiRequest(
        `/validate-session/${sessionId}`,
        "GET"
      );

      if (!validationResponse.success) {
        const status = validationResponse.sessionStatus;
        setSessionStatus(status);

        if (status === "locked") {
          setIsSessionLocked(true);
        } else if (status === "expired") {
          setIsSessionExpired(true);
        } else {
          setIsSessionExpired(true);
        }

        setIsLoading(false);
        return;
      }

      const response = await ApiRequest(
        `/fetch-initial-chat-load-data/${sessionId}`,
        "GET"
      );

      if (response.success) {
        const { sessionType, sessionSecurityCode } = response.data;

        setSessionData({
          type: sessionType,
          url: `https://messagemoment.com/chat/${sessionId}`,
          code: sessionId,
          secureCode: sessionSecurityCode || "",
        });
      } else {
        console.error("Session not found.");
        setIsSessionExpired(true);
      }
    } catch (error) {
      console.error("Error fetching session data:", error.message);
      setIsSessionExpired(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (sessionId) {
      fetchSessionData(sessionId);
    }
  }, [sessionId]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <ChatHeader />
      <MessageBox
        isSessionExpired={isSessionExpired}
        isSessionLocked={isSessionLocked}
        sessionStatus={sessionStatus}
      />
    </>
  );
}

export default ChatPage;
