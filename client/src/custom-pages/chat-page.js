import React from "react";

import { ChatHeader } from "@/components/chat/header";
import MessageBox from "@/components/chat/messagesBox";
import SideCookieModal from "@/components/home/sideCookieModal";

function ChatPage() {
  return (
    <>
      <ChatHeader />
      <MessageBox />
      <SideCookieModal />
    </>
  );
}

export default ChatPage;
