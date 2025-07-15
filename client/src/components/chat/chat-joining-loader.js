import React, { useEffect, useState } from "react";

const ChatJoiningLoader = () => {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => {
        if (prev === "...") return "";
        return prev + ".";
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <p className={"chat-text handlertext"} style={{ color: "#494AF8" }}>
        [MessageMoment.com]
      </p>
      <p className="chat-text msg_txt">Requesting{dots}</p>
    </>
  );
};

export default ChatJoiningLoader;
