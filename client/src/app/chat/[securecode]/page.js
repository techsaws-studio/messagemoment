import { ChatHeader } from "@/components/chat/header";
import MessageBox from "@/components/chat/messagesBox";
import SideCookieModal from "@/components/home/sideCookieModal";

function Chat() {
  return (
    <>
        <ChatHeader />
        <MessageBox />
        <SideCookieModal />
    </>
  );
}

export default Chat;
