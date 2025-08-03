import React from "react";

import { chatContext } from "@/contexts/chat-context";

function LiveTypingToogleSwitch() {
  const { isLiveTypingActive, setIsLiveTypingActive } = chatContext();

  return (
    <button onClick={() => setIsLiveTypingActive(!isLiveTypingActive)}>
      {isLiveTypingActive ? "Live Typing ON" : "Live Typing OFF"}
    </button>
  );
}

export default LiveTypingToogleSwitch;
