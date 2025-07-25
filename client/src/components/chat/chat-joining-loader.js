import React, { useEffect, useState } from "react";

const ChatJoiningLoader = () => {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => {
        if (prev === "...") return "";
        return prev + ".";
      });
    }, 400);

    return () => clearInterval(interval);
  }, []);

  return <>Requesting{dots}</>;
};

export default ChatJoiningLoader;
