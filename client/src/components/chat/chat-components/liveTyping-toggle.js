"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

import useCheckIsMobileView from "@/hooks/useCheckIsMobileView";
import { chatContext } from "@/contexts/chat-context";

import CustomTooltip from "@/components/custom-tooltip";

import keyboard from "@/assets/icons/chat/keyboard.svg";
import ActiveKeyboard from "@/assets/icons/chat/activeKeyboard.svg";
import MenuKeyboard from "@/assets/icons/chat/menu-keyboardTyping.svg";
import MenuActiveKeyboard from "@/assets/icons/chat/menu-activeKeyboard.svg";

const LiveTypingToggle = ({ isMobileMenu, setOpenMenu }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const { isMobileView } = useCheckIsMobileView();
  const {
    setIsLiveTypingActive,
    isLiveTypingActive,
    setChatScreenNotification,
    setShowNotification,
  } = chatContext();

  useEffect(() => {
    setShowTooltip(false);
  }, [isLiveTypingActive]);

  const onMouseEnter = () => setShowTooltip(true);
  const onMouseLeave = () => setShowTooltip(false);

  const onClick = () => {
    if (isMobileView) {
      setIsLiveTypingActive((prev) => !prev);
      setChatScreenNotification({
        message: isLiveTypingActive
          ? "Live Typing Effect Off"
          : "Live Typing Effect On",
        visible: true,
      });
      if (setOpenMenu) setOpenMenu(false);
      setTimeout(() => {
        setChatScreenNotification((prev) => ({ ...prev, visible: false }));
      }, 1000);
    }
  };

  const onToggleChange = () => {
    setIsLiveTypingActive(!isLiveTypingActive);
    setShowNotification({
      message: isLiveTypingActive
        ? "Live Typing Effect Off"
        : "Live Typing Effect On",
      visible: true,
    });
    if (setOpenMenu) setOpenMenu(false);
    setTimeout(() => {
      setShowNotification((prev) => ({ ...prev, visible: false }));
    }, 1000);
  };

  let iconSrc;
  if (isMobileMenu) {
    iconSrc =
      isMobileView && isLiveTypingActive ? MenuActiveKeyboard : MenuKeyboard;
  } else {
    iconSrc = isMobileView && isLiveTypingActive ? ActiveKeyboard : keyboard;
  }
  return (
    <>
      <div
        className={`typing-switch-container ${
          isMobileMenu
            ? "black-bg"
            : isMobileView && isLiveTypingActive
            ? "active"
            : ""
        }`}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onClick={onClick}
      >
        <Image
          src={iconSrc}
          alt="keyboard"
          className={isMobileMenu ? "menu-icons" : undefined}
        />

        <div
          className={`custom-switch keyboard-switch ${
            isLiveTypingActive ? "checked" : ""
          }`}
          onClick={onToggleChange}
        >
          <div className="custom-switch-handle"></div>
        </div>

        <CustomTooltip visible={showTooltip}>
          Live Typing Effect On/Off
        </CustomTooltip>
      </div>
    </>
  );
};

export default LiveTypingToggle;
