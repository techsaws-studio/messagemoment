import React from "react";
import ChatLeaveModal from "../chat-components/chat-leave-modal";
import UploadFilePopup from "../chat-components/uploadfiles-popup";
import ReportFileModal from "../chat-components/reportfile-modal";
import PortraitModeModal from "../chat-components/portraitMode-modal";

/**
 * Renders various modals needed in the chat interface, based on mobile view and orientation.
 * The modals include chat leave, file upload, report file, and portrait mode modals.
 * Additionally, it renders a hidden file input element.
 * @param {boolean} isMobileView Whether the device is in mobile view.
 * @param {boolean} isLandscape Whether the device is in landscape orientation.
 * @param {React.MutableRefObject<HTMLInputElement | null>} fileInputRef The file input element reference.
 * @param {function} handleFileChange The function to be called when the user selects a file to upload.
 * @returns {React.ReactElement} The modal components.
 */
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
  return <>{renderModals()}</>;
};

export default MessagesModals;
