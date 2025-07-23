import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { chatContext } from "@/contexts/chat-context";
import { useSocket } from "@/contexts/socket-context";
import useCheckIsMobileView from "@/hooks/useCheckIsMobileView";

import Session from "@/components/session/session";
import Button from "@/components/button";

import conversation from "@/assets/icons/chat/conversation.svg";
import Blur from "@/assets/images/blur.png";

const ChatLeaveModal = () => {
  const [isClosing, setisClosing] = useState(false);

  const router = useRouter();
  const socket = useSocket();
  const {
    showChatLeaveModal,
    setShowChatLeaveModal,
    setIsWalletConnected,
    sessionData,
    activeUser,
  } = chatContext();
  const { isMobileView } = useCheckIsMobileView();

  const handleLeaveSession = () => {
    if (socket && sessionData.code && activeUser) {
      const handleLeftRoom = (response) => {
        console.log("Successfully left the session");
        clearTimeout(fallbackTimeout);
        socket.off("leftRoom", handleLeftRoom);
        socket.off("error", handleError);
        proceedWithLeave();
      };

      const handleError = (error) => {
        console.error("Error leaving session:", error);
        clearTimeout(fallbackTimeout);
        socket.off("leftRoom", handleLeftRoom);
        socket.off("error", handleError);
        proceedWithLeave();
      };

      const fallbackTimeout = setTimeout(() => {
        console.warn("Server response timeout, proceeding with leave");
        socket.off("leftRoom", handleLeftRoom);
        socket.off("error", handleError);
        proceedWithLeave();
      }, 1500);

      socket.once("leftRoom", handleLeftRoom);
      socket.once("error", handleError);

      socket.emit("leaveRoom", {
        sessionId: sessionData.code,
        username: activeUser,
      });
    } else {
      proceedWithLeave();
    }
  };

  const proceedWithLeave = () => {
    setisClosing(true);
    setIsWalletConnected(false);
    setTimeout(() => {
      setShowChatLeaveModal(false);
    }, 300);
    setTimeout(() => {
      router.push("/");
    }, 350);
  };

  return (
    <div className={`chatLeaveModal ${showChatLeaveModal && "open-fade"}`}>
      <div className={`chatSession-container ${isClosing && "fade-out"}`}>
        {isMobileView ? (
          <>
            <Image src={Blur} className="blur-img" alt="Blur" />
            <div className="chat-leave-mobile-container">
              <Image src={conversation} alt="conversation-img" />
              <h4>
                Are you sure that you want to leave this chat conversation?
              </h4>
              <p className="chat-text desc">
                Once all users have disconnected from this chat session, it will
                no longer be accessible by anyone using this link.
              </p>
              <div className="btn-flex">
                <Button
                  text={"Cancel"}
                  height={"46px"}
                  width={"150px"}
                  className={"cancel-btn"}
                  onClick={() => {
                    setisClosing(true);
                    setTimeout(() => {
                      setShowChatLeaveModal(false);
                      setisClosing(false);
                    }, 300);
                  }}
                />
                <Button
                  text={"Leave"}
                  height={"46px"}
                  width={"150px"}
                  className="btn-primary text-white header-btn btn-leave"
                  onClick={handleLeaveSession}
                />
              </div>
            </div>
          </>
        ) : (
          <>
            <Session
              key={`expired-session`}
              imgName={conversation}
              height={400}
              showFooter={false}
            >
              <h4>
                Are you sure that you want to leave this chat conversation?
              </h4>
              <p className="chat-text desc">
                Once all users have disconnected from this chat session, it will
                no longer be accessible by anyone using this link.
              </p>
              <div className="btn-flex">
                <Button
                  text={"Cancel"}
                  height={"46px"}
                  width={"150px"}
                  className={"cancel-btn"}
                  onClick={() => {
                    setisClosing(true);
                    setTimeout(() => {
                      setShowChatLeaveModal(false);
                      setisClosing(false);
                    }, 300);
                  }}
                />
                <Button
                  text={"Leave"}
                  height={"46px"}
                  width={"150px"}
                  className="btn-primary text-white header-btn btn-leave"
                  onClick={handleLeaveSession}
                />
              </div>
            </Session>
          </>
        )}
      </div>
    </div>
  );
};

export default ChatLeaveModal;
