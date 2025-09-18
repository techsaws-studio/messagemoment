import React, { useEffect, useMemo, useState } from "react";

import SideBar from "../side-bar";
import Message from "../messages";
import ChatNotification from "../chat-components/chat-notification";
import Notification from "@/components/notification";

import { chatContext } from "@/contexts/chat-context";

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
  const [currentTime, setCurrentTime] = useState(Date.now());

  const { isProjectModeOn } = chatContext();

  const visibleMessagesWithUsernameLogic = useMemo(() => {
    const now = currentTime;

    const visibleMessages = chatMessage.filter((message, index) => {
      if (
        message.isPermanent ||
        isProjectModeOn ||
        !message.expiresAt ||
        message.type === messageType.ADVERTISEMENT ||
        message.type === messageType.GREETING ||
        message.type === messageType.MESSAGE_MOMENT ||
        message.type === messageType.SECURITY_CODE ||
        message.type === messageType.ASK_TO_SET_EXPIRYTIME ||
        message.type === messageType.PROJECT_MODE ||
        message.type === messageType.PROJECT_MODE_ENTRY ||
        message.type === messageType.MM_NOTIFICATION ||
        message.type === messageType.MM_ERROR_MSG ||
        message.type === messageType.MM_ALERT ||
        message.type === messageType.EXPIRY_TIME_HAS_SET ||
        message.type === messageType.PHANTOM_WALLET ||
        message.type === messageType.MM_NOTIFICATION_REMOVE_USER ||
        message.handlerName === "[MessageMoment.com]" ||
        message.handlerName === "[AI_RESEARCH_COMPANION]"
      ) {
        return true;
      }

      if (message._shouldExpireImmediately) {
        return false;
      }

      if (
        message.isLiveTyping &&
        !message.isFullyRendered &&
        !message.isOwnMessage
      ) {
        return true;
      }

      if (message.expiresAt && now >= message.expiresAt) {
        return false;
      }

      return true;
    });

    return visibleMessages.map((message, index) => {
      const showUsername =
        message.type !== messageType.DEFAULT ||
        index === 0 ||
        visibleMessages[index - 1]?.handlerName !== message?.handlerName ||
        visibleMessages[index - 1]?.type === messageType.EXPIRY_TIME_HAS_SET;

      return {
        ...message,
        showUsername,
        isOwnMessage: message?.handlerName === handlerName,
      };
    });
  }, [chatMessage, messageType, handlerName, isProjectModeOn, currentTime]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="chat-section" style={{ zIndex: "30" }}>
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
          {visibleMessagesWithUsernameLogic.map((item, i) => (
            <Message
              key={
                item.messageId || item.tempId || `chat-index-${i.toString()}`
              }
              type={item?.type}
              userNameColor={item?.userNameColor}
              handlerName={
                item?.handlerName !== ""
                  ? item.showUsername
                    ? item?.handlerName
                    : ""
                  : "[Unknown]"
              }
              message={item?.message}
              attachmentFile={item?.attachmentFile}
              handlerColor={item?.handlerColor}
              isOwnMessage={item.isOwnMessage}
              messageId={
                item.messageId || `${i}-${item.timestamp || Date.now()}`
              }
              timestamp={item.timestamp}
              isSessionLockedRealTime={isSessionLockedRealTime}
              isSessionExpiredRealTime={isSessionExpiredRealTime}
              userHasJoinedSession={userHasJoinedSession}
              expiresAt={item.expiresAt}
              isPermanent={item.isPermanent}
              skipExpirationCheck={true}
            />
          ))}
        </div>
        <Notification />
        <ChatNotification />
      </div>
      <SideBar />
    </div>
  );
};

export default MessageContainer;
