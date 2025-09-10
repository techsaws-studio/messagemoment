import React, { useEffect, useRef } from "react";
import Image from "next/image";

import { chatContext } from "@/contexts/chat-context";
import useCheckIsMobileView from "@/hooks/useCheckIsMobileView";

import projectmodeTooltip from "@/assets/icons/chat/chat_mobile_icon/projectmodeTooltip2.svg";
import crossIcon from "@/assets/icons/chat/chat_mobile_icon/cross.svg";

const ProjectModeTooltip = ({ isAttachment }) => {
  const { showProjectModeTooltip, setShowProjectModeTooltip } = chatContext();
  const tooltipRef = useRef(null);
  const { isMobileView } = useCheckIsMobileView();

  const onClickReadMore = () => {
    window.open("/faqs#project_mode", "_blank");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target)) {
        setShowProjectModeTooltip(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setShowProjectModeTooltip]);

  useEffect(() => {
    if (!isMobileView) setShowProjectModeTooltip(false);
  }, [isMobileView]);

  return (
    <div
      ref={tooltipRef}
      className={`projectModetooltip
    ${showProjectModeTooltip && "projectModetooltip-open"}
    ${isAttachment && "projectModetooltip-attachment"}
    `}
    >
      <div className="header-projectmode">
        <p className="chat-text">Project Mode Active</p>
        <Image
          src={crossIcon}
          id="projectMode-cross"
          onClick={() => setShowProjectModeTooltip(false)}
          alt="crossIcon"
        />
      </div>
      <div>
        <Image
          src={projectmodeTooltip}
          draggable={false}
          alt="projectmodeTooltip"
        />
        <p onClick={onClickReadMore} className="chat-text readmore">
          Read More
        </p>
      </div>
    </div>
  );
};

export default ProjectModeTooltip;
