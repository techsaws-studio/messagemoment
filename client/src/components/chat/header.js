"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import ClipboardJS from "clipboard";
import { Tooltip } from "antd";
import { getYear } from "date-fns";

import { useSocket } from "@/contexts/socket-context";
import { chatContext } from "@/contexts/chat-context";
import useCheckIsMobileView from "@/hooks/useCheckIsMobileView";

import DisconnectBtn from "./disconnectButton";
import ShareButton from "./shareButton";
import Button from "../button";

import chat_shareIcon from "@/assets/icons/chat/chat_mobile_icon/share.svg";
import project_mode_on from "@/assets/icons/chat/project_mode_on.svg";
import mmlogo from "@/assets/icons/chat/mm_logo.svg";
import lock from "@/assets/icons/chat/url_lock.svg";
import copylink from "@/assets/icons/chat/copylink_tooltip.svg";
import expiry_tooltip from "@/assets/icons/chat/expiry_tooltip.svg";
import project_mode_tooltip from "@/assets/icons/chat/project_mode_tooltip.svg";
import chat_uploadIcon from "@/assets/icons/chat/chat_mobile_icon/upload.svg";
import chat_menuIcon from "@/assets/icons/chat/chat_mobile_icon/menu.svg";
import ads from "@/assets/icons/chat/chat_mobile_icon/ads.svg";
import share_m from "@/assets/icons/chat/chat_mobile_icon/share_m.svg";
import upload_m from "@/assets/icons/chat/chat_mobile_icon/upload_m.svg";
import close_menu from "@/assets/icons/chat/chat_mobile_icon/close_menu.svg";
import grey_logo from "@/assets/icons/chat/grey_logo.png";
import heartIcon from "@/assets/icons/heart_white.svg";
import MMLogo from "@/assets/icons/chat/mmLogo";
import { SessionTypeEnum } from "@/enums/session-type-enum";

