import React, { Fragment } from "react";

import ChatLeaveModal from "../chat-components/chat-leave-modal";
import UploadFilePopup from "../chat-components/uploadfiles-popup";
import ReportFileModal from "../chat-components/reportfile-modal";
import PortraitModeModal from "../chat-components/portraitMode-modal";

const MessagesModals = ({
  isMobileView,
  isLandscape,
  fileInputRef,
  handleFileChange,
}) => {
  const renderModals = () => {
    return (
      <>
        <ChatLeaveModal />
        <UploadFilePopup />
        <ReportFileModal />
        {isMobileView && isLandscape && <PortraitModeModal />}
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
      </>
    );
  };

  return <Fragment>{renderModals()}</Fragment>;
};

export default MessagesModals;
