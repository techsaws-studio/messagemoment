import portraitMode from "@/assets/icons/chat/chat_mobile_icon/portraitMode.svg";
import Image from "next/image";
import { useEffect } from "react";

const PortraitModeModal = () => {
    
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div className="portrait-mode-container">
      <h4>Please rotate your device to Portrait mode</h4>
      <Image src={portraitMode} alt="portraitMode" />
      <p className="chat-text">MessageMoment supports Portrait mode only.</p>
    </div>
  );
};

export default PortraitModeModal;
