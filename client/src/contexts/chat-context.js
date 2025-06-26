"use client";

import React, { createContext, useContext, useState } from "react";

const ChatContext = createContext();
const ChatContextProvider = ({ children }) => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [filedata, setFiledata] = useState({});
  const [showAttachment, setShowAttachment] = useState(false);

  // project mode on
  const [isProjectModeOn, setIsProjectModeOn] = useState(false);
  // Leave chat modal
  const [showChatLeaveModal, setShowChatLeaveModal] = useState(false);
  // report file modal
  const [showReportfileModal, setShowReportfileModal] = useState(false);
  // home page
  const [sessionData, setSessionData] = useState({
    type: "Standard",
    url: "",
    code: "",
    secureCode: "4562",
  });

  // expiry chat time
  const [expiryTime, setExpiryTime] = useState("");

  // verify security code
  const [isVerifiedCode, setIsVerifiedCode] = useState(false);

  // projectMode mobile tooltip
  const [showProjectModeTooltip, setShowProjectModeTooltip] = useState(false);

  // share tooltip
  const [showShareTooltip, setShareTooltip] = useState(false);

  // show notification on copy link from share tooltip
  const [showCopiedNotification, setShowCopiedNotification] = useState(false);

  // Call connect wallet function
  const [connectWalletFunction, setConnectWalletFunction] = useState(
    () => () => {}
  );

  const [isWalletConnected, setIsWalletConnected] = useState(false);

  // Wallet Exist or not
  const [isWalletExist, setIsWalletExist] = useState(true);

  // dropdown selected
  const [dropdownSelected, setdropdownSelected] = useState("Standard");

  const [isLoadingGenerateLink, setIsLoadingGenerateLink] = useState(false);
  // isLoading on generate link button click

  // display notification for generic system messages like error, success, etc.
  const [showNotification, setShowNotification] = useState({
    visible: false,
    message: "Server currently unavailable. Please try again later!",
  });

  const [showLinkNotification, setShowLinkNotification] = useState({
    visible: false,
    message: "Server currently unavailable. Please try again later!",
  });

  // display notification for chat screen messages like error, success, etc.
  // this is for the chat screen only
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
  };

  return <ChatContext.Provider value={data}>{children}</ChatContext.Provider>;
};

export const chatContext = () => useContext(ChatContext);
export default ChatContextProvider;
