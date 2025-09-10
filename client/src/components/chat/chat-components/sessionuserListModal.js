import React, { Fragment } from "react";
import Image from "next/image";

import crossIcon from "@/assets/icons/chat/chat_mobile_icon/cross.svg";
import downArrowTooltip from "@/assets/icons/chat/downArrow.svg";

const SessionUserListModal = ({
  userlist = [],
  visible = false,
  isAttachment = false,
  onCrossClick = () => {},
  inputVal = "",
  handleSelectedCommand = (val) => {},
}) => {
  return (
    <Fragment>
      <div
        className={`commands-modal ${visible ? "commands-modal-open" : ""}  
            ${isAttachment && "commands-modal-attachment"}
            `}
      >
        <div className="head" style={{ display: "flex" }}>
          <p>User list</p>
          <Image src={crossIcon} alt="crossIcon_2" onClick={onCrossClick} />
        </div>
        <ul>
          {userlist &&
            userlist.length > 0 &&
            userlist.map((item, index) => (
              <li
                key={`command-list-${index}`}
                onClick={() => handleSelectedCommand(item)}
              >
                <p
                  className={`chat-text ${
                    item.includes(inputVal.slice(1)) ? "" : "inactive"
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
    </Fragment>
  );
};

export default SessionUserListModal;
