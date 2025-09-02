import React, { createRef, useRef } from "react";
import Image from "next/image";

import SelectedFileView from "../chat-components/selected-file";
import CommandModal from "./commandModal";

import arrow from "@/assets/icons/chat/open_right.svg";

export const inputRef = createRef(null);

const MessageInput = ({
  showAttachment,
  input,
  handleInputChange,
  handleClickSendBtn,
  sendBtn,
  sendBtnGrey,
  isDisabled,
  KeyboardType,
  showCommands,
  selectedCommands,
  isTimerCommand,
  commandModalRef,
  handleKeyDown,
  InputFieldDisabled,
  userlist,
  removeUserList,
  commandlist,
  handleSelectedCommand,
  handleSelectedUser,
  isRemoveCommand,
  selectedIndex,
  setSelectedColor,
  setShowCommands,
}) => {
  const pageRef = useRef(null);

  const combinedRef = (node) => {
    commandModalRef.current = node;
    pageRef.current = node;
  };

  return (
    <div
      ref={combinedRef}
      className={
        showAttachment ? "chat-input-cont-no-flex " : "chat-input-cont"
      }
    >
      <CommandModal
        showCommands={showCommands}
        selectedCommands={selectedCommands}
        userlist={userlist}
        removeUserList={removeUserList}
        showAttachment={showAttachment}
        commandlist={commandlist}
        input={input}
        handleSelectedCommand={handleSelectedCommand}
        handleSelectedUser={handleSelectedUser}
        isRemoveCommand={isRemoveCommand}
        selectedIndex={selectedIndex}
        setSelectedColor={setSelectedColor}
        setShowCommands={setShowCommands}
        key={"command-modal"}
      />

      <div className="input-cont" id="chat-input-cont">
        <Image src={arrow} id="arrow-icon" alt="arrow" />
        <textarea
          value={input}
          ref={inputRef}
          onChange={handleInputChange}
          id={
            showCommands || isTimerCommand || selectedCommands !== ""
              ? "input-active"
              : undefined
          }
          onKeyDown={handleKeyDown}
          type={KeyboardType}
          className="input-mono"
          draggable={false}
        />
        <Image
          src={!isDisabled && input.length > 0 ? sendBtn : sendBtnGrey}
          onClick={handleClickSendBtn}
          id="send-btn"
          alt="sendBtn"
          style={{
            cursor: isDisabled || InputFieldDisabled ? "default" : "pointer",
          }}
        />
      </div>
      {showAttachment && <SelectedFileView />}
    </div>
  );
};

export default MessageInput;
