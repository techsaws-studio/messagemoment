"use client";

import React, { createRef, useEffect, useRef, useState } from "react";
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

import sendBtn from "@/assets/icons/chat/sendBtn.svg";
import sendBtnGrey from "@/assets/icons/chat/send_grey.svg";

export const messageContainerRef = createRef(null);

const MessageBox = () => {
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
  } = chatContext();
  const fileInputRef = useRef(null);
  const commandModalRef = useRef();
  const socket = useSocket();

  const WalletChatUtils = () => {
    if (isMobileView) {
      setIsWalletConnected(true);
      setAskHandlerName(true);
      setChatMessages([
        ...chatMessage,
        {
          type: messageType.PHANTOM_WALLET,
          handlerName: messageType.MESSAGE_MOMENT,
        },
        {
          type: messageType.MESSAGE_MOMENT,
          handlerName: "",
        },
        {
          type: messageType.MM_ERROR_MSG,
          message:
            "The chat session is full! There are currently 10/10 users joined.",
        },
      ]);
    } else {
      setIsWalletConnected(true);
      setAskHandlerName(true);
      setChatMessages([
        ...chatMessage,
        {
          type: messageType.PHANTOM_WALLET,
          handlerName: messageType.MESSAGE_MOMENT,
        },
        {
          type: messageType.MESSAGE_MOMENT,
          handlerName: "",
        },
        {
          type: messageType.MM_ERROR_MSG,
          message:
            "The chat session is full! There are currently 10/10 users joined.",
        },
      ]);
    }
  };

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

  const scrollToBottom = () => {
    if (messageContainerRef.current) {
      setTimeout(() => {
        messageContainerRef.current?.scrollTo({
          top: messageContainerRef.current.scrollHeight,
          behavior: "smooth",
        });
      }, 20);
    }
  };

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
      const isExist = userlist.some((user) =>
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
    if (InputFieldDisabled) return;
    let value = e.target.value;
    if (value !== "") {
      // Reset command selections
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
      // Validate Secure Code
      if (sessionData?.type === SessionTypeEnum.SECURE && !isVerifiedCode) {
        // const numberOnlyRegex = /^[0-9]{4}$/;
        const numberOnlyRegex = /^(?!.*[.eE])[0-9]{4}$/;

        if (numberOnlyRegex.test(value.slice(0, 4))) {
          setIsDisabled(false);
          setinput(value.slice(0, 4));
        } else {
          setIsDisabled(true);
          setinput(value.slice(0, 4));
        }
      }

      // Validate Secure Code

      // Display Name
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

      // Validate DisplayName

      // Check if the input starts with "/"
      if (value.startsWith("/") && handlerName.trim() !== "") {
        verifyInputCommand(value);
        // Handle the timer command
        if (value.startsWith("/timer")) {
          setIsTimerCommand(true);

          // Only add space if it’s exactly "/timer" and space hasn’t been added yet
          if (value === "/timer" && !spaceAdded) {
            setinput("/timer ");
            setSpaceAdded(true); // Indicate that the space has been added
            setShowCommands(false);
            return;
          }

          // If the user removes space, reset the spaceAdded flag
          if (value === "/timer" && spaceAdded) {
            setinput(value);
            setSpaceAdded(false);
          }
        }

        if (value.startsWith("/remove")) {
          setIsTimerCommand(true);
          // Only add space if it’s exactly "/timer" and space hasn’t been added yet
          if (value === "/remove" && !spaceAdded) {
            setinput("/remove ");
            setTimeout(() => {
              setIsRemoveCommand(true);
            }, 200);
            //
            setSpaceAdded(true); // Indicate that the space has been added
            setShowCommands(false);
            return;
          } else if (value.startsWith("/remove ")) {
            setTimeout(() => {
              setIsRemoveCommand(true);
            }, 200);
            setSpaceAdded(true);
          }

          // If the user removes space, reset the spaceAdded flag
          if (value === "/remove" && spaceAdded) {
            setinput(value);
            setSpaceAdded(false);
            setTimeout(() => {
              setIsRemoveCommand(false);
            }, 200);
          }
        }

        // Handle the CHATGPT command
        if (isProjectModeOn && value.startsWith("/mm")) {
          setShowCommands(false);
          // Only add space if it’s exactly "/timer" and space hasn’t been added yet
          if (value === "/mm" && !spaceAdded) {
            setinput("/mm ");
            setSpaceAdded(true); // Indicate that the space has been added
            setShowCommands(false);
            return;
          }

          // If the user removes space, reset the spaceAdded flag
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
      // Reset state if input is empty
      setSelectedCommands("");
      setinput("");
      setSpaceAdded(false); // Reset the flag when input is cleared
      if (showCommands) setShowCommands(false);
    }
  };

  const handleClickSendBtn = () => {
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
          scrollToBottom();
        }
      } else {
        setSelectedCommands("");
        setSpaceAdded(false);
        //
        if (input.startsWith("/")) {
          // timer command handler
          if (!isProjectModeOn && input.includes("/timer")) {
            handleTimerCommand(input);
          } else if (input == "/transfer") {
            setShowCommands(false);
            openFilePopup();
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
            handleChatgptCommand();
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
          scrollToBottom();
        } else {
          if (input.startsWith("/")) {
            // timer command handleer
            if (!isProjectModeOn && input.includes("/timer")) {
              handleTimerCommand(input);
              setSpaceAdded(false);
            } else if (input == "/transfer") {
              openFilePopup();
              setShowCommands(false);
            } else if (!isProjectModeOn && input == "/project on") {
              setAskprojectMode(true);
              handleProjectAskMode();
            } else if (isProjectModeOn && input == "/project off") {
              setAskExistProjectMode(true);
              AskExistProjectModeQuestion();
            } else if (input == "/leave") {
              handleChatLeaveCommand();
            } else if (isProjectModeOn && input.includes("/mm")) {
              handleChatgptCommand();
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
          (isRemoveCommand ? userlist : commandlist).length - 1
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
        ? userlist[selectedIndex]
        : commandlist[selectedIndex];
      if (isRemoveCommand) {
        handleSelectedUser(selectedItem?.name.replace(/\[|\]/g, ""));
        setSelectedColor(selectedItem?.color);
        setSelectedIndex(-1);
      } else {
        handleSelectedCommand(selectedItem);
        setSelectedIndex(-1);
      }
      // setIsCommandSelected(true); // Mark as selected
      setShowCommands(false); // Close command list
    }

    // Auto-complete with Tab
    if (e.key === "Tab") {
      e.preventDefault();
      const inputValue = e.target.value.trim();

      if (isRemoveCommand) {
        // User TAB
        const userInput = inputValue.split(" ")[1].toLowerCase();
        const matchingUser = userlist.find((item) =>
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
        // Command TAB
        const matchingCommand = commandlist.find((item) =>
          item?.startsWith(inputValue)
        );
        if (matchingCommand) {
          handleSelectedCommand(matchingCommand);
          setSelectedIndex(-1);
          setShowCommands(false);
        }
      }
    }
  };

  const verifySecurityCode = () => {
    if (sessionData?.type === SessionTypeEnum.SECURE && !isVerifiedCode) {
      const numberOnlyRegex = /^(?!.*[.eE])[0-9]{4}$/;

      if (!numberOnlyRegex.test(input)) return;
      if (input == sessionData?.secureCode) {
        setChatMessages([
          ...chatMessage,

          {
            type: messageType.MM_NOTIFICATION,
            message: "Verifying...",
            handlerColor: "#494AF8",
          },
          {
            type: messageType.MM_ERROR_MSG,
            message:
              "The chat session is full! There are currently 10/10 users joined.",
          },
          {
            type: messageType.MESSAGE_MOMENT,
            handler: messageType.MESSAGE_MOMENT,
          },
        ]);
        setAskHandlerName(true);
        scrollToBottom();
        setinput("");
        setTimeout(() => {
          setIsVerifiedCode(true);
          return true;
        }, 2000);
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
        // return false
      }
    } else {
      // handle questions
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
    const hasFindUser = userlist.find(
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
    const username = input.trim();
    const isValidate = validateDisplayName(username);

    if (isValidate !== "All Good!") return;

    // To hanle duplicate display name scenario
    if (username.toLowerCase() == "Timothy".toLowerCase()) {
      setChatMessages([
        ...chatMessage,
        {
          type: messageType.MM_ALERT,
          message:
            "The Display Name you entered was previously used in this session and cannot be reused.",
        },
      ]);
      setinput("");
      scrollToBottom();
      return;
    }

    const isExist = userlist.find(
      (item) =>
        item.name.replace(/\[|\]/g, "").toLowerCase() == username.toLowerCase()
    );
    if (isExist) {
      setChatMessages([
        ...chatMessage,
        {
          type: messageType.MM_ALERT,
          message:
            "The Display Name you entered is already in use. Please choose something else.",
        },
      ]);
      setinput("");
      scrollToBottom();
      return;
    }
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
    setChatMessages([
      ...chatMessage,
      {
        type: messageType.EXPIRY_TIME_HAS_SET,
        handlerName,
        message: `* ${removeUserName} has been removed *`,
        handlerColor: "white",
      },
    ]);
    setinput("");
    setShowCommands(false);
    scrollToBottom();
  };

  const handleLockChatCommand = () => {
    const list = commandlist.filter((item) => item != "/lock");
    list.push("/unlock");
    setCommandsList(list);
    setChatMessages([
      ...chatMessage,
      {
        type: messageType.EXPIRY_TIME_HAS_SET,
        handlerName,
        message: `* This chat session is now locked *`,
        handlerColor: "white",
      },
    ]);
    setIsChatLock(true);
    setinput("");
    setShowCommands(false);
    scrollToBottom();
  };

  const handleUnLockChatCommand = () => {
    const list = commandlist.filter((item) => item != "/unlock");
    list.push("/lock");
    setCommandsList(list);
    setChatMessages([
      ...chatMessage,
      {
        type: messageType.EXPIRY_TIME_HAS_SET,
        handlerName,
        message: `* This chat session is now unlocked *`,
        handlerColor: "white",
      },
    ]);
    setIsChatLock(false);
    setinput("");
    setShowCommands(false);
    scrollToBottom();
  };

  const handleClearCommand = () => {
    setChatMessages((prevMessages) => [...prevMessages.slice(0, 2)]);

    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          type: messageType.EXPIRY_TIME_HAS_SET,
          handlerName,
          message: `* Chat cleared *`,
          handlerColor: "white",
        },
      ]);
    }, 500);
    setinput("");
    setShowCommands(false);
    scrollToBottom();
  };

  const handleChatgptCommand = () => {
    const msg = input.replace("/mm", "").trim();
    if (msg == "") {
      return;
    }
    setChatMessages([
      ...chatMessage,
      {
        type: messageType.CHATGPT_INPUT,
        handlerName,
        message: msg,
      },
      {
        type: messageType.CHATGPT_RESPONSE,
        handlerName: messageType.MESSAGE_MOMENT,
        message:
          "Today is March 10, 2023. So there are 19 days until March 29, 2023.",
      },
    ]);
    setinput("");
    setShowCommands(false);
    scrollToBottom();
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
    const list = commandlist.filter(
      (item) => item != "/project on" && item != "/timer"
    );
    list.push("/project off");
    list.push("/download");
    list.push("/mm");
    list.push("/clear");

    setCommandsList(list);
    setIsProjectModeOn(true);
    setinput("");
    setShowCommands(false);
    setAskprojectMode(false);
    setChatMessages([
      {
        type: messageType.MM_ALERT,
        message: `Project Mode Enabled by ${handlerName}`,
        handlerColor: "#494AF8",
      },
      {
        type: messageType.PROJECT_MODE_ENTRY,
      },
    ]);
    scrollToBottom();
  };

  const handleProjectModeOfff = () => {
    const list = commandlist.filter(
      (item) =>
        item != "/project off" &&
        item != "/mm" &&
        item != "/download" &&
        item != "/clear"
    );
    list.push("/timer");
    list.push("/project on");
    setChatMessages([
      ...chatMessage,
      {
        type: messageType.MM_ALERT,
        message: `Project Mode Disabled by ${handlerName}`,
        handlerColor: "#494AF8",
      },
    ]);
    setCommandsList(list);
    setIsProjectModeOn(false);
    setAskExistProjectMode(false);
    setinput("");
    setShowCommands(false);
    scrollToBottom();
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
      // Set default handler name if it's empty
      const handlerName = chat.handlerName || "[MessageMoment.com]";

      // Set default message if it's empty based on message type
      const message =
        chat.type == messageType.MM_NOTIFICATION_REMOVE_USER
          ? renderRemoveUserText(chat.message)
          : chat.message || DEFAULT_MESSAGES[chat.type] || "";

      return `${handlerName} ${message}`;
    }).join("\n");
    setinput("");
    // Create a Blob from the string
    const blob = new Blob([chatText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    // Create a temporary anchor element to download the file
    const link = document.createElement("a");
    link.href = url;
    link.download = "chat_history.txt";
    document.body.appendChild(link);
    link.click();
    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

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

  // SOCKET INTEGRATION
  useEffect(() => {
    if (!socket || !handlerName) return;

    console.log("🔍 Attempting to join room with:", {
      sessionId: sessionData.code,
      username: handlerName,
      handlerName: handlerName,
    });

    setIsJoining(true);

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
    });

    socket.on("joinedRoom", (data) => {
      console.log("✅ Successfully joined room:", data);
      setIsJoining(false);

      setChatMessages((prevMessages) => {
        const filteredMessages = prevMessages.filter(
          (msg) => msg.tempId !== "joining-loader"
        );

        if (data.session && data.session.isExpirationTimeSet) {
          setIsExpiryTimeExist(true);
          setExpiryTime(data.session.sessionTimer);
          hasShownExpiryTimeMessageRef.current = true;
          return filteredMessages;
        } else {
          setIsExpiryTimeExist(false);
          setExpiryTime(30);
          hasShownExpiryTimeMessageRef.current = false;

          if (!hasShownExpiryTimeMessageRef.current) {
            filteredMessages.push({
              type: messageType.ASK_TO_SET_EXPIRYTIME,
            });
            hasShownExpiryTimeMessageRef.current = true;
          }

          return filteredMessages;
        }
      });
    });

    // USER LIST
    socket.on("userList", (data) => {
      const formattedList = data.participants.map((user) => ({
        name: user.username,
        color: USER_HANDERLS[user.assignedColor] ?? USER_HANDERLS[0],
        assignedColor: user.assignedColor,
      }));

      setUserList(formattedList);
    });

    // NOTIFICATIONS LOGIC (STARTS)
    socket.on("userJoined", (data) => {
      console.log("New User Joined:", data);

      setChatMessages((prevMessages) => {
        const isAlreadyAdded = prevMessages.some(
          (msg) => msg.handlerName === data.handlerName
        );

        if (isAlreadyAdded) return prevMessages;

        const newMessages = [
          ...prevMessages,
          {
            type: messageType.MM_NOTIFICATION,
            message: data.message,
            handlerName: data.handlerName,
            handlerColor: USER_HANDERLS[data.handlerColor] || USER_HANDERLS[0],
          },
        ];

        return newMessages;
      });
    });

    socket.on("userLeft", (data) => {
      console.log("User Left:", data);

      setChatMessages((prevMessages) => [
        ...prevMessages,
        {
          type: messageType.MM_NOTIFICATION,
          message: data.message,
          handlerName: data.handlerName,
          handlerColor: USER_HANDERLS[data.handlerColor] || USER_HANDERLS[0],
        },
      ]);
    });

    socket.on("sessionFull", (data) => {
      console.log("Session Full:", data);

      setChatMessages((prevMessages) => [
        ...prevMessages,
        {
          type: messageType.MM_ERROR_MSG,
          message: data.message,
        },
      ]);
    });

    // NOTIFICATIONS LOGIC (ENDS)

    socket.on("usernameError", (message) => {
      setIsJoining(false);

      setChatMessages((prevMessages) => [
        ...prevMessages.filter((msg) => msg.tempId !== "joining-loader"),
        {
          type: messageType.MM_ALERT,
          message: message,
        },
      ]);

      setHandlerName("");
      setAskHandlerName(true);
    });

    socket.on("error", (message) => {
      setIsJoining(false);

      setChatMessages((prevMessages) =>
        prevMessages.filter((msg) => msg.tempId !== "joining-loader")
      );

      console.error("Join Room Error:", message);
    });

    return () => {
      socket.off("joinedRoom");
      socket.off("userJoined");
      socket.off("userLeft");
      socket.off("sessionFull");
      socket.off("usernameError");
      socket.off("error");
    };
  }, [socket, sessionData, handlerName]);

  useEffect(() => {
    if (!socket) return;

    socket.on("receiveMessage", (data) => {
      console.log("📨 Received message:", data);

      const user = userlist.find(
        (user) =>
          user.name.replace(/[\[\]]/g, "").toLowerCase() ===
          data.sender.replace(/[\[\]]/g, "").toLowerCase()
      );

      setChatMessages((prevMessages) => [
        ...prevMessages,
        {
          type: messageType.DEFAULT,
          message: data.message,
          handlerName: data.sender,
          handlerColor: user ? user.color : USER_HANDERLS[0],
          timestamp: data.timestamp,
        },
      ]);
      scrollToBottom();
    });

    socket.on("timerUpdate", (data) => {
      console.log("⏰ Timer updated:", data);

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
      scrollToBottom();
    });

    socket.on("info", (message) => {
      console.log("ℹ️ Info message:", message);
      setChatMessages((prevMessages) => [
        ...prevMessages,
        {
          type: messageType.MM_ALERT,
          message: message,
        },
      ]);
      scrollToBottom();
    });

    socket.on("error", (error) => {
      console.error("❌ Socket error:", error);
      setChatMessages((prevMessages) => [
        ...prevMessages,
        {
          type: messageType.MM_ERROR_MSG,
          message: error,
        },
      ]);
    });

    return () => {
      socket.off("receiveMessage");
      socket.off("timerUpdate");
      socket.off("info");
      socket.off("error");
    };
  }, [socket, userlist]);

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
      />

      <MessageInput
        InputFieldDisabled={InputFieldDisabled}
        showAttachment={showAttachment}
        input={input}
        handleInputChange={handleInputChange}
        handleClickSendBtn={handleClickSendBtn}
        sendBtn={sendBtn}
        sendBtnGrey={sendBtnGrey}
        isDisabled={isDisabled}
        KeyboardType={KeyboardType}
        showCommands={showCommands}
        selectedCommands={selectedCommands}
        isTimerCommand={isTimerCommand}
        commandModalRef={commandModalRef}
        handleKeyDown={handleKeyDown}
        // COMMAND LISTS
        userlist={userlist}
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
