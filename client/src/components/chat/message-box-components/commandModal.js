import Image from "next/image";
import React from "react";
import ProjectModeTooltip from "../chat-components/projectMode-tooltip";
import ShareModeTooltip from "../chat-components/share-tooltip";
import crossIcon from "@/assets/icons/chat/chat_mobile_icon/cross.svg";
import downArrowTooltip from "@/assets/icons/chat/downArrow.svg";
/**
 * CommandModal component renders a modal for displaying either a list of commands or users.
 *
 * @param {boolean} showCommands - Determines if the commands modal is visible.
 * @param {boolean} showAttachment - Indicates if the modal is in attachment mode.
 * @param {boolean} isRemoveCommand - Specifies whether the modal is displaying a user list for removal.
 * @param {Array} commandlist - List of command strings to be displayed in the modal.
 * @param {Array} userlist - List of user objects to be displayed in the modal.
 * @param {string} input - The current input text used for filtering the displayed list.
 * @param {number} selectedIndex - The index of the currently selected item in the list.
 * @param {function} handleSelectedCommand - Function to handle the selection of a command.
 * @param {function} handleSelectedUser - Function to handle the selection of a user.
 * @param {function} setSelectedColor - Function to set the color of the selected user.
 * @param {function} setShowCommands - Function to toggle the visibility of the commands modal.
 */

const CommandModal = ({
  showCommands,
  showAttachment,
  isRemoveCommand,
  commandlist,
  userlist,
  input,
  selectedIndex,
  handleSelectedCommand,
  handleSelectedUser,
  setSelectedColor,
  setShowCommands,
}) => {
  return (
    <>
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
            onClick={() =>
              setShowCommands(false)
            }
          />
        </div>
        <ul>
          {isRemoveCommand
            ? userlist.map((item, index) => (
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
                  onClick={() => handleSelectedCommand(item)}
                  className={
                    selectedIndex === index ? "commands_highlight" : ""
                  }
                >
                  <p
                    className={`chat-text ${
                      item.toLowerCase().startsWith(input) ? "" : "inactive"
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
    </>
  );
};

export default CommandModal;
