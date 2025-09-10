import React from "react";
import Image from "next/image";

import { chatContext } from "@/contexts/chat-context";

import { getUploadIconType } from "@/dummy-data";

import grey_cross from "@/assets/icons/chat/grey_icon.svg";

const SelectedFileView = () => {
  const { setShowAttachment, filedata } = chatContext();

  return (
    <div className="selectedfileContainer">
      <Image
        src={getUploadIconType(filedata?.type)}
        alt="selected-upload-file"
      />
      <p className="chat-small-text">
        {filedata?.name && filedata?.name.length > 15
          ? `${filedata.name.slice(0, 15)}...`
          : filedata?.name}
      </p>
      <Image
        src={grey_cross}
        id="grey_cross"
        onClick={() => setShowAttachment(false)}
      />
    </div>
  );
};

export default SelectedFileView;
