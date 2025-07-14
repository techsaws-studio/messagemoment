import { useEffect, useState } from "react";

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
      <p className={"chat-text handlertext"}>[MessageMoment.com]</p>
      <div className="chat-text msg_txt">
        <p className="chat-text msg_txt">Requesting{dots}</p>
      </div>
    </>
  );
};

export default ChatJoiningLoader;
