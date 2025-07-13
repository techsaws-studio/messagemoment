import Session from "@/components/session/session";
import React, { useState } from "react";
import conversation from "@/assets/icons/chat/conversation.svg";
import Button from "@/components/button";
import { chatContext } from "@/contexts/chat-context";
import { useSocket } from "@/contexts/socket-context";
import { useRouter } from "next/navigation";
import useCheckIsMobileView from "@/hooks/useCheckIsMobileView";
import Image from "next/image";
import Blur from "@/assets/images/blur.png";

const ChatLeaveModal = () => {
  const router = useRouter();
  const socket = useSocket();
  const { 
    showChatLeaveModal, 
    setShowChatLeaveModal, 
    setIsWalletConnected, 
    sessionData, 
    activeUser 
  } = chatContext();
  const [isClosing, setisClosing] = useState(false);
  const { isMobileView } = useCheckIsMobileView();

  const handleLeaveSession = () => {
    if (socket && sessionData.code && activeUser) {
      // Set up listeners before emitting the event
      const handleLeftRoom = (response) => {
        if (response.success) {
          console.log("Successfully left the session");
        }
        if (response.warning) {
          console.warn(response.warning);
        }
        
        // Clean up listeners
        socket.off("leftRoom", handleLeftRoom);
        socket.off("error", handleError);
        
        // Now proceed with UI cleanup and redirect
        proceedWithLeave();
      };
      
      const handleError = (error) => {
        console.error("Error leaving session:", error);
        
        // Clean up listeners
        socket.off("leftRoom", handleLeftRoom);
        socket.off("error", handleError);
        
        // Still proceed with leave even if there's an error
        proceedWithLeave();
      };
      
      // Set up listeners
      socket.on("leftRoom", handleLeftRoom);
      socket.on("error", handleError);
      
      // Set a timeout as fallback in case the server doesn't respond
      const fallbackTimeout = setTimeout(() => {
        console.warn("Server response timeout, proceeding with leave");
        socket.off("leftRoom", handleLeftRoom);
        socket.off("error", handleError);
        proceedWithLeave();
      }, 5000); // 5 second timeout
      
      // Store timeout reference to clear it if we get a response
      const clearFallback = () => {
        clearTimeout(fallbackTimeout);
      };
      
      // Modify handlers to clear timeout
      const originalHandleLeftRoom = handleLeftRoom;
      const originalHandleError = handleError;
      
      socket.off("leftRoom", handleLeftRoom);
      socket.off("error", handleError);
      
      socket.on("leftRoom", (response) => {
        clearFallback();
        originalHandleLeftRoom(response);
      });
      
      socket.on("error", (error) => {
        clearFallback();
        originalHandleError(error);
      });
      
      // Emit leave room event to backend
      socket.emit("leaveRoom", {
        sessionId: sessionData.code,
        username: activeUser
      });
    } else {
      // If no socket connection, proceed immediately
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
            <Image src={Blur} className="blur-img" alt="Blur"/>
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
