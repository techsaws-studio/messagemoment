import React, { Fragment, useEffect, useState } from "react";

const ChatVerifyingLoader = () => {
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

  return <Fragment>Verifying{dots}</Fragment>;
};

export default ChatVerifyingLoader;
