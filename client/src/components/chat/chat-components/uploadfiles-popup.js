import cross from "@/assets/icons/chat/cross.svg";
import uploadfile from "@/assets/icons/chat/uploadfile.svg";
import { chatContext } from "@/chat-context";
import { getUploadIconType } from "@/dummy-data";
import { Progress } from "antd";
import Image from "next/image";
import { useEffect, useState } from "react";

const UploadFilePopup = () => {
  const { showUploadModal, setShowUploadModal, filedata, setShowAttachment } =
    chatContext();
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    let interval;
    if (showUploadModal) {
      const intervalTime = 20;
      const totalTime = 2000;
      const incrementAmount = 100 / (totalTime / intervalTime);

      interval = setInterval(() => {
        setPercentage((prevValue) => {
          const newValue = prevValue + incrementAmount;
          if (newValue >= 100) {
            clearInterval(interval);
            setShowUploadModal(false);
            setTimeout(() => {
              setShowAttachment(true);
            }, 800);
            return 100;
          }
          return newValue;
        });
      }, intervalTime);
    } else {
      setPercentage(0);
    }

    return () => clearInterval(interval);
  }, [showUploadModal]);


  return (
    <div
      className={`uploadfileContainer ${
        showUploadModal && "uploadfile-modal-open"
      }`}
    >
      <div className="head">
        {/* <div> */}
        <Image src={uploadfile} alt="upload-file-icon" />
        <p>File Uploading via FileMoment.com</p>
        {/* </div> */}
        <Image
          className="cross-icon"
          src={cross}
          onClick={() => setShowUploadModal(false)}
          alt="cross"
        />
      </div>
      <div className="body">
        <div className="col-1">
          <Image src={getUploadIconType(filedata?.type)} alt="upload_icon"/>
          <div>
            <p className="chat-text filename">
              {filedata?.name && filedata?.name.length >= 15
                ? `${filedata.name.slice(0, 18)}...`
                : filedata?.name}
            </p>
            <p className="chat-text size">{filedata?.size} MB</p>
          </div>
        </div>
        {/* colo -2 */}
        <div className="col-2">
          <div>
            <p className="chat-text filename">{percentage}%</p>
            <p className="chat-text size">90KB/sec</p>
          </div>
          <div>
            <Progress
              strokeColor={"rgba(73, 74, 248, 1)"}
              showInfo={false}
              type="circle"
              percent={percentage}
              size={30}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadFilePopup;