export const ChatHeader = () => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);

  const {
    isProjectModeOn,
    expiryTime,
    setShowProjectModeTooltip,
    setShareTooltip,
    showCopiedNotification,
    setShowChatLeaveModal,
    setChatScreenNotification,
    sessionData,
    setUsers,
    setActiveUser,
    users,
    activeUser,
  } = chatContext();
  const socket = useSocket();
  const currentYear = getYear(new Date());
  const { isMobileView } = useCheckIsMobileView();

  const handleCopy = (text) => {
    const textToCopy = text;
    if (textToCopy) {
      const tempButton = document.createElement("button");
      tempButton.setAttribute("data-clipboard-text", textToCopy);
      const clipboard = new ClipboardJS(tempButton);
      clipboard.on("success", () => {
        setChatScreenNotification({
          message: "Link copied to clipboard",
          visible: true,
        });
        console.log("Text copied to clipboard successfully!");
        setTimeout(() => {
          setChatScreenNotification((prev) => ({ ...prev, visible: false }));
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

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const onClickReadMore = () => {
    window.open("/faqs#project_mode", "_blank");
  };

  const onClickShareMobileIcon = () => {
    setOpenMenu(false);
    setTimeout(() => {
      setShareTooltip(true);
    }, 200);
  };

  const onClickLeaveMobileIcon = () => {
    setOpenMenu(false);
    setTimeout(() => {
      setShowChatLeaveModal(true);
    }, 200);
  };

  const renderProjectModeActiveTooltip = () => {
    return (
      <div className="header-projectmode" style={{ position: "relative" }}>
        <p
          className="chat-text read_more"
          style={{
            color: "white",
            position: "absolute",
            top: "15px",
            right: "25px",
            fontSize: "10px",
            fontWeight: "400",
            cursor: "pointer",
          }}
          onClick={onClickReadMore}
        >
          Read More
        </p>

        <Image
          src={project_mode_tooltip}
          draggable={false}
          alt="copy-tooltip"
          style={{
            cursor: "default",
          }}
        />
      </div>
    );
  };

  const handleNavClick = (path) => {
    scrollToTop();
    window.open(path, "_blank");
  };

  useEffect(() => {
    if (showCopiedNotification) {
      setChatScreenNotification({
        message: "Link copied to clipboard",
        visible: true,
      });
      setTimeout(() => {
        setChatScreenNotification((prev) => ({ ...prev, visible: false }));
      }, 2000);
    }
  }, [showCopiedNotification]);

  // SOCKET INTEGRATION
  useEffect(() => {
    if (!socket) return;

    socket.on("updateUserList", (data) => {
      setUsers(data.users);
    });

    socket.on("setActiveUser", (data) => {
      setActiveUser(data.username);
    });

    return () => {
      socket.off("updateUserList");
      socket.off("setActiveUser");
    };
  }, []);

  return (
    <div className="header-cont">
      <div className={openMenu ? "chat-m-bar" : "bar"} />
      {/*   MOBILE MENU */}
      <div
        className={`chat-mobile-header ${
          openMenu ? "chat-header-open" : "chat-header-close"
        }`}
      >
        <div className={"chat-m-bar"} />
        <div className="top-chat-head">
          <div className="logo">
            <MMLogo onClick={() => window.open("/", "_blank")} />
          </div>
          <div id={"flex-chat-row"}>
            <div className="chat-m-timerClock">
              <p className={`small ${expiryTime && "hasactive"}`}>
                {expiryTime ? expiryTime : "30"}
              </p>
            </div>
            <div id="chat-vt-divider-m" />
            <div>
              <Image
                src={upload_m}
                alt="upload_m"
                onClick={onClickShareMobileIcon}
              />
            </div>
            <div>
              <Image
                src={share_m}
                alt="share_m"
                onClick={onClickLeaveMobileIcon}
              />
            </div>
            <div>
              <Image
                src={close_menu}
                alt="close_menu"
                onClick={() => setOpenMenu(false)}
              />
            </div>
          </div>
        </div>

        {/* USER LIST HEADER */}
        <div className="chat-mobile-header_inner" id="chat-scroll">
          <div className="chat-group">
            <div className="header">
              <p className="title">Chat Group</p>
              <p className="chat-text">{users.length}/10</p>
            </div>

            {/* USER LIST */}
            <ul>
              {users.map((user, i) => (
                <li
                  key={`userlist-${i.toString()}`}
                  className={`${user === activeUser ? "active" : ""} ${
                    users.length < 10 && i === users.length - 1
                      ? "last-child"
                      : ""
                  }`}
                >
                  <p className="chat-text">{user}</p>
                  {user === activeUser && <div>*</div>}
                </li>
              ))}
            </ul>

            {/* ADVERTISMENT SECTION */}
            <div className="chatm_footer">
              <section className="mads">
                <Image src={ads} alt="ads-img" />
              </section>

              <div id="divider_m" />

              <section className="side-footer">
                <Image src={grey_logo} alt="gre_Logo" />

                <div className="side-footer-links">
                  <Link href="/about" target="_blank">
                    <p>About MessageMoment</p>
                  </Link>
                  <Link href="/faqs" target="_blank">
                    <p>FAQs</p>
                  </Link>
                  <Link href="/terms" target="_blank">
                    <p>Terms of Use</p>
                  </Link>
                  <Link href="/privacy" target="_blank">
                    <p>Privacy</p>
                  </Link>
                </div>

                <div className="supportus-btn">
                  <Button
                    icon={heartIcon}
                    text="Support Us"
                    maxWidth={"388px"}
                    className="support-btn text-white secondary-bg responsive-button-footer"
                    onClick={() =>
                      handleNavClick("https://ko-fi.com/messagemoment")
                    }
                  />
                </div>

                <h3 className="chat-text">
                  Copyright © {currentYear} MessageMoment. All rights reserved.
                </h3>
              </section>
            </div>
          </div>
        </div>
      </div>

      {/* DESKTOP HEADER */}
      <div className="container_chat chat-header">
        {/* LOGO */}
        <div className="logo">
          <Image
            src={mmlogo}
            alt="mmlogo"
            onClick={() => window.open("/", "_blank")}
          />
          <div className="vertical-divider" />
        </div>

        {/* SESSION URL */}
        <div className="url">
          <Image src={lock} alt="lock" />
          <Tooltip
            overlayClassName="copylink-tooltip"
            title={<Image src={copylink} alt="copy-tooltip" />}
            open={showTooltip}
            onOpenChange={(open) => setShowTooltip(open)}
          >
            <p
              className="small"
              onClick={() => {
                handleCopy(
                  `https://messagemoment.com/chat/${sessionData.code}`
                );
                setShowTooltip(false);
              }}
            >
              {`https://messagemoment.com/chat/${
                sessionData.type === SessionTypeEnum.STANDARD
                  ? sessionData.code
                  : "**************"
              }`}
            </p>
          </Tooltip>
        </div>

        {/* BUTTON */}
        {isProjectModeOn ? (
          <div id="flex-row">
            {isMobileView ? (
              <>
                <div>
                  <Image
                    src={project_mode_on}
                    draggable={false}
                    id="projectmode"
                    className="projectmode-img"
                    alt="project_mode_on"
                    onClick={() => setShowProjectModeTooltip(true)}
                  />
                </div>
              </>
            ) : (
              <>
                <Tooltip
                  placement="leftBottom"
                  overlayClassName="projectMode-tooltip"
                  title={renderProjectModeActiveTooltip()}
                >
                  <div>
                    <Image
                      src={project_mode_on}
                      draggable={false}
                      id="projectmode"
                      className="projectmode-img"
                      alt="project_mode_on"
                    />
                  </div>
                </Tooltip>
              </>
            )}
            <div id="half-vt-divider" />
          </div>
        ) : (
          <div className="timer-cont">
            {isMobileView ? (
              <>
                <div className="timer-block">
                  <p className={`small ${expiryTime && "hasactive"}`}>
                    {expiryTime ? expiryTime : "30"}
                  </p>
                </div>
              </>
            ) : (
              <>
                <Tooltip
                  overlayClassName="copylink-tooltip"
                  title={<Image src={expiry_tooltip} alt="copy-tooltip" />}
                >
                  <div className="timer-block">
                    <p className={`small ${expiryTime && "hasactive"}`}>
                      {expiryTime ? expiryTime : "30"}
                    </p>
                  </div>
                </Tooltip>
              </>
            )}
            <div id="half-vt-divider" />
          </div>
        )}

        <div className="side-btns">
          <DisconnectBtn />
          <ShareButton onCopyClick={(text) => handleCopy(text)} />

          <Image
            className="chat_header_icons"
            src={chat_uploadIcon}
            alt="chat_uploadIcon"
            onClick={() => setShareTooltip(true)}
          />
          <Image
            className="chat_header_icons"
            src={chat_shareIcon}
            alt="chat_shareIcon"
            onClick={() => setShowChatLeaveModal(true)}
          />
          <Image
            className="chat_header_icons"
            src={chat_menuIcon}
            alt="chat-menu"
            onClick={() => setOpenMenu(true)}
          />
        </div>
      </div>
    </div>
  );
};
