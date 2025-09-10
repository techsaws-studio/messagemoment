import { useEffect, useState } from "react";

import { SessionTypeEnum } from "@/enums/session-type-enum";

import { chatContext } from "@/contexts/chat-context";

const usePhantomWallet = () => {
  const [PhantomSessionApproved, setPhantomSession] = useState(false);
  const [isLoading, setLoading] = useState(true);

  const { setSessionData } = chatContext();

  useEffect(() => {
    try {
      const queryParams = new URLSearchParams(window.location.search);
      const phantomKey = queryParams.get("phantom_encryption_public_key");
      const phantomError = queryParams.get("errorCode");
      const nonce = queryParams.get("nonce");
      const data = queryParams.get("data");

      if (phantomKey && nonce && data) {
        setLoading(false);
        setSessionData((prev) => ({
          ...prev,
          type: SessionTypeEnum.WALLET,
        }));
        setPhantomSession(true);
      } else if (phantomError) {
        setSessionData((prev) => ({
          ...prev,
          type: SessionTypeEnum.WALLET,
        }));
        setPhantomSession(false);
      } else {
        setPhantomSession(false);
      }
      setLoading(false);
    } catch (error) {
      console.log("Error", error);
      setPhantomSession(false);
      setLoading(false);
    }
  }, []);

  return {
    PhantomSessionApproved,
    isLoading,
  };
};

export default usePhantomWallet;
