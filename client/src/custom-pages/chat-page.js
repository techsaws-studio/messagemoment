"use client";

import React, { useState } from "react";

import { ChatHeader } from "@/components/chat/header";
import MessageBox from "@/components/chat/messagesBox";
import SideCookieModal from "@/components/home/sideCookieModal";

function ChatPage() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      <ChatHeader />
      <MessageBox />
      <SideCookieModal />
    </>
  );
}

export default ChatPage;
