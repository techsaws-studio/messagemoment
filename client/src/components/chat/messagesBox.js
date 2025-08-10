"use client";

import React, {
  createRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  isSafari as isSAF,
  isAndroid,
  isMobile,
  isTablet,
} from "react-device-detect";

import { SessionTypeEnum } from "@/enums/session-type-enum";

import { chatContext } from "@/contexts/chat-context";
import useCheckIsMobileView from "@/hooks/useCheckIsMobileView";
import usePhantomWallet from "@/hooks/usePhantomWallet";
import { useSocket } from "@/contexts/socket-context";

import {
  checkIsConnected,
  connectPhantomDeeplinking,
  connectToPhantom,
  DEFAULT_MESSAGES,
  getUploadIconType,
  isPhantomExist,
  commandlist as listcommands,
  messageType,
  renderRemoveUserText,
  USER_HANDERLS,
} from "@/dummy-data";

import { validateDisplayName } from "./chat-messages-utils";
import MessagesModals from "./message-box-components/messagesModals";
import MessageInput from "./message-box-components/message-input";
import MessageContainer from "./message-box-components/message-container";
import ChatJoiningLoader from "./chat-joining-loader";

import { getDeviceFingerprint } from "@/utils/device-fingerprint";
import { ApiRequest } from "@/utils/api-request";

import sendBtn from "@/assets/icons/chat/sendBtn.svg";
import sendBtnGrey from "@/assets/icons/chat/send_grey.svg";
import ChatVerifyingLoader from "./chat-verifying-loader";

export const messageContainerRef = createRef(null);

