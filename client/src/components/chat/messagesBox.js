"use client";
import sendBtn from "@/assets/icons/chat/sendBtn.svg";
import sendBtnGrey from "@/assets/icons/chat/send_grey.svg";
import { chatContext } from "@/contexts/chat-context";
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
import useCheckIsMobileView from "@/hooks/useCheckIsMobileView";
import usePhantomWallet from "@/hooks/usePhantomWallet";
import { createRef, useEffect, useRef, useState } from "react";
import {
  isSafari as isSAF,
  isAndroid,
  isMobile,
  isTablet,
} from "react-device-detect";
import { validateDisplayName } from "./chat-messages-utils";
import MessagesModals from "./message-box-components/messagesModals";
import MessageInput from "./message-box-components/message-input";
import MessageContainer from "./message-box-components/message-container";
import { SessionTypeEnum } from "@/enums/session-type-enum";

/**
 * MessageBox is a React component implementing a chat interface with various functionalities.
 * It supports chat commands, file attachments, message handling, and integration with Phantom Wallet.
 * The component maintains several states for user input, commands, chat messages, and UI behavior.
 * It also handles mobile-specific features and device detection, including Safari browser adjustments.
 * The chat interface supports project modes, user management, and security code verification.
 */
export const messageContainerRef = createRef(null);
const MessageBox = () => {
  // context
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
  } = chatContext();
  // Ref's
  const fileInputRef = useRef(null);
  const commandModalRef = useRef();
  // const messageContainerRef = useRef(null);
  // states
  const [input, setinput] = useState("");
  const [commandlist, setCommandsList] = useState(listcommands);
  const [selectedCommands, setSelectedCommands] = useState("");
  const [chatMessage, setChatMessages] = useState([]);
  const [handlerName, setHandlerName] = useState("");

  // ASK QUESTION'
  const [askHanderName, setAskHandlerName] = useState(false); // 1
  const [askProjectMode, setAskprojectMode] = useState(false); // 2
  const [askExitProjectMode, setAskExistProjectMode] = useState(false); //3
  const [askRemoveUser, setAskRemoveUser] = useState(false); //4
  const [askBeforClearChat, setAskBeforClearChat] = useState(false); //5

  // Verify status states
  const { isMobileView } = useCheckIsMobileView();
  const [removeUserName, setRemoveUserName] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(-1);

  // Handlers
  const [userlist, setUserList] = useState([
    { name: "[Richard]", color: USER_HANDERLS[4] },
    { name: "[Nicolas]", color: USER_HANDERLS[5] },
    { name: "[Laura]", color: USER_HANDERLS[6] },
    { name: "[Robert]", color: USER_HANDERLS[7] },
  ]);

  // status
  const [isExpiryTimeExist, setIsExpiryTimeExist] = useState(false);
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
  const { PhantomSessionApproved, isLoading } = usePhantomWallet();

  // HANDLERS use to handle stop scrolling for iOS while keyboard opens
  useEffect(() => {
    // // Check if the browser is Safari
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    if (!isSafari) return;
    if (!isMobile) return;
    if (!isMobileView) return;

    setIsSafari(isSafari);
    // Code to disable the scroll on keyboard open
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
      // If viewport height increased, assume keyboard is closing
      if (currentHeight > lastViewportHeight + 50) {
        const activeElement = document.activeElement;
        if (
          activeElement &&
          (activeElement.tagName === "INPUT" ||
            activeElement.tagName === "TEXTAREA")
        ) {
          activeElement.blur(); // blur only when keyboard closes
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
    // // Check if the browser is Safari
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    if (!isSafari) return;
    if (!isMobileView) return;

    // Code to disable the scroll on keyboard open
    const toggleBodyScroll = (e) =>
      (document.body.style.overflow = e.type === "focusin" ? "hidden" : "");
    window.addEventListener("focusin", toggleBodyScroll); // Keyboard open
    window.addEventListener("focusout", toggleBodyScroll); // Keyboard close
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
  // ===========  connectWallet ============= //

  useEffect(() => {
    if (PhantomSessionApproved) {
      WalletChatUtils();
    }
  }, [PhantomSessionApproved]);

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

  /**
   * Handles the Phantom Wallet connection process. If not on mobile, it calls
   * the `connectToPhantom` function to connect to the Phantom Wallet and if
   * successful, calls the `WalletChatUtils` function. If on mobile, it calls
   * the `connectPhantomDeeplinking` function to open the Phantom Wallet app.
   */
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

  // VALIDATION REGEX
  useEffect(() => {
    if (sessionData?.type == SessionTypeEnum.SECURE && !isVerifiedCode) {
      setKeyboardType("number");
    } else {
      setKeyboardType("text");
    }
  }, [sessionData, isVerifiedCode]);

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
        {
          type: messageType.MM_ERROR_MSG,
          message:
            "The chat session is full! There are currently 10/10 users joined.",
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
  // Handle file selection
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

  /**
   * Handles the selection of a command from the command modal.
   * Updates the input field and command states based on the selected command.
   *
   * @param {string} text - The selected command text.
   *
   * If the command is "/timer" or "/mm", appends a space to the command
   * and hides the command modal. Sets the spaceAdded state to true.
   * If the command is "/remove", appends a space to the command and
   * hides the command modal. Sets the isRemoveCommand state to true after a delay.
   */
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

  /**
   * Verifies the input command and displays a list of commands or users if the command is valid.
   * If the command is "/remove", it checks if the input value exists in the userlist.
   * If the command is not "/remove", it checks if the input value exists in the commandlist.
   * @param {string} value - The input command value.
   */
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

  /**
   * Handles the click event for the send button in the chat interface.
   *
   * - Verifies the security code before proceeding.
   * - Sends a message if the input is not empty and does not start with a command prefix ('/').
   *   - If an attachment is present, it checks for file attachment.
   *   - Otherwise, adds the input as a normal chat message.
   * - Resets command states after sending a message or executing a command.
   * - Handles various command inputs starting with '/' including:
   *   - Timer command
   *   - Transfer command
   *   - Project mode toggles (on/off)
   *   - Leave command
   *   - ChatGPT command
   *   - Chat lock/unlock
   *   - Download chat
   *   - Remove user
   * - Scrolls to the bottom of the chat after sending a message.
   */

  /**
   * Handles the logic for sending a chat message.
   * @function
   * @param {boolean} [verifySecurityCode=true] - Whether to verify the security code before sending the message.
   * @returns {void}
   */
  const handleClickSendBtn = () => {
    if (verifySecurityCode()) {
      if (input.trim() !== "" && !input.startsWith("/")) {
        setSelectedCommands("");
        if (showAttachment) {
          // with attachment message
          checkIsFileAttachment();
        } else {
          // normal message
          setChatMessages([
            ...chatMessage,
            {
              type: messageType.DEFAULT,
              message: input,
              handlerName: handlerName,
            },
          ]);
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

  /**
   * Handles key up and down events for the command list.
   * If the command list is visible and the user presses the up or down arrow keys, the
   * selected index is updated accordingly.
   * If the user presses Enter while the command list is visible, the selected command is
   * executed and the command list is closed.
   * If the user presses Tab while the command list is visible, the input is autocompleted
   * with the first matching command or user.
   */
  const handleKeyUpAndDown = (e) => {
    if (!showCommands) return; // Do nothing if the command list is not visible
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

  // HANDLE SECNARIOS

  // 1 VERIFY SECURITY CODE. ELSE RETURN ERROR
  /**
   * Verifies the security code entered by the user.
   * If the code is valid, it sets the isVerifiedCode flag to true and
   * adds a message moment to the chat log.
   * If the code is invalid, it adds an error message to the chat log.
   * If the session is not Secure, it will return true.
   * If the user has not entered a code, it will return false.
   * @returns {boolean} true if the code is valid, false if not.
   */
  const verifySecurityCode = () => {
    if (sessionData?.type === SessionTypeEnum.SECURE && !isVerifiedCode) {
      // const numberOnlyRegex = /^[0-9]{4}$/;
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

  // Handler Ask Question
  /**
   * Handles the Ask Remove User question by verifying the username entered by the user.
   * If the username is valid, it sets the askRemoveUser flag to true and adds a message moment
   * to the chat log with the username and color of the user to be removed.
   * If the username is invalid, it does nothing.
   */
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

    // T0 hanle duplicate display name scenario
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
          // message:
          //   "This Display Name was previously used in this session and cannot be reused by another user.",
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

    setChatMessages([
      ...chatMessage,
      {
        type: messageType.MM_NOTIFICATION,
        message: "Joined",
        handlerColor: USER_HANDERLS[3],
        handlerName: `[${input.slice(0, 18)}]`,
      },
      {
        type: messageType.MM_NOTIFICATION,
        message: "Joined",
        handlerColor: USER_HANDERLS[4],
        handlerName: "[Richard]",
      },
      {
        type: messageType.MM_NOTIFICATION,
        message: "Joined",
        handlerColor: USER_HANDERLS[5],
        handlerName: "[Nicolas]",
      },
      {
        type: messageType.MM_NOTIFICATION,
        message: "Joined",
        handlerColor: USER_HANDERLS[6],
        handlerName: "[Laura]",
      },
      {
        type: messageType.MM_NOTIFICATION,
        message: "Left",
        handlerColor: USER_HANDERLS[8],
        handlerName: "[William]",
      },
      {
        type: messageType.MM_NOTIFICATION,
        message: "Joined",
        handlerColor: USER_HANDERLS[7],
        handlerName: "[Robert]",
      },
      {
        type: messageType.ASK_TO_SET_EXPIRYTIME,
      },
    ]);
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

  // HANDLE COMMANDS
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
        setChatMessages([
          ...chatMessage,
          {
            type: messageType.EXPIRY_TIME_HAS_SET,
            handlerName,
            message: `* Message Expiration Time set for ${timer} secs *`,
            handlerColor: "white",
          },
        ]);
        setExpiryTime(timer);
        scrollToBottom();
        setinput("");
        setShowCommands(false);
        setIsExpiryTimeExist(true);
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
        // commandlist
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
