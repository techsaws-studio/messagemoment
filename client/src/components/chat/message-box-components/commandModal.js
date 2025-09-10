import React, { Fragment } from "react";
import Image from "next/image";

import ProjectModeTooltip from "../chat-components/projectMode-tooltip";
import ShareModeTooltip from "../chat-components/share-tooltip";

import crossIcon from "@/assets/icons/chat/chat_mobile_icon/cross.svg";
import downArrowTooltip from "@/assets/icons/chat/downArrow.svg";

const CommandModal = ({
  showCommands,
  showAttachment,
  isRemoveCommand,
  commandlist,
  userlist,
  removeUserList,
  input,
  selectedIndex,
  handleSelectedCommand,
  handleSelectedUser,
  setSelectedColor,
  setShowCommands,
}) => {
  const listToShow = isRemoveCommand ? removeUserList : commandlist;

  if (showCommands && listToShow.length === 0) {
    return null;
  }

  return (
    <Fragment>
      <div
        className={`commands-modal ${
          showCommands ? "commands-modal-open" : ""
        }  
              ${showAttachment && "commands-modal-attachment"}
              `}
      >
        <div className="head" style={{ display: "flex" }}>
          <p>{isRemoveCommand ? "User List" : "Commands"}</p>
          <Image
            src={crossIcon}
            alt="crossIcon_2"
            onClick={() => setShowCommands(false)}
          />
        </div>
        <ul>
          {isRemoveCommand
            ? removeUserList.map((item, index) => (
                <li
                  key={`command-list-${index}`}
                  onClick={() => {
                    handleSelectedUser(item?.name.replace(/\[|\]/g, ""));
                    setSelectedColor(item?.color);
                  }}
                  className={
                    selectedIndex === index ? " userlist highlight" : "userlist"
                  }
                >
                  <p
                    className={`chat-text `}
                    style={{
                      color: item.name
                        .replace(/\[|\]/g, "")
                        .toLowerCase()
                        .startsWith(
                          input.split(" ")[1]
                            ? input.split(" ")[1].toLowerCase()
                            : ""
                        )
                        ? item?.color
                        : "rgba(94, 99, 114, 1)",
                    }}
                  >
                    {item?.name}
                  </p>
                </li>
              ))
            : commandlist.map((item, index) => (
                <li
                  key={`command-list-${index}`}
                  onClick={() => {
                    if (item !== "/transfer (future)") {
                      handleSelectedCommand(item);
                    }
                  }}
                  className={`${
                    selectedIndex === index && item !== "/transfer (future)"
                      ? "commands_highlight"
                      : ""
                  } ${item === "/transfer (future)" && "future-command"}`}
                >
                  <p
                    className={`chat-text ${
                      item === "/transfer (future)"
                        ? "inactive"
                        : item.toLowerCase().startsWith(input)
                        ? ""
                        : "inactive"
                    }`}
                  >
                    {item}
                  </p>
                </li>
              ))}
        </ul>
        <Image
          src={downArrowTooltip}
          alt="downArrowTooltip"
          className="command-tooltip"
        />
      </div>
      <ProjectModeTooltip
        key={`ProjectModeTooltip`}
        isAttachment={showAttachment}
      />
      <ShareModeTooltip
        key={`ShareModeTooltip`}
        isAttachment={showAttachment}
      />
    </Fragment>
  );
};

export default CommandModal;
