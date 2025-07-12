"use client";

import React, { createContext, useContext, useState } from "react";

import { SessionTypeEnum } from "@/enums/session-type-enum";

const ChatContext = createContext();
const ChatContextProvider = ({ children }) => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [filedata, setFiledata] = useState({});
  const [showAttachment, setShowAttachment] = useState(false);
  const [isProjectModeOn, setIsProjectModeOn] = useState(false);
  const [showChatLeaveModal, setShowChatLeaveModal] = useState(false);
  const [showReportfileModal, setShowReportfileModal] = useState(false);
  const [expiryTime, setExpiryTime] = useState("");
  const [isVerifiedCode, setIsVerifiedCode] = useState(false);
  const [showProjectModeTooltip, setShowProjectModeTooltip] = useState(false);
  const [showShareTooltip, setShareTooltip] = useState(false);
  const [showCopiedNotification, setShowCopiedNotification] = useState(false);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [isWalletExist, setIsWalletExist] = useState(true);
  const [isLoadingGenerateLink, setIsLoadingGenerateLink] = useState(false);
  const [users, setUsers] = useState([]);
  const [activeUser, setActiveUser] = useState("");
  const [connectWalletFunction, setConnectWalletFunction] = useState(
    () => () => {}
  );
  const [sessionData, setSessionData] = useState({
    type: SessionTypeEnum.STANDARD,
    url: "",
    code: "",
    secureCode: "",
  });
  const [dropdownSelected, setdropdownSelected] = useState(
    SessionTypeEnum.STANDARD
  );
  const [showNotification, setShowNotification] = useState({
    visible: false,
    message: "Server currently unavailable. Please try again later!",
  });
  const [showLinkNotification, setShowLinkNotification] = useState({
    visible: false,
    message: "Server currently unavailable. Please try again later!",
  });
  const [chatScreenNotification, setChatScreenNotification] = useState({
    visible: false,
    message: "Server currently unavailable. Please try again later!",
  });

  const data = {
    setShowNotification,
    showNotification,

    setChatScreenNotification,
    chatScreenNotification,

    showUploadModal,
    setShowUploadModal,

    filedata,
    setFiledata,

    showAttachment,
    setShowAttachment,

    isProjectModeOn,
    setIsProjectModeOn,

    showChatLeaveModal,
    setShowChatLeaveModal,

    sessionData,
    setSessionData,

    setShowReportfileModal,
    showReportfileModal,

    expiryTime,
    setExpiryTime,

    setIsVerifiedCode,
    isVerifiedCode,

    showProjectModeTooltip,
    setShowProjectModeTooltip,

    showShareTooltip,
    setShareTooltip,

    showCopiedNotification,
    setShowCopiedNotification,

    connectWalletFunction,
    setConnectWalletFunction,

    isWalletConnected,
    setIsWalletConnected,
    isWalletExist,
    setIsWalletExist,

    setdropdownSelected,
    dropdownSelected,

    setIsLoadingGenerateLink,
    isLoadingGenerateLink,

    showLinkNotification,
    setShowLinkNotification,

    users,
    setUsers,
    activeUser,
    setActiveUser,
  };

  return <ChatContext.Provider value={data}>{children}</ChatContext.Provider>;
};

export const chatContext = () => useContext(ChatContext);
export default ChatContextProvider;
