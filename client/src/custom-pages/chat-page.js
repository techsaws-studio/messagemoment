"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { chatContext } from "@/contexts/chat-context";

import { ChatHeader } from "@/components/chat/header";
import MessageBox from "@/components/chat/messagesBox";
import SideCookieModal from "@/components/home/sideCookieModal";
import Loader from "@/components/loader";

import { ApiRequest } from "@/utils/api-request";

function ChatPage() {
  const [isLoading, setIsLoading] = useState(true);

  const { sessionId } = useParams();
  const { setSessionData } = chatContext();

  const fetchSessionData = async (sessionId) => {
    try {
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
      }
    } catch (error) {
      console.error("Error fetching session data:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  useEffect(() => {
    if (sessionId) {
      fetchSessionData(sessionId);
    }
  }, [sessionId]);

  return (
    <>
      <ChatHeader />
      <MessageBox />
      <SideCookieModal />
    </>
  );
}

export default ChatPage;
