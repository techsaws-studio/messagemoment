import React from "react";

import SideBar from "../side-bar";
import Message from "../messages";
import ChatNotification from "../chat-components/chat-notification";
import Notification from "@/components/notification";

const MessageContainer = ({
  showAttachment,
  messageContainerRef,
  chatMessage,
  handlerName,
  isMobileView,
  isTablet,
  isSafari,
  isAndroid,
  messageType,
  userHasJoinedSession,
  isSessionExpiredRealTime,
  isSessionLockedRealTime,
}) => {
  return (
    <div className="chat-section">
      <div
        className={
          showAttachment ? "message-cont-withAttachment" : "message-cont"
        }
      >
        <div className="fixedMessages-cont">
          {!(isMobileView && handlerName.trim() !== "") && (
            <Message isPinMessage />
          )}

          <Message
            type={messageType.ADVERTISEMENT}
            handlerName={messageType.ADVERTISEMENT}
          />
        </div>
        <div
          ref={messageContainerRef}
          className="messageContainer_inner"
          style={{
            width: isMobileView
              ? isSafari
                ? "98%"
                : isAndroid
                ? "100%"
                : "100%"
              : !isTablet
              ? "100%"
              : "98%",
            height: isMobileView
              ? handlerName.trim() !== ""
                ? "calc(100vh - 340px)"
                : "calc(100vh - 440px)"
              : "",
            paddingBottom: isMobileView ? "85px" : showAttachment ? "60px" : "",
          }}
        >
          {chatMessage.length > 0 &&
            chatMessage.map((item, i) => {
              const showUsername =
                item.type !== messageType.DEFAULT ||
                i === 0 ||
                chatMessage[i - 1]?.handlerName !== item?.handlerName ||
                chatMessage[i - 1]?.type === messageType.EXPIRY_TIME_HAS_SET;

              const isOwnMessage = item?.handlerName === handlerName;

              return (
                <Message
                  key={`chat-index-${i.toString()}`}
                  type={item?.type}
                  userNameColor={item?.userNameColor}
                  handlerName={
                    item?.handlerName != ""
                      ? showUsername
                        ? item?.handlerName
                        : ""
                      : "[Unknown]"
                  }
                  message={item?.message}
                  attachmentFile={item?.attachmentFile}
                  handlerColor={item?.handlerColor}
                  isOwnMessage={isOwnMessage}
                  messageId={
                    item.messageId || `${i}-${item.timestamp || Date.now()}`
                  }
                  timestamp={item.timestamp}
                  isSessionLockedRealTime={isSessionLockedRealTime}
                  isSessionExpiredRealTime={isSessionExpiredRealTime}
                  userHasJoinedSession={userHasJoinedSession}
                />
              );
            })}
        </div>
        <Notification />
        <ChatNotification />
      </div>
      <SideBar />
    </div>
  );
};

export default MessageContainer;
