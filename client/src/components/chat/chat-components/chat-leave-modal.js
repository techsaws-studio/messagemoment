import Session from "@/components/session/session";
import React, { useState } from "react";
import conversation from "@/assets/icons/chat/conversation.svg";
import Button from "@/components/button";
import { chatContext } from "@/contexts/chat-context";
import { useRouter } from "next/navigation";
import useCheckIsMobileView from "@/hooks/useCheckIsMobileView";
import Image from "next/image";
import Blur from "@/assets/images/blur.png";

const ChatLeaveModal = () => {
  const router = useRouter();
  const { showChatLeaveModal, setShowChatLeaveModal,setIsWalletConnected } = chatContext();
  const [isClosing, setisClosing] = useState(false);
  const { isMobileView } = useCheckIsMobileView();
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
                  onClick={() => {
                    setisClosing(true);
                    setIsWalletConnected(false)
                    setTimeout(() => {
                      setShowChatLeaveModal(false);
                    }, 300);
                    setTimeout(() => {
                      router.push("/");
                    }, 350);
                  }}
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
                  onClick={() => {
                    setisClosing(true);
                    setIsWalletConnected(false)
                    setTimeout(() => {
                      setShowChatLeaveModal(false);
                    }, 300);
                    setTimeout(() => {
                      router.push("/");
                    }, 350);
                  }}
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