const MessageBox = ({
  isSessionExpired = false,
  isSessionLocked = false,
  sessionStatus = null,
}) => {
  const [input, setinput] = useState("");
  const [commandlist, setCommandsList] = useState(listcommands);
  const [selectedCommands, setSelectedCommands] = useState("");
  const [chatMessage, setChatMessages] = useState([]);
  const [handlerName, setHandlerName] = useState("");
  const [askHanderName, setAskHandlerName] = useState(false);
  const [askProjectMode, setAskprojectMode] = useState(false);
  const [askExitProjectMode, setAskExistProjectMode] = useState(false);
  const [askRemoveUser, setAskRemoveUser] = useState(false);
  const [askBeforClearChat, setAskBeforClearChat] = useState(false);
  const { isMobileView } = useCheckIsMobileView();
  const [removeUserName, setRemoveUserName] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isLandscape, setIsLandscape] = useState(false);
  const [isTimerCommand, setIsTimerCommand] = useState(false);
  const [spaceAdded, setSpaceAdded] = useState(false);
  const [showCommands, setShowCommands] = useState(false);
  const [isChatLock, setIsChatLock] = useState(false);
  const [isSafari, setIsSafari] = useState(false);
  const [KeyboardType, setKeyboardType] = useState("text");
  const [isRemoveCommand, setIsRemoveCommand] = useState(false);
  const [selectedColor, setSelectedColor] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);
  const [InputFieldDisabled, setInputFieldDisabled] = useState(false);
  const hasShownExpiryTimeMessageRef = useRef(false);
  const { PhantomSessionApproved, isLoading } = usePhantomWallet();
  const [userlist, setUserList] = useState([]);
  const [isJoining, setIsJoining] = useState(false);
  const [isSessionExpiredRealTime, setIsSessionExpiredRealTime] =
    useState(false);
  const [isSessionLockedRealTime, setIsSessionLockedRealTime] = useState(false);
  const [userHasJoinedSession, setUserHasJoinedSession] = useState(false);
  const [removeUserList, setRemoveUserList] = useState([]);

  const {
    setShowUploadModal,
    setFiledata,
    showAttachment,
    setIsProjectModeOn,
    setShowChatLeaveModal,
    setShowAttachment,
    sessionData,
    filedata,
    setExpiryTime,
    setIsVerifiedCode,
    isVerifiedCode,
    isProjectModeOn,
    setConnectWalletFunction,
    setIsWalletConnected,
    isWalletConnected,
    setIsWalletExist,
    isExpiryTimeExist,
    setIsExpiryTimeExist,
    expiryTime,
  } = chatContext();
  const fileInputRef = useRef(null);
  const commandModalRef = useRef();
  const socket = useSocket();

  const isLockedState = isSessionLocked || isSessionLockedRealTime;
  const isExpiredState = isSessionExpired || isSessionExpiredRealTime;
  const shouldBlockInput = isExpiredState;
  const shouldShowLockNotification = isLockedState && !isExpiredState;

  const getSessionLockedMessage = useCallback(() => {
    const inputType =
      sessionData?.type === SessionTypeEnum.SECURE && !isVerifiedCode
        ? "code"
        : "name";

    return `This chat session is currently locked. Please wait for it to become available, or try again later. Once this message disappears, you'll be able to enter your ${inputType} to join if you haven't already. Alternatively, contact the person who shared the chat link with you for assistance.`;
  }, [sessionData?.type, isVerifiedCode]);

  const checkSessionValidityForJoining = useCallback(async () => {
    if (!sessionData?.code) return;

    try {
      const response = await ApiRequest(
        `/validate-session/${sessionData.code}`,
        "GET"
      );

      if (!response.success) {
        const status = response.sessionStatus;

        if (status === "locked") {
          console.log("🔒 Session locked - blocking new user from joining");

          if (!isSessionLockedRealTime) {
            setIsSessionLockedRealTime(true);
            setInputFieldDisabled(true);

            setChatMessages((prevMessages) => [
              ...prevMessages,
              {
                type: messageType.MM_ERROR_MSG,
                message: getSessionLockedMessage(),
                tempId: "session-locked-message",
              },
            ]);
          }
        } else if (status === "expired") {
          setIsSessionExpiredRealTime(true);
          setIsSessionLockedRealTime(false);

          setChatMessages((prevMessages) => [
            ...prevMessages.filter(
              (msg) => msg.tempId !== "session-locked-message"
            ),
            {
              type: messageType.MM_ERROR_MSG,
              message:
                "This chat session has expired. Return to the homepage to generate a new chat session.",
            },
          ]);
        }

        setAskHandlerName(false);
        setinput("");
      } else {
        console.log("✅ Session available - enabling join functionality");

        if (isSessionLockedRealTime && !isSessionExpiredRealTime) {
          console.log("🔓 Session unlocked - re-enabling join functionality");

          setIsSessionLockedRealTime(false);
          setInputFieldDisabled(false);

          if (
            sessionData?.type === SessionTypeEnum.WALLET &&
            !userHasJoinedSession
          ) {
            setIsWalletConnected(false);
          }

          setChatMessages((prevMessages) => {
            const filteredMessages = prevMessages.filter(
              (msg) => msg.tempId !== "session-locked-message"
            );

            if (!handlerName && !askHanderName) {
              setAskHandlerName(true);
            }

            return filteredMessages;
          });
        }
      }
    } catch (error) {
      console.error("Session validation error (joining user):", error);
    }
  }, [
    sessionData?.code,
    sessionData?.type,
    isSessionLockedRealTime,
    isSessionExpiredRealTime,
    handlerName,
    askHanderName,
    isVerifiedCode,
    getSessionLockedMessage,
    userHasJoinedSession,
  ]);

  const checkSessionValidityForExistingUsers = useCallback(async () => {
    if (!sessionData?.code) return;

    try {
      const response = await ApiRequest(
        `/validate-session/${sessionData.code}`,
        "GET"
      );

      if (!response.success) {
        const status = response.sessionStatus;

        if (status === "locked") {
          console.log(
            "🔒 Session locked - existing user can continue chatting"
          );

          if (!isSessionLockedRealTime) {
            setIsSessionLockedRealTime(true);
          }
        } else if (status === "expired") {
          setIsSessionExpiredRealTime(true);
          setIsSessionLockedRealTime(false);

          setChatMessages((prevMessages) => [
            ...prevMessages.filter(
              (msg) =>
                msg.tempId !== "session-locked-info" &&
                msg.tempId !== "session-unlocked-info"
            ),
            {
              type: messageType.MM_ERROR_MSG,
              message:
                "This chat session has expired. Return to the homepage to generate a new chat session.",
            },
          ]);

          setAskHandlerName(false);
          setinput("");
        }
      } else {
        if (isSessionLockedRealTime && !isSessionExpiredRealTime) {
          console.log("🔓 Session unlocked - notifying existing user");

          setIsSessionLockedRealTime(false);

          setTimeout(() => {
            setChatMessages((prevMessages) =>
              prevMessages.filter(
                (msg) => msg.tempId !== "session-unlocked-info"
              )
            );
          }, 5000);
        }
      }
    } catch (error) {
      console.error("Session validation error (existing user):", error);
    }
  }, [sessionData?.code, isSessionLockedRealTime, isSessionExpiredRealTime]);

  const WalletChatUtils = useCallback(async () => {
    console.log("🔗 Wallet connected - validating session status");

    setIsWalletConnected(true);

    try {
      const response = await ApiRequest(
        `/validate-session/${sessionData.code}`,
        "GET"
      );

      if (!response.success) {
        const status = response.sessionStatus;

        if (status === "expired") {
          setIsSessionExpiredRealTime(true);
          setChatMessages((prevMessages) => [
            ...prevMessages,
            {
              type: messageType.MM_ERROR_MSG,
              message:
                "This chat session has expired. Return to the homepage to generate a new chat session.",
            },
          ]);
          return;
        } else if (status === "locked") {
          setIsSessionLockedRealTime(true);
          setInputFieldDisabled(true);
          setChatMessages((prevMessages) => [
            ...prevMessages,
            {
              type: messageType.MM_ERROR_MSG,
              message: getSessionLockedMessage(),
              tempId: "session-locked-message",
            },
          ]);
          return;
        } else if (status === "full") {
          setChatMessages((prevMessages) => [
            ...prevMessages,
            {
              type: messageType.MM_ERROR_MSG,
              message:
                "The chat session is full! There are currently 10/10 users joined.",
            },
          ]);
          return;
        }
      }

      console.log(
        "✅ Wallet connected and session valid - asking for handler name"
      );

      setChatMessages((prevMessages) => [
        ...prevMessages,
        {
          type: messageType.MESSAGE_MOMENT,
          handlerName: "",
        },
      ]);

      setAskHandlerName(true);
    } catch (error) {
      console.error("Wallet session validation error:", error);
      setChatMessages((prevMessages) => [
        ...prevMessages,
        {
          type: messageType.MM_ERROR_MSG,
          message: "Failed to validate session. Please try again.",
        },
      ]);
    }
  }, [sessionData?.code, getSessionLockedMessage]);

  const handlePhantomConnection = async () => {
    if (!isMobileView) {
      if (!isPhantomExist()) {
        return;
      }
      const publicKey = await connectToPhantom();
      if (publicKey) {
        WalletChatUtils();
      }
    } else {
      connectPhantomDeeplinking();
    }
  };

  const InitialChatLoad = () => {
    if (sessionData?.type === SessionTypeEnum.STANDARD) {
      setChatMessages([
        ...chatMessage,
        {
          type:
            sessionData?.type == SessionTypeEnum.STANDARD
              ? messageType.MESSAGE_MOMENT
              : messageType.SECURITY_CODE,
          handlerName: sessionData?.type == SessionTypeEnum.SECURE && " ",
        },
      ]);
    } else if (sessionData?.type === SessionTypeEnum.WALLET) {
      setChatMessages([
        ...chatMessage,
        {
          type: messageType.PHANTOM_WALLET,
          handlerName: messageType.MESSAGE_MOMENT,
        },
      ]);
    } else {
      setChatMessages([
        ...chatMessage,
        {
          type:
            sessionData?.type == SessionTypeEnum.STANDARD
              ? messageType.MESSAGE_MOMENT
              : messageType.SECURITY_CODE,
          handlerName: sessionData?.type == SessionTypeEnum.SECURE && " ",
        },
      ]);
    }

    if (sessionData?.type == SessionTypeEnum.STANDARD) {
      setAskHandlerName(true);
    }
  };

  const scrollToBottom = useCallback(() => {
    if (messageContainerRef.current) {
      const container = messageContainerRef.current;
      const isSafari = /^((?!chrome|android).)*safari/i.test(
        navigator.userAgent
      );
      const isFirefox = /Firefox/.test(navigator.userAgent);
      const isMac = /Mac|macOS/.test(
        navigator.platform || navigator.userAgentData?.platform || ""
      );

      if (
        isSafari ||
        (isMac && (isFirefox || /Chrome/.test(navigator.userAgent)))
      ) {
        container.scrollTop = container.scrollHeight;

        requestAnimationFrame(() => {
          container.scrollTop = container.scrollHeight;
        });
      } else {
        setTimeout(() => {
          container.scrollTo({
            top: container.scrollHeight,
            behavior: "smooth",
          });
        }, 20);
      }
    }
  }, []);

  const openFilePopup = () => {
    fileInputRef.current.click();
    if (showAttachment) {
      setShowAttachment(false);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setinput("");
      setShowUploadModal(true);
      const fileName = file.name;
      const fileSizeInMB = (file.size / (1024 * 1024)).toFixed(2); // Size in MB
      setFiledata({
        name: fileName,
        size: fileSizeInMB,
        type: fileName.split(".").pop().toLowerCase(),
      });
    }
    event.target.value = "";
  };

  const handleSelectedCommand = (text) => {
    if (text === "/transfer (future)") {
      return;
    }

    setSelectedCommands(text);
    setinput(text);

    if (text == "/timer") {
      setinput("/timer ");
      setSpaceAdded(true);
      setShowCommands(false);
    } else if (isProjectModeOn && text == "/mm") {
      setinput("/mm ");
      setSpaceAdded(true);
      setShowCommands(false);
    } else if (text == "/remove") {
      setinput("/remove ");
      setSpaceAdded(true);
      setShowCommands(false);
      setTimeout(() => {
        setIsRemoveCommand(true);
      }, 200);
    } else {
      setShowCommands(false);
    }
  };

  const handleSelectedUser = (item) => {
    setinput(`/remove ` + item);
    setShowCommands(false);
  };

  const verifyInputCommand = (value) => {
    if (isRemoveCommand) {
      let val = value.split(" ")[1];
      const val2 = value.split(" ")[2];
      if (value.split(" ").length > 2 || val === "") {
        setShowCommands(false);
        return;
      }

      const isExist = removeUserList.some((user) =>
        user.name
          .replace(/\[|\]/g, "")
          .toLowerCase()
          .startsWith(val ? val.toLowerCase() : undefined)
      );
      if (isExist) {
        setShowCommands(true);
      } else {
        setShowCommands(false);
      }
    } else {
      const isExist = commandlist.some((command) => command.startsWith(value));
      if (isExist) {
        setShowCommands(true);
      } else {
        setShowCommands(false);
      }
    }
  };

  const handleInputChange = (e) => {
    if (isSessionExpiredRealTime || isJoining) {
      console.log("🚫 Input blocked - session expired or joining in progress");
      return;
    }

    if (isSessionLockedRealTime && !userHasJoinedSession) {
      console.log("🚫 Input blocked - session locked for joining user");
      return;
    }

    if (
      InputFieldDisabled &&
      !(isSessionLockedRealTime && userHasJoinedSession)
    ) {
      console.log("🚫 Input blocked - field disabled");
      return;
    }

    let value = e.target.value;

    if (
      askProjectMode ||
      askExitProjectMode ||
      askRemoveUser ||
      askBeforClearChat
    ) {
      const ynOnlyRegex = /^[ynYN]?$/;

      if (ynOnlyRegex.test(value)) {
        setIsDisabled(false);
        setinput(value.toLowerCase());
      } else {
        setIsDisabled(true);
        return;
      }
      return;
    }

    if (value !== "") {
      if (value.startsWith("/")) {
        if (handlerName.trim() !== "") {
          setinput(value);
          setSelectedCommands("");
          setIsTimerCommand(false);
        }
      } else {
        setinput(value);
        setSelectedCommands("");
        setIsTimerCommand(false);
      }
      if (sessionData?.type === SessionTypeEnum.SECURE && !isVerifiedCode) {
        const numberOnlyRegex = /^(?!.*[.eE])[0-9]{4}$/;

        if (numberOnlyRegex.test(value.slice(0, 4))) {
          setIsDisabled(false);
          setinput(value.slice(0, 4));
        } else {
          setIsDisabled(true);
          setinput(value.slice(0, 4));
        }
      }

      if (askHanderName && value.trim() !== "" && value.slice(0, 15)) {
        const isValidate = validateDisplayName(value.slice(0, 15));
        if (isValidate == "All Good!") {
          setIsDisabled(false);
          setinput(value.slice(0, 15));
        } else {
          setIsDisabled(true);
          setinput(value.slice(0, 15));
        }
      }

      if (value.startsWith("/") && handlerName.trim() !== "") {
        verifyInputCommand(value);
        if (value.startsWith("/timer")) {
          setIsTimerCommand(true);

          if (value === "/timer" && !spaceAdded) {
            setinput("/timer ");
            setSpaceAdded(true);
            setShowCommands(false);
            return;
          }

          if (value === "/timer" && spaceAdded) {
            setinput(value);
            setSpaceAdded(false);
          }
        }

        if (value.startsWith("/remove")) {
          setIsTimerCommand(true);

          if (value === "/remove" && !spaceAdded) {
            setinput("/remove ");
            setTimeout(() => {
              setIsRemoveCommand(true);
            }, 200);
            setSpaceAdded(true);
            setShowCommands(false);
            return;
          } else if (value.startsWith("/remove ")) {
            setTimeout(() => {
              setIsRemoveCommand(true);
            }, 200);
            setSpaceAdded(true);
          }

          if (value === "/remove" && spaceAdded) {
            setinput(value);
            setSpaceAdded(false);
            setTimeout(() => {
              setIsRemoveCommand(false);
            }, 200);
          }
        }

        if (isProjectModeOn && value.startsWith("/mm")) {
          setShowCommands(false);
          if (value === "/mm" && !spaceAdded) {
            setinput("/mm ");
            setSpaceAdded(true);
            setShowCommands(false);
            return;
          }

          if (value === "/mm" && spaceAdded) {
            setinput(value);
            setSpaceAdded(false);
          }
        }
      }
    } else {
      setTimeout(() => {
        setIsRemoveCommand(false);
      }, 200);
      setSelectedCommands("");
      setinput("");
      setSpaceAdded(false);
      if (showCommands) setShowCommands(false);
    }
  };

  const handleClickSendBtn = () => {
    if (isSessionExpiredRealTime || isJoining) {
      console.log("🚫 Send blocked - session expired");
      return;
    }

    if (isSessionLockedRealTime && !userHasJoinedSession) {
      console.log("🚫 Send blocked - session locked for joining user");
      return;
    }

    if (verifySecurityCode()) {
      if (input.trim() !== "" && !input.startsWith("/")) {
        setSelectedCommands("");

        if (showAttachment) {
          checkIsFileAttachment();
        } else {
          socket.emit("sendMessage", {
            sessionId: sessionData.code,
            username: handlerName,
            message: input.trim(),
          });
          setinput("");
          requestAnimationFrame(() => scrollToBottom());
        }
      } else {
        setSelectedCommands("");
        setSpaceAdded(false);
        //
        if (input.startsWith("/")) {
          // timer command handler
          if (!isProjectModeOn && input.includes("/timer")) {
            handleTimerCommand(input);
            // } else if (input == "/transfer (future)") {
            //   setShowCommands(false);
            //   openFilePopup();
          } else if (!isProjectModeOn && input == "/project on") {
            setAskprojectMode(true);
            handleProjectAskMode();
            // handleProjectOnCommand();
          } else if (isProjectModeOn && input == "/project off") {
            setAskExistProjectMode(true);
            AskExistProjectModeQuestion();
          } else if (input == "/leave") {
            handleChatLeaveCommand();
          } else if (isProjectModeOn && input.includes("/mm")) {
            handleAIResearchCompanionCommand();
          } else if (!isChatLock && input == "/lock") {
            handleLockChatCommand();
          } else if (isChatLock && input == "/unlock") {
            handleUnLockChatCommand();
          } else if (isProjectModeOn && input == "/download") {
            setShowCommands(false);
            downloadChat();
          } else if (input.includes("/remove")) {
            handleAskRemoveUserQuestion();
          } else if (isProjectModeOn && input == "/clear") {
            setAskBeforClearChat(true);
            AskBeforeChatMsgClear();
          }
        } else {
          checkIsFileAttachment();
        }
      }
    }
  };

  const handleKeyDown = (event) => {
    if (shouldBlockInput) return;

    if (sessionData?.type === SessionTypeEnum.SECURE && !isVerifiedCode) {
      if (
        event.keyCode === 69 ||
        event.keyCode === 189 ||
        event.keyCode === 187 ||
        event.keyCode === 190
      ) {
        event.preventDefault();
      }
    }

    if (event.key !== "Enter") {
      handleKeyUpAndDown(event);
      return;
    } else if (event.key === "Enter" && selectedIndex >= 0) {
      handleKeyUpAndDown(event);
      return;
    } else if (event.key === "Enter" && input.trim() !== "") {
      if (verifySecurityCode()) {
        if (input.trim() !== "" && !input.startsWith("/")) {
          handleClickSendBtn();
          requestAnimationFrame(() => scrollToBottom());
        } else {
          if (input.startsWith("/")) {
            // timer command handleer
            if (!isProjectModeOn && input.includes("/timer")) {
              handleTimerCommand(input);
              setSpaceAdded(false);
              // } else if (input == "/transfer (future)") {
              //   openFilePopup();
              //   setShowCommands(false);
            } else if (!isProjectModeOn && input == "/project on") {
              setAskprojectMode(true);
              handleProjectAskMode();
            } else if (isProjectModeOn && input == "/project off") {
              setAskExistProjectMode(true);
              AskExistProjectModeQuestion();
            } else if (input == "/leave") {
              handleChatLeaveCommand();
            } else if (isProjectModeOn && input.includes("/mm")) {
              handleAIResearchCompanionCommand();
            } else if (!isChatLock && input == "/lock") {
              handleLockChatCommand();
            } else if (isChatLock && input == "/unlock") {
              handleUnLockChatCommand();
            } else if (isProjectModeOn && input == "/download") {
              setShowCommands(false);
              downloadChat();
            } else if (input.includes("/remove")) {
              handleAskRemoveUserQuestion();
            } else if (isProjectModeOn && input == "/clear") {
              setAskBeforClearChat(true);
              AskBeforeChatMsgClear();
            }
            // end...
          } else {
            checkIsFileAttachment();
          }
        }
      }
    }
  };

  const handleKeyUpAndDown = (e) => {
    if (!showCommands) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prevIndex) =>
        Math.min(
          prevIndex + 1,
          (isRemoveCommand ? removeUserList : commandlist).length - 1
        )
      );
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prevIndex) => Math.max(prevIndex - 1, 0));
    }

    if (e.key === "Enter" && selectedIndex >= 0) {
      e.preventDefault();
      const selectedItem = isRemoveCommand
        ? removeUserList[selectedIndex]
        : commandlist[selectedIndex];

      if (isRemoveCommand) {
        handleSelectedUser(selectedItem?.name.replace(/\[|\]/g, ""));
        setSelectedColor(selectedItem?.color);
        setSelectedIndex(-1);
        setShowCommands(false);
      } else {
        if (selectedItem === "/transfer (future)") {
          return;
        }

        handleSelectedCommand(selectedItem);
        setSelectedIndex(-1);
        setShowCommands(false);
      }
    }

    // Auto-complete with Tab
    if (e.key === "Tab") {
      e.preventDefault();
      const inputValue = e.target.value.trim();

      if (isRemoveCommand) {
        const userInput = inputValue.split(" ")[1].toLowerCase();
        const matchingUser = removeUserList.find((item) =>
          item?.name
            .toLowerCase()
            .replace(/\[|\]/g, "")
            .startsWith(userInput.toLowerCase())
        );
        if (matchingUser) {
          handleSelectedUser(matchingUser?.name.replace(/\[|\]/g, ""));
          setSelectedColor(matchingUser?.color);
          setSelectedIndex(-1);
        }
      } else {
        const matchingCommand = commandlist.find((item) =>
          item?.startsWith(inputValue)
        );
        if (matchingCommand) {
          if (matchingCommand === "/transfer (future)") {
            return;
          }

          handleSelectedCommand(matchingCommand);
          setSelectedIndex(-1);
          setShowCommands(false);
        }
      }
    }
  };

  const verifySecurityCode = () => {
    if (shouldBlockInput) return false;

    if (sessionData?.type === SessionTypeEnum.SECURE && !isVerifiedCode) {
      const numberOnlyRegex = /^(?!.*[.eE])[0-9]{4}$/;

      if (!numberOnlyRegex.test(input)) return false;

      if (input === sessionData?.secureCode) {
        setChatMessages([
          ...chatMessage,
          {
            type: messageType.MM_NOTIFICATION,
            message: <ChatVerifyingLoader />,
            handlerName: "[MessageMoment.com]",
            handlerColor: "#494AF8",
            tempId: "verifying-loader",
          },
        ]);

        setinput("");
        scrollToBottom();

        setTimeout(async () => {
          try {
            const response = await ApiRequest(
              `/validate-session/${sessionData.code}`,
              "GET"
            );

            setChatMessages((prevMessages) => {
              const filteredMessages = prevMessages.filter(
                (msg) => msg.tempId !== "verifying-loader"
              );

              if (!response.success) {
                const status = response.sessionStatus;

                if (status === "expired") {
                  setIsSessionExpiredRealTime(true);
                  return [
                    ...filteredMessages,
                    {
                      type: messageType.MM_ERROR_MSG,
                      message:
                        "This chat session has expired. Return to the homepage to generate a new chat session.",
                    },
                  ];
                } else if (status === "locked") {
                  setIsSessionLockedRealTime(true);
                  setInputFieldDisabled(true);
                  return [
                    ...filteredMessages,
                    {
                      type: messageType.MM_ERROR_MSG,
                      message:
                        "This chat session is currently locked. Please wait for it to become available, or try again later. Once this message disappears, you’ll be able to enter your code to join if you haven’t already. Alternatively, contact the person who shared the chat link with you for assistance.",
                      tempId: "session-locked-message",
                    },
                  ];
                } else if (status === "full") {
                  return [
                    ...filteredMessages,
                    {
                      type: messageType.MM_ERROR_MSG,
                      message:
                        "The chat session is full! There are currently 10/10 users joined.",
                    },
                  ];
                }
              }

              setIsVerifiedCode(true);
              setAskHandlerName(true);

              return [
                ...filteredMessages,
                {
                  type: messageType.MM_NOTIFICATION,
                  message: "Verified",
                  handlerName: "[MessageMoment.com]",
                  handlerColor: "#494AF8",
                },
                {
                  type: messageType.MESSAGE_MOMENT,
                  handler: messageType.MESSAGE_MOMENT,
                },
              ];
            });
          } catch (error) {
            console.error("Security code verification error:", error);

            setChatMessages((prevMessages) => [
              ...prevMessages.filter(
                (msg) => msg.tempId !== "verifying-loader"
              ),
              {
                type: messageType.MM_ERROR_MSG,
                message: "Verification failed. Please try again.",
              },
            ]);
          }
        }, 2000);

        return false;
      } else {
        setIsVerifiedCode(false);
        setChatMessages([
          ...chatMessage,
          {
            type: messageType.MM_ERROR_MSG,
            message:
              "The Security Code you entered is incorrect! Please try again.",
          },
        ]);
        setinput("");
        scrollToBottom();
        return false;
      }
    } else {
      if (askHanderName) {
        if (input.trim() !== "") handleUserName();
      } else if (askProjectMode) {
        handleProjectModeQuestion();
      } else if (askExitProjectMode) {
        handleProjectModeExistQuestion();
      } else if (askRemoveUser) {
        handleRemoveUserCommand();
      } else if (askBeforClearChat) {
        handleClearChatConfirmation();
      } else {
        return true;
      }
    }
  };

  const handleAskRemoveUserQuestion = () => {
    const username = input.split(" ")[1];
    if (!username) return;

    const hasFindUser = removeUserList.find(
      (item) =>
        item.name.replace(/\[|\]/g, "").toLowerCase() == username.toLowerCase()
    );

    if (username !== "" && hasFindUser) {
      setAskRemoveUser(true);
      setChatMessages([
        ...chatMessage,
        {
          type: messageType.MM_NOTIFICATION_REMOVE_USER,
          handlerName: "[MessageMoment.com]",
          handlerColor: "#494AF8",
          message: hasFindUser.name,
          userNameColor: hasFindUser?.color,
        },
      ]);
      setSelectedColor(hasFindUser.color);
      setRemoveUserName(hasFindUser.name);
      setShowCommands(false);
      setinput("");
      scrollToBottom();
    }
  };

  const AskExistProjectModeQuestion = () => {
    setChatMessages([
      ...chatMessage,
      {
        type: messageType.MM_NOTIFICATION,
        handlerName: "[MessageMoment.com]",
        handlerColor: "#494AF8",
        message:
          "You are about to exit Project Mode. Are you sure you want to proceed? Type 'y' for Yes, 'n' for No",
      },
    ]);
    setShowCommands(false);
    setinput("");
    scrollToBottom();
  };

  const AskBeforeChatMsgClear = () => {
    setChatMessages([
      ...chatMessage,
      {
        type: messageType.MM_NOTIFICATION,
        handlerName: "[MessageMoment.com]",
        handlerColor: "#494AF8",
        message:
          "You are about to permanently clear the chat history whilst in Project Mode. Are you sure you want to proceed? Type 'y' for Yes, 'n' for No.",
      },
    ]);
    setShowCommands(false);
    setinput("");
    scrollToBottom();
  };

  const handleProjectAskMode = () => {
    setChatMessages([
      ...chatMessage,
      {
        type: messageType.PROJECT_MODE,
      },
    ]);
    setShowCommands(false);
    setinput("");
    scrollToBottom();
  };

  const handleProjectModeExistQuestion = () => {
    if (input.toLowerCase() == "y") {
      handleProjectModeOfff();
    } else if (input.toLowerCase() == "n") {
      setAskExistProjectMode(false);
      setinput("");
    }
  };

  const handleProjectModeQuestion = () => {
    if (input.toLowerCase() == "y") {
      handleProjectOnCommand();
    } else if (input.toLowerCase() == "n") {
      setAskprojectMode(false);
      setinput("");
    }
  };

  const handleUserName = () => {
    if (isSessionExpiredRealTime) return;

    const username = input.trim();
    const isValidate = validateDisplayName(username);

    if (isValidate !== "All Good!") return;

    if (input.trim() != "" && input.length >= 15) {
      setHandlerName(`[${input.trim().slice(0, 15)}]`);
    } else {
      setHandlerName(`[${input.trim()}]`);
    }

    setAskHandlerName(false);
    setinput("");
    scrollToBottom();
  };

  const handleRemoveUserCommand = () => {
    if (input.trim() != "" && removeUserName !== "") {
      if (input.toLowerCase() == "y") {
        handleRemoveUser();
        setAskRemoveUser(false);
      } else if (input.toLowerCase() == "n") {
        setinput("");
        setAskRemoveUser(false);
      }
    }
  };

  const handleClearChatConfirmation = () => {
    if (input.trim() != "") {
      if (input.toLowerCase() == "y") {
        handleClearCommand();
        setAskBeforClearChat(false);
      } else if (input.toLowerCase() == "n") {
        setinput("");
        setAskBeforClearChat(false);
      }
    }
  };

  const handleRemoveUser = () => {
    const targetUsername = removeUserName;

    socket.emit("removeUser", {
      sessionId: sessionData.code,
      username: handlerName,
      targetUsername: targetUsername,
    });

    setinput("");
    setAskRemoveUser(false);
    setShowCommands(false);
    scrollToBottom();
  };

  const handleLockChatCommand = () => {
    socket.emit("lockSession", {
      sessionId: sessionData.code,
      username: handlerName,
      isLocking: true,
    });

    setinput("");
    setShowCommands(false);
  };

  const handleUnLockChatCommand = () => {
    socket.emit("lockSession", {
      sessionId: sessionData.code,
      username: handlerName,
      isLocking: false,
    });

    setinput("");
    setShowCommands(false);
  };

  const handleClearCommand = () => {
    socket.emit("clearMessages", {
      sessionId: sessionData.code,
      username: handlerName,
    });

    setinput("");
    setShowCommands(false);
  };

  const handleAIResearchCompanionCommand = () => {
    const msg = input.replace("/mm", "").trim();
    if (msg === "") {
      return;
    }

    console.log("🤖 Sending AI message:", {
      sessionId: sessionData.code,
      username: handlerName,
      message: msg,
    });

    socket.emit("aiResearchCompanionMessage", {
      sessionId: sessionData.code,
      username: handlerName,
      message: msg,
    });

    setinput("");
    setShowCommands(false);
  };

  const handleTimerCommand = (value) => {
    const timer = value.replace("/timer", "").trim();

    if (timer && !isExpiryTimeExist) {
      if (timer >= 3 && timer <= 300) {
        socket.emit("timer", {
          sessionId: sessionData.code,
          username: handlerName,
          seconds: parseInt(timer),
        });

        setinput("");
        setShowCommands(false);
      } else {
        setinput("");
        setChatMessages([
          ...chatMessage,
          {
            type: messageType.MM_ALERT,
            message: "Message Expiry Time must be a value between 3 and 300.",
          },
        ]);
        setShowCommands(false);
        scrollToBottom();
      }
    } else {
      setinput("");
      if (isExpiryTimeExist) {
        setChatMessages([
          ...chatMessage,
          {
            type: messageType.MM_ALERT,
            message:
              "The Message Expiration Time has already been set for this chat session.",
          },
        ]);
      } else {
        setChatMessages([
          ...chatMessage,
          {
            type: messageType.MM_ALERT,
            message: "Message Expiry Time must be a value between 3 and 300.",
          },
        ]);
      }
      setShowCommands(false);
      scrollToBottom();
    }
  };

  const checkIsFileAttachment = () => {
    if (showAttachment) {
      setChatMessages([
        ...chatMessage,
        {
          type: messageType.ATTACHMENT_MESSAGE,
          message: input,
          handlerName: handlerName,
          attachmentFile: {
            name: filedata?.name,
            size: filedata?.size,
            img: getUploadIconType(filedata?.type),
          },
        },
      ]);
      setShowAttachment(false);
      setinput("");
      scrollToBottom();
    }
  };

  const handleChatLeaveCommand = () => {
    setShowChatLeaveModal(true);
    setinput("");
    setShowCommands(false);
  };

  const handleProjectOnCommand = () => {
    socket.emit("toggleProjectMode", {
      sessionId: sessionData.code,
      username: handlerName,
      command: "on",
    });

    setinput("");
    setShowCommands(false);
    setAskprojectMode(false);
  };

  const handleProjectModeOfff = () => {
    socket.emit("toggleProjectMode", {
      sessionId: sessionData.code,
      username: handlerName,
      command: "off",
    });

    setAskExistProjectMode(false);
    setinput("");
    setShowCommands(false);
  };

  const downloadChat = () => {
    const UpdateChatMessage = [
      {
        type: messageType.GREETING,
      },
      {
        type: messageType.ADVERTISEMENT,
        handlerName: `[${messageType.ADVERTISEMENT}]`,
        message:
          "Big Sale on at Flight Centre! Don’t miss out. Visit www.flightcentre.com now and book your trip!",
      },
      ...chatMessage,
    ];

    const chatText = UpdateChatMessage.map((chat) => {
      const handlerName = chat.handlerName || "[MessageMoment.com]";

      const message =
        chat.type == messageType.MM_NOTIFICATION_REMOVE_USER
          ? renderRemoveUserText(chat.message)
          : chat.message || DEFAULT_MESSAGES[chat.type] || "";

      return `${handlerName} ${message}`;
    }).join("\n");

    setinput("");

    const now = new Date();
    const date = now.toISOString().split("T")[0];

    const timeParts = now.toTimeString().split(" ")[0].split(":");
    const time = `${timeParts[0]}-${timeParts[1]}`;

    const filename = `chat_history_${date}__${time}.txt`;

    const blob = new Blob([chatText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const safeGetFingerprint = () => {
    try {
      return getDeviceFingerprint();
    } catch (error) {
      console.error("Failed to get fingerprint:", error);
      return "session_" + Math.random().toString(36).substring(2, 15);
    }
  };

  useEffect(() => {
    if (!sessionData?.code || isSessionExpiredRealTime) {
      console.log(
        "🚫 Skipping validation - no session code or session expired"
      );
      return;
    }

    if (isSessionLockedRealTime && userHasJoinedSession) {
      console.log(
        "🔒 Session locked - stopping validation checks for existing user"
      );
      return;
    }

    const validationFunction = userHasJoinedSession
      ? checkSessionValidityForExistingUsers
      : checkSessionValidityForJoining;

    console.log(
      `🔍 Using ${
        userHasJoinedSession ? "existing user" : "joining user"
      } validation`
    );

    validationFunction();

    const interval = setInterval(validationFunction, 30000);

    return () => {
      console.log("🧹 Clearing validation interval");
      clearInterval(interval);
    };
  }, [
    sessionData?.code,
    sessionData?.type,
    checkSessionValidityForJoining,
    checkSessionValidityForExistingUsers,
    isSessionExpiredRealTime,
    isSessionLockedRealTime,
    userHasJoinedSession,
    isVerifiedCode,
  ]);

  useEffect(() => {
    if (isSessionExpiredRealTime) {
      console.log(
        "🚨 Session expired - blocking all user input and resetting states"
      );

      setShowCommands(false);
      setSelectedCommands("");
      setSpaceAdded(false);
      setAskHandlerName(false);
      setinput("");
      setUserHasJoinedSession(false);
      setIsSessionLockedRealTime(false);
      setInputFieldDisabled(true);

      return;
    }

    if (isSessionLockedRealTime) {
      if (userHasJoinedSession) {
        console.log("🔒 Session locked - existing user can continue chatting");
      } else {
        console.log("🔒 Session locked - blocking new user from joining");
        setInputFieldDisabled(true);
        setAskHandlerName(false);
      }
    } else {
      if (!isSessionExpiredRealTime) {
        console.log("🔓 Session unlocked - enabling functionality");

        if (!userHasJoinedSession) {
          setInputFieldDisabled(false);

          if (!handlerName && sessionData?.type !== SessionTypeEnum.WALLET) {
            setAskHandlerName(true);
          }
        }
      }
    }
  }, [
    isSessionExpiredRealTime,
    isSessionLockedRealTime,
    userHasJoinedSession,
    handlerName,
    sessionData?.type,
  ]);

  useEffect(() => {
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    if (!isSafari) return;
    if (!isMobile) return;
    if (!isMobileView) return;

    setIsSafari(isSafari);
    const preventScroll = (e) => {
      const activeElement = document.activeElement;
      if (
        activeElement.tagName === "INPUT" ||
        activeElement.tagName === "TEXTAREA"
      ) {
        e.preventDefault();
        activeElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    };
    let lastViewportHeight =
      window.visualViewport?.height || window.innerHeight;
    const handleViewportResize = () => {
      const currentHeight = window.visualViewport?.height || window.innerHeight;
      if (currentHeight > lastViewportHeight + 50) {
        const activeElement = document.activeElement;
        if (
          activeElement &&
          (activeElement.tagName === "INPUT" ||
            activeElement.tagName === "TEXTAREA")
        ) {
          activeElement.blur();
        }
      }
      lastViewportHeight = currentHeight;
    };
    window.visualViewport?.addEventListener("resize", handleViewportResize);
    window.addEventListener("touchmove", preventScroll, { passive: false });
    return () => {
      window.removeEventListener("touchmove", preventScroll);
      window.visualViewport?.removeEventListener(
        "resize",
        handleViewportResize
      );
    };
  }, [isMobileView]);

  useEffect(() => {
    if (!isPhantomExist() && !isMobileView) {
      setIsWalletExist(false);
    } else {
      setIsWalletExist(true);
    }
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    if (!isSafari) return;
    if (!isMobileView) return;

    const toggleBodyScroll = (e) =>
      (document.body.style.overflow = e.type === "focusin" ? "hidden" : "");
    window.addEventListener("focusin", toggleBodyScroll);
    window.addEventListener("focusout", toggleBodyScroll);
    return () => {
      window.removeEventListener("focusin", toggleBodyScroll);
      window.removeEventListener("focusout", toggleBodyScroll);
    };
  }, [isMobileView]);

  useEffect(() => {
    if (sessionData.type == SessionTypeEnum.WALLET) {
      if (isWalletConnected) {
        setInputFieldDisabled(false);
      } else {
        setInputFieldDisabled(true);
      }
    }
  }, [isWalletConnected]);

  useEffect(() => {
    if (PhantomSessionApproved) {
      WalletChatUtils();
    }
  }, [PhantomSessionApproved]);

  useEffect(() => {
    setConnectWalletFunction(() => handlePhantomConnection);
  }, [setConnectWalletFunction, isMobileView]);

  useEffect(() => {
    if (input == "") {
      setSpaceAdded(false);
      setTimeout(() => {
        setIsRemoveCommand(false);
      }, 200);
      setSelectedIndex(-1);
    }
  }, [input]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const isTransferCommand =
        event.target.closest("li")?.textContent?.trim() ===
        "/transfer (future)";

      if (isTransferCommand) {
        return;
      }

      if (
        commandModalRef.current &&
        !commandModalRef.current.contains(event.target)
      ) {
        setShowCommands(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    checkIsConnected();

    if (!isLoading && !PhantomSessionApproved) {
      InitialChatLoad();
    }
  }, [isLoading, PhantomSessionApproved]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(orientation: portrait)");
    setIsLandscape(!mediaQuery.matches);
    const handleChange = (event) => {
      setIsLandscape(!event.matches);
    };
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    if (sessionData?.type == SessionTypeEnum.SECURE && !isVerifiedCode) {
      setKeyboardType("number");
    } else {
      setKeyboardType("text");
    }
  }, [sessionData, isVerifiedCode]);

  useEffect(() => {
    scrollToBottom();
  }, [chatMessage]);

  useEffect(() => {
    const isMac = /Mac|macOS/.test(
      navigator.platform || navigator.userAgentData?.platform || ""
    );
    const isChrome =
      /Chrome/.test(navigator.userAgent) && !/Edge/.test(navigator.userAgent);

    if (isMac && isChrome) {
      const handleVisibilityChange = () => {
        if (!document.hidden) {
          setTimeout(() => {
            scrollToBottom();
          }, 100);
        }
      };

      document.addEventListener("visibilitychange", handleVisibilityChange);

      return () => {
        document.removeEventListener(
          "visibilitychange",
          handleVisibilityChange
        );
      };
    }
  }, [scrollToBottom]);

  useEffect(() => {
    if (!handlerName || !userlist.length) {
      setRemoveUserList([]);
      return;
    }

    const filteredRemoveList = userlist.filter((user) => {
      const currentUserName = handlerName.replace(/[\[\]]/g, "").toLowerCase();
      const listUserName = user.name.replace(/[\[\]]/g, "").toLowerCase();
      return currentUserName !== listUserName;
    });

    setRemoveUserList(filteredRemoveList);

    console.log("🎯 Remove user list updated:", {
      totalUsers: userlist.length,
      availableToRemove: filteredRemoveList.length,
      currentUser: handlerName,
      excludedFromRemoval: true,
    });
  }, [userlist, handlerName]);

  // SOCKET INTEGRATION -- START

  useEffect(() => {
    if (!socket || !handlerName) return;

    console.log("🔍 Attempting to join room with:", {
      sessionId: sessionData.code,
      username: handlerName,
    });

    setIsJoining(true);
    const fingerprint = safeGetFingerprint();

    setChatMessages((prevMessages) => [
      ...prevMessages,
      {
        type: messageType.MM_NOTIFICATION,
        message: <ChatJoiningLoader />,
        handlerName: "[MessageMoment.com]",
        handlerColor: "#494AF8",
        tempId: "joining-loader",
      },
    ]);

    socket.emit("joinRoom", {
      sessionId: sessionData.code,
      username: handlerName,
      sessionSecurityCode: sessionData.secureCode || "",
      fingerprint: fingerprint,
    });

    // =======================
    // SUCCESS EVENT HANDLERS
    // =======================

    const handleJoinedRoom = (data) => {
      console.log("✅ Successfully joined room:", data);

      setIsJoining(false);
      setUserHasJoinedSession(true);

      console.log(
        "🎯 User marked as joined - switching to existing user validation"
      );

      setChatMessages((prevMessages) => {
        const filteredMessages = prevMessages.map((msg) => {
          if (msg.tempId === "joining-loader") {
            return {
              type: messageType.MM_NOTIFICATION,
              message: "Joined",
              handlerName: handlerName,
              handlerColor:
                USER_HANDERLS[data.assignedColor] || USER_HANDERLS[0],
            };
          }
          return msg;
        });

        const sessionTimer = data.session?.sessionTimer || 30;
        setExpiryTime(sessionTimer);

        const wasTimerSetBySomeone =
          data.session?.isExpirationTimeSet || sessionTimer !== 30;
        setIsExpiryTimeExist(wasTimerSetBySomeone);
        hasShownExpiryTimeMessageRef.current = wasTimerSetBySomeone;

        if (data.session?.isProjectModeOn) {
          console.log(
            "🚀 Project mode is active - showing entry instructions to new user"
          );
          setIsProjectModeOn(true);

          filteredMessages.push({
            type: messageType.PROJECT_MODE_ENTRY,
          });

          return filteredMessages;
        }

        if (!wasTimerSetBySomeone && !hasShownExpiryTimeMessageRef.current) {
          filteredMessages.push({
            type: messageType.ASK_TO_SET_EXPIRYTIME,
          });
          hasShownExpiryTimeMessageRef.current = true;
        }

        return filteredMessages;
      });

      setCommandsList((prevList) => {
        let newList = [...prevList];

        if (data.session?.sessionLocked) {
          setIsChatLock(true);
          newList = newList.filter((item) => item !== "/lock");
          if (
            data.session.sessionLockedBy &&
            handlerName === data.session.sessionLockedBy
          ) {
            if (!newList.includes("/unlock")) {
              newList.push("/unlock");
            }
          }
        } else {
          setIsChatLock(false);
          newList = newList.filter((item) => item !== "/unlock");
          if (!newList.includes("/lock")) {
            newList.push("/lock");
          }
        }
        return newList;
      });
    };

    const handleHistoricalMessages = (data) => {
      console.log("📚 Received historical messages:", data);

      if (!data?.messages || data.messages.length === 0) {
        console.log("📚 No historical messages to display");
        return;
      }

      let filteredMessages = data.messages;
      if (!data.isProjectModeOn) {
        filteredMessages = data.messages.filter((msg) => {
          return !msg.isPermanent || msg.isSystem;
        });
      }

      // CHANGE: Use filteredMessages instead of data.messages
      const historicalMessages = filteredMessages.map((msg) => {
        const userColor =
          msg.assignedColor !== undefined
            ? USER_HANDERLS[msg.assignedColor]
            : USER_HANDERLS[0];

        let messageExpiresAt = msg.expiresAt;
        if (!messageExpiresAt && !msg.isPermanent && !data.isProjectModeOn) {
          const timerForMessage = msg.timerValue || data.timerSeconds || 30;
          messageExpiresAt = msg.timestamp + timerForMessage * 1000;
        }

        return {
          type: msg.isAI
            ? messageType.AI_RESEARCH_COMPANION_RESPONSE
            : msg.isSystem
            ? messageType.MM_NOTIFICATION
            : messageType.DEFAULT,
          message: msg.message,
          handlerName: msg.sender,
          handlerColor: userColor,
          timestamp: msg.timestamp,
          messageId: `historical-${msg.timestamp}-${msg.sender}`,
          expiresAt: messageExpiresAt,
          isPermanent: msg.isPermanent || data.isProjectModeOn,
          timerValue: msg.timerValue || data.timerSeconds || 30,
        };
      });

      console.log(`📚 Adding ${historicalMessages.length} historical messages`);

      setChatMessages((prevMessages) => {
        const fixedMessages = prevMessages.slice(0, 2);

        if (data.isProjectModeOn) {
          const systemMessages = prevMessages
            .slice(2)
            .filter(
              (msg) =>
                msg.type === messageType.MM_ALERT ||
                msg.type === messageType.PROJECT_MODE_ENTRY ||
                (msg.type === messageType.MM_NOTIFICATION &&
                  msg.handlerName === "[MessageMoment.com]" &&
                  !msg.message.includes("Joined"))
            );

          const joinedMessage = prevMessages
            .slice(2)
            .find(
              (msg) =>
                msg.type === messageType.MM_NOTIFICATION &&
                msg.message &&
                msg.message.includes("Joined")
            );

          let orderedMessages = [
            ...fixedMessages,
            ...systemMessages,
            ...historicalMessages,
          ];

          if (joinedMessage) {
            orderedMessages.push(joinedMessage);
          }

          return orderedMessages;
        } else {
          const joinedMessage = prevMessages
            .slice(2)
            .find(
              (msg) =>
                msg.type === messageType.MM_NOTIFICATION &&
                msg.message &&
                msg.message.includes("Joined")
            );

          const expiryMessage = prevMessages
            .slice(2)
            .find((msg) => msg.type === messageType.ASK_TO_SET_EXPIRYTIME);

          let orderedMessages = [...fixedMessages];

          if (joinedMessage) {
            orderedMessages.push(joinedMessage);
          }
          if (expiryMessage) {
            orderedMessages.push(expiryMessage);
          }
          orderedMessages.push(...historicalMessages);

          return orderedMessages;
        }
      });

      if (data.isProjectModeOn) {
        setIsProjectModeOn(true);
      }
    };

    const handleUserList = (data) => {
      if (!data?.participants) {
        console.warn("⚠️ Invalid user list data received:", data);
        return;
      }

      const formattedList = data.participants.map((user) => ({
        name: user.username,
        color: USER_HANDERLS[user.assignedColor] ?? USER_HANDERLS[0],
        assignedColor: user.assignedColor,
      }));

      setUserList(formattedList);
    };

    const handleReceiveMessage = (data) => {
      console.log("📨 Received message:", data);

      if (data.isSystem || data.isSystemMessage) {
        console.log("🔇 Skipping system message - handled by frontend UI");
        return;
      }

      const user = userlist.find(
        (user) =>
          user.name.replace(/[\[\]]/g, "").toLowerCase() ===
          data.sender.replace(/[\[\]]/g, "").toLowerCase()
      );

      const userColor = user
        ? user.color
        : data.assignedColor !== undefined
        ? USER_HANDERLS[data.assignedColor]
        : USER_HANDERLS[0];

      let messageExpiresAt = data.expiresAt;
      if (!messageExpiresAt && !data.isPermanent && !isProjectModeOn) {
        const currentTimer = data.timerValue || expiryTime || 30;
        messageExpiresAt = data.timestamp + currentTimer * 1000;
      }

      console.log("📨 Message expiration info:", {
        timestamp: data.timestamp,
        expiresAt: messageExpiresAt,
        timerValue: data.timerValue || expiryTime || 30,
        isPermanent: data.isPermanent,
        isProjectMode: isProjectModeOn,
      });

      setChatMessages((prevMessages) => [
        ...prevMessages,
        {
          type: data.isAI
            ? messageType.AI_RESEARCH_COMPANION_RESPONSE
            : data.isAIInput
            ? messageType.AI_RESEARCH_COMPANION_INPUT
            : messageType.DEFAULT,
          message: data.message,
          handlerName: data.sender,
          handlerColor: userColor,
          timestamp: data.timestamp,
          messageId: `${data.timestamp}-${data.sender}`,
          expiresAt: messageExpiresAt,
          isPermanent: data.isPermanent || isProjectModeOn,
          timerValue: data.timerValue || expiryTime,
        },
      ]);
    };

    const handleTimerUpdate = (data) => {
      console.log("⏰ Timer updated:", data);

      if (!data?.seconds || !data?.setBy) {
        console.warn("⚠️ Invalid timer data received:", data);
        return;
      }

      setChatMessages((prevMessages) => [
        ...prevMessages,
        {
          type: messageType.EXPIRY_TIME_HAS_SET,
          handlerName: data.setBy,
          message: `* Message Expiration Time set for ${data.seconds} secs *`,
          handlerColor: "white",
        },
      ]);

      setExpiryTime(data.seconds);
      setIsExpiryTimeExist(true);
      hasShownExpiryTimeMessageRef.current = true;
    };

    const handleLockStatusUpdate = (data) => {
      console.log("🔒 Lock status updated:", data);
      console.log("🔍 Data details:", {
        locked: data.locked,
        lockedBy: data.lockedBy,
        unlockedBy: data.unlockedBy,
        autoUnlocked: data.autoUnlocked,
      });

      if (!data) {
        console.warn("⚠️ Invalid lock status data received:", data);
        return;
      }

      setCommandsList((prevList) => {
        let newList = prevList.filter(
          (item) => item !== "/lock" && item !== "/unlock"
        );

        if (data.locked) {
          setIsChatLock(true);
          if (data.lockedBy && handlerName === data.lockedBy) {
            newList.push("/unlock");
          }
        } else {
          setIsChatLock(false);
          newList.push("/lock");
        }

        return newList;
      });

      const message = data.locked
        ? `* This chat session is now locked *`
        : data.autoUnlocked
        ? `* This chat session is now unlocked *`
        : `* This chat session is now unlocked *`;

      setChatMessages((prevMessages) => [
        ...prevMessages,
        {
          type: messageType.EXPIRY_TIME_HAS_SET,
          handlerName: data.locked ? data.lockedBy : data.unlockedBy,
          message: message,
          handlerColor: "white",
        },
      ]);
    };

    const handleUserRemoved = (data) => {
      console.log("🚫 User Removed:", data);

      setChatMessages((prevMessages) => [
        ...prevMessages,
        {
          type: messageType.EXPIRY_TIME_HAS_SET,
          handlerName: data.removedBy,
          message: `* ${data.removedUser} has been removed *`,
          handlerColor: "white",
        },
      ]);
    };

    const handleYouWereRemoved = (data) => {
      console.log("🚫 You were removed:", data);

      window.location.href = "/removed-user";
    };

    const handleProjectModeUpdate = (data) => {
      console.log("🚀 Project Mode Update:", data);

      if (!data) {
        console.warn("⚠️ Invalid project mode data received:", data);
        return;
      }

      setIsProjectModeOn(data.enabled);

      setCommandsList((prevList) => {
        const currentLockCommands = prevList.filter(
          (item) => item === "/lock" || item === "/unlock"
        );

        if (data.enabled) {
          const list = prevList.filter(
            (item) => item !== "/project on" && item !== "/timer"
          );

          if (!list.includes("/project off")) list.push("/project off");
          if (!list.includes("/download")) list.push("/download");
          if (!list.includes("/mm")) list.push("/mm");
          if (!list.includes("/clear")) list.push("/clear");

          currentLockCommands.forEach((cmd) => {
            if (!list.includes(cmd)) list.push(cmd);
          });

          return list;
        } else {
          const list = prevList.filter(
            (item) =>
              item !== "/project off" &&
              item !== "/mm" &&
              item !== "/download" &&
              item !== "/clear"
          );

          if (!list.includes("/timer")) list.push("/timer");
          if (!list.includes("/project on")) list.push("/project on");

          currentLockCommands.forEach((cmd) => {
            if (!list.includes(cmd)) list.push(cmd);
          });

          return list;
        }
      });

      const message = data.enabled
        ? `* Project Mode Enabled by ${data.toggledBy} *`
        : `* Project Mode Disabled by ${data.toggledBy} *`;

      setChatMessages((prevMessages) => {
        let newMessages;

        if (data.enabled && data.messagesCleared) {
          newMessages = [
            {
              type: messageType.MM_ALERT,
              message: message,
              handlerColor: "#494AF8",
            },
            {
              type: messageType.PROJECT_MODE_ENTRY,
            },
          ];
        } else {
          newMessages = [
            ...prevMessages,
            {
              type: messageType.MM_ALERT,
              message: message,
              handlerColor: "#494AF8",
            },
          ];

          if (
            !data.enabled &&
            !isExpiryTimeExist &&
            !hasShownExpiryTimeMessageRef.current
          ) {
            newMessages.push({
              type: messageType.ASK_TO_SET_EXPIRYTIME,
            });
            hasShownExpiryTimeMessageRef.current = true;
          }
        }

        return newMessages;
      });
    };

    const handleMessageCleared = (data) => {
      console.log("🧹 Messages Cleared:", data);

      setChatMessages((prevMessages) => [
        ...prevMessages.slice(0, 2),
        {
          type: messageType.EXPIRY_TIME_HAS_SET,
          handlerName: data.clearedBy,
          message: `* Chat cleared *`,
          handlerColor: "white",
        },
      ]);
    };

    // ============================
    // NOTIFICATION EVENT HANDLERS
    // ============================

    const handleUserJoined = (data) => {
      console.log("👤 New User Joined:", data);

      if (!data?.handlerName || !data?.message) {
        console.warn("⚠️ Invalid user joined data received:", data);
        return;
      }

      if (data.handlerName === handlerName) {
        console.log("🔄 Skipping own join notification - already handled");
        return;
      }

      setChatMessages((prevMessages) => {
        const isAlreadyAdded = prevMessages.some(
          (msg) =>
            msg.handlerName === data.handlerName &&
            msg.type === messageType.MM_NOTIFICATION &&
            msg.message === data.message
        );

        if (isAlreadyAdded) return prevMessages;

        return [
          ...prevMessages,
          {
            type: messageType.MM_NOTIFICATION,
            message: data.message,
            handlerName: data.handlerName,
            handlerColor: USER_HANDERLS[data.handlerColor] || USER_HANDERLS[0],
          },
        ];
      });
    };

    const handleUserLeft = (data) => {
      console.log("👤 User Left:", data);

      if (!data?.handlerName || !data?.message) {
        console.warn("⚠️ Invalid user left data received:", data);
        return;
      }

      setChatMessages((prevMessages) => [
        ...prevMessages,
        {
          type: messageType.MM_NOTIFICATION,
          message: data.message,
          handlerName: data.handlerName,
          handlerColor: USER_HANDERLS[data.handlerColor] || USER_HANDERLS[0],
        },
      ]);
    };

    const handleSessionFull = (data) => {
      console.log("🚫 Session Full:", data);

      setChatMessages((prevMessages) => [
        ...prevMessages,
        {
          type: messageType.MM_ERROR_MSG,
          message: data?.message || "Session is full",
        },
      ]);
    };

    const handleInfoMessage = (message) => {
      console.log("ℹ️ Info message:", message);

      if (!message || typeof message !== "string") {
        console.warn("⚠️ Invalid info message received:", message);
        return;
      }
    };

    const handleSessionExpired = (data) => {
      console.log("⏰ Session Expired from socket:", data);

      setIsJoining(false);
      setIsSessionExpiredRealTime(true);
      setUserHasJoinedSession(false);

      setChatMessages((prevMessages) => [
        ...prevMessages.filter((msg) => msg.tempId !== "joining-loader"),
        {
          type: messageType.MM_ERROR_MSG,
          message:
            data?.message ||
            "This chat session has expired. Return to the homepage to generate a new chat session.",
        },
      ]);

      // Reset states
      setHandlerName("");
      setAskHandlerName(false);
      setinput("");
    };

    // =====================
    // ERROR EVENT HANDLERS
    // =====================

    const handleUsernameError = (message) => {
      console.error("👤 Username Error:", message);
      setIsJoining(false);

      setUserHasJoinedSession(false);

      setChatMessages((prevMessages) => [
        ...prevMessages.filter((msg) => msg.tempId !== "joining-loader"),
        {
          type: messageType.MM_ALERT,
          message: message,
        },
      ]);

      setHandlerName("");
      setAskHandlerName(true);
    };

    const handleSocketError = (error) => {
      console.error("❌ Socket Error:", error);
      setIsJoining(false);

      setUserHasJoinedSession(false);

      setChatMessages((prevMessages) =>
        prevMessages.filter((msg) => msg.tempId !== "joining-loader")
      );
    };

    const handleLockError = (error) => {
      console.error("🔒 Lock Error:", error);
    };

    const handleRemoveError = (error) => {
      console.error("🚫 Remove Error:", error);

      setAskRemoveUser(false);
      setinput("");
    };

    const handleAIError = (error) => {
      console.error("🤖 AI Error:", error);
    };

    // ============================
    // EVENT LISTENER REGISTRATION
    // ============================

    // SUCCESS EVENTS
    socket.on("joinedRoom", handleJoinedRoom);
    socket.on("historicalMessages", handleHistoricalMessages);
    socket.on("userList", handleUserList);
    socket.on("receiveMessage", handleReceiveMessage);
    socket.on("timerUpdate", handleTimerUpdate);
    socket.on("lockStatusUpdate", handleLockStatusUpdate);
    socket.on("userRemoved", handleUserRemoved);
    socket.on("youWereRemoved", handleYouWereRemoved);
    socket.on("projectModeUpdate", handleProjectModeUpdate);
    socket.on("messageCleared", handleMessageCleared);

    // NOTIFICATION EVENTS
    socket.on("userJoined", handleUserJoined);
    socket.on("userLeft", handleUserLeft);
    socket.on("sessionFull", handleSessionFull);
    socket.on("info", handleInfoMessage);
    socket.on("sessionExpired", handleSessionExpired);

    // ERROR EVENTS
    socket.on("usernameError", handleUsernameError);
    socket.on("error", handleSocketError);
    socket.on("lockError", handleLockError);
    socket.on("removeError", handleRemoveError);
    socket.on("aiError", handleAIError);

    // =================
    // CLEANUP FUNCTION
    // =================
    return () => {
      console.log("🧹 Cleaning up socket event listeners");

      setUserHasJoinedSession(false);

      // SUCCESS EVENTS CLEANUP
      socket.off("joinedRoom", handleJoinedRoom);
      socket.off("historicalMessages", handleHistoricalMessages);
      socket.off("userList", handleUserList);
      socket.off("receiveMessage", handleReceiveMessage);
      socket.off("timerUpdate", handleTimerUpdate);
      socket.off("lockStatusUpdate", handleLockStatusUpdate);
      socket.off("userRemoved", handleUserRemoved);
      socket.off("youWereRemoved", handleYouWereRemoved);
      socket.off("projectModeUpdate", handleProjectModeUpdate);
      socket.off("messageCleared", handleMessageCleared);

      // NOTIFICATION EVENTS CLEANUP
      socket.off("userJoined", handleUserJoined);
      socket.off("userLeft", handleUserLeft);
      socket.off("sessionFull", handleSessionFull);
      socket.off("info", handleInfoMessage);
      // socket.off("sessionExpired", handleSessionExpired);

      // ERROR EVENTS CLEANUP
      socket.off("usernameError", handleUsernameError);
      socket.off("error", handleSocketError);
      socket.off("lockError", handleLockError);
      socket.off("removeError", handleRemoveError);
      socket.off("aiError", handleAIError);
    };
  }, [socket, sessionData, handlerName]);

  // SOCKET INTEGRATION -- END

  return (
    <>
      <MessagesModals
        fileInputRef={fileInputRef}
        handleFileChange={handleFileChange}
        isLandscape={isLandscape}
        isMobileView={isMobileView}
      />

      <MessageContainer
        chatMessage={chatMessage}
        messageContainerRef={messageContainerRef}
        showAttachment={showAttachment}
        isMobileView={isMobileView}
        handlerName={handlerName}
        isTablet={isTablet}
        isSafari={isSafari}
        isAndroid={isAndroid}
        messageType={messageType}
        scrollToBottom={scrollToBottom}
        isSessionLockedRealTime={isSessionLockedRealTime}
        isSessionExpiredRealTime={isSessionExpiredRealTime}
        userHasJoinedSession={userHasJoinedSession}
      />

      <MessageInput
        InputFieldDisabled={InputFieldDisabled || shouldBlockInput}
        showAttachment={showAttachment}
        input={input}
        handleInputChange={handleInputChange}
        handleClickSendBtn={handleClickSendBtn}
        sendBtn={sendBtn}
        sendBtnGrey={sendBtnGrey}
        isDisabled={isDisabled || shouldBlockInput}
        KeyboardType={KeyboardType}
        showCommands={showCommands}
        selectedCommands={selectedCommands}
        isTimerCommand={isTimerCommand}
        commandModalRef={commandModalRef}
        handleKeyDown={handleKeyDown}
        // COMMAND LISTS
        userlist={userlist}
        removeUserList={removeUserList}
        commandlist={commandlist}
        handleSelectedCommand={handleSelectedCommand}
        handleSelectedUser={handleSelectedUser}
        isRemoveCommand={isRemoveCommand}
        selectedIndex={selectedIndex}
        setSelectedColor={setSelectedColor}
        setShowCommands={setShowCommands}
      />
    </>
  );
};

export default MessageBox;
