import React, { useEffect, useRef, useState } from "react";
import ClipboardJS from "clipboard";
import Image from "next/image";

import { ShareLink } from "@/dummy-data";
import { SessionTypeEnum } from "@/enums/session-type-enum";

import { chatContext } from "@/contexts/chat-context";

import chain from "@/assets/icons/chat/chain.svg";
import crossIcon from "@/assets/icons/chat/chat_mobile_icon/cross.svg";
import instagram from "@/assets/icons/chat/instagram.svg";
import mail from "@/assets/icons/chat/mail.svg";
import message from "@/assets/icons/chat/messageIcon.svg";
import messenger from "@/assets/icons/chat/messenger.svg";
import telegram from "@/assets/icons/chat/telegram.svg";
import whatsapp from "@/assets/icons/chat/whatsapp.svg";

const ShareModeTooltip = ({ isAttachment }) => {
  const [initialUrl, setInitialUrl] = useState("");

  const {
    showShareTooltip,
    setShareTooltip,
    setShowCopiedNotification,
    sessionData,
  } = chatContext();
  const tooltipRef = useRef(null);

  const handleCopy = (text) => {
    setShareTooltip(false);
    const textToCopy = text;
    if (textToCopy) {
      const tempButton = document.createElement("button");
      tempButton.setAttribute("data-clipboard-text", textToCopy);
      const clipboard = new ClipboardJS(tempButton);
      clipboard.on("success", () => {
        setShowCopiedNotification(true);
        setTimeout(() => {
          setShowCopiedNotification(false);
        }, 2000);
      });

      clipboard.on("error", () => {
        console.error("Failed to copy text.");
      });
      tempButton.click();
      clipboard.destroy();
      tempButton.remove();
    }
  };

  useEffect(() => {
    const url = window.location.origin + window.location.pathname;
    setInitialUrl(url);
    const handleClickOutside = (event) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target)) {
        setShareTooltip(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setShareTooltip]);

  return (
    <div
      ref={tooltipRef}
      className={`projectModetooltip
    ${showShareTooltip && "projectModetooltip-open"}
    ${isAttachment && "projectModetooltip-attachment"}
    `}
    >
      <div className="header-projectmode">
        <p className="chat-text">Share this Channel</p>
        <Image
          src={crossIcon}
          id="projectMode-cross"
          onClick={() => setShareTooltip(false)}
          alt="crossIcon"
        />
      </div>
      <div className="share-listtooltip">
        <ul>
          <li onClick={() => ShareLink("message", sessionData, initialUrl)}>
            <Image src={message} alt="message" />
            <p className="chat-text">Message</p>
          </li>
          <li onClick={() => ShareLink("mail", sessionData, initialUrl)}>
            <Image src={mail} alt="mail" />
            <p className="chat-text">Mail</p>
          </li>
          <li onClick={() => ShareLink("messenger", sessionData, initialUrl)}>
            <Image src={messenger} alt="messenger" />
            <p className="chat-text">Messenger</p>
          </li>
          <li onClick={() => ShareLink("whatsapp", sessionData, initialUrl)}>
            <Image src={whatsapp} alt="whatsapp" />
            <p className="chat-text">WhatsApp</p>
          </li>
          <li onClick={() => ShareLink("telegram", sessionData, initialUrl)}>
            <Image src={telegram} alt="telegram" />
            <p className="chat-text">Telegram</p>
          </li>
          <li onClick={() => ShareLink("instagram", sessionData, initialUrl)}>
            <Image src={instagram} alt="instagram" />
            <p className="chat-text">Instagram</p>
          </li>
          <li
            onClick={() =>
              handleCopy(
                `${initialUrl}${
                  sessionData.type == SessionTypeEnum.SECURE
                    ? `\n\nSecurity Code: ${sessionData?.secureCode}`
                    : ""
                }`
              )
            }
          >
            <Image src={chain} alt="chain" />
            <p className="chat-text">Copy URL</p>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ShareModeTooltip;
